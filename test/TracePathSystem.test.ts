import { expect } from "chai";
import { ComponentFactory } from "ecs-framework";
import { mat4, vec2 } from "gl-matrix";
import "mocha";
import { CompoundPathComponent, IPathStyle } from "../src/CompoundPathComponent";
import { CompoundPathEntityFactory } from "../src/CompoundPathEntityFactory";
import { CompoundPathRendererSystem, ICompoundPathRendererParams } from "../src/CompoundPathRenderSystem";
import { BUFFER_NB_POINTS, X, Y } from "../src/config";
import { DebugCompoundPathRendererSystem } from "../src/DebugCompoundPathRenderSystem";
import { PathComponent, pathType } from "../src/PathComponent";
import { PathEntityFactory } from "../src/PathEntityFactory";
import { PointComponent } from "../src/PointComponent";
import { MouseComponent, TracePathSystem } from "../src/TracePathSystem";

describe("Trace", () => {
    // mocking canvas
    const canvasId = "canvas";
    document.body.innerHTML = "";
    let mockHtml;
    let canvas;
    let ctx: CanvasRenderingContext2D;
    let bufferPathFactory: PathEntityFactory;
    let renderSys: CompoundPathRendererSystem;
    let cPool: CompoundPathEntityFactory;
    let mouseC: MouseComponent;

    const firstPt = vec2.fromValues(10, 20);
    const secondPt = vec2.fromValues(20, 40);
    const thirdPt = vec2.fromValues(40, 60);

    beforeEach(() => {
        // remove the canvas before recreating one for each test
        document.body.innerHTML = "";
        mockHtml = '<canvas id="canvas" width="800" height="600"></canvas>';
        document.body.innerHTML = mockHtml;
        bufferPathFactory = new PathEntityFactory(1000, 100);
        canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        ctx = canvas.getContext("2d");
        renderSys = new CompoundPathRendererSystem(ctx);
        cPool = new CompoundPathEntityFactory(10, 100, 1000);
        cPool.defaultStyle.lineWidth = 5;
        cPool.defaultStyle.strokeStyle = "red";
        cPool.defaultStyle.lineCap = "square";

        renderSys.setParamSource("*", cPool.componentPool);
        renderSys.compoundPathEntityPool = cPool;

        mouseC = new MouseComponent(1, true, vec2.fromValues(0.0, 0.0), false);
    });
    it("Create a bufferFactory at construction for holding the tracing", () => {
        const traceSys = new TracePathSystem(mouseC, cPool);
        expect(traceSys.bufferFactory.pointPool.size).to.equal(BUFFER_NB_POINTS);
    });
    it("Create a new polyline path at first click/touch", () => {
        const traceSys = new TracePathSystem(mouseC, cPool);
        const firstPtX = 10;
        const firstPtY = 20;

        expect(traceSys.bufferFactory.pathPool.nbCreated).to.equal(0);
        expect(traceSys.bufferFactory.pointPool.nbCreated).to.equal(0);

        setMouseCoordinates(mouseC, [firstPtX, firstPtY], true);
        traceSys.process();
        expect(traceSys.bufferFactory.pathPool.nbCreated).to.equal(1);
        expect(traceSys.bufferFactory.pointPool.nbCreated).to.equal(1);
        expect(traceSys.bufferFactory.pointPool.values[0].point[0]).to.equal(firstPtX);
        expect(traceSys.bufferFactory.pointPool.values[0].point[1]).to.equal(firstPtY);

    });
    it("Record mouse/touch inputs coordinates while the mouse is pressed ", () => {
        const traceSys = new TracePathSystem(mouseC, cPool);

        expect(traceSys.bufferFactory.pathPool.nbCreated).to.equal(0);
        expect(traceSys.bufferFactory.pointPool.nbCreated).to.equal(0);

        setMouseCoordinates(mouseC, firstPt, true);
        traceSys.process();
        setMouseCoordinates(mouseC, secondPt, true);
        traceSys.process();
        setMouseCoordinates(mouseC, thirdPt, true);
        traceSys.process();
        expect(traceSys.bufferFactory.pathPool.nbCreated).to.equal(1);
        expect(traceSys.bufferFactory.pointPool.nbCreated).to.equal(3);
        expect(traceSys.bufferFactory.pointPool.values[0].point[0]).to.equal(firstPt[0]);
        expect(traceSys.bufferFactory.pointPool.values[0].point[1]).to.equal(firstPt[1]);
        expect(traceSys.bufferFactory.pointPool.values[1].point[0]).to.equal(secondPt[0]);
        expect(traceSys.bufferFactory.pointPool.values[1].point[1]).to.equal(secondPt[1]);
        expect(traceSys.bufferFactory.pointPool.values[2].point[0]).to.equal(thirdPt[0]);
        expect(traceSys.bufferFactory.pointPool.values[2].point[1]).to.equal(thirdPt[1]);
    });
    // it("Record a timestamp for each coordinate record", () => {

    // });
    it("It should not record input that are of distance under the interval specified at construction", () => {
        const minInterval = 30;
        const traceSys = new TracePathSystem(mouseC, cPool, minInterval);

        expect(traceSys.bufferFactory.pathPool.nbCreated).to.equal(0);
        expect(traceSys.bufferFactory.pointPool.nbCreated).to.equal(0);

        setMouseCoordinates(mouseC, firstPt, true);
        traceSys.process();
        setMouseCoordinates(mouseC, secondPt, true);
        traceSys.process();
        // should not record the second point since distance from the previous point too small
        expect(traceSys.bufferFactory.pointPool.nbCreated).to.not.equal(2);
        setMouseCoordinates(mouseC, thirdPt, true);
        traceSys.process();
        expect(traceSys.bufferFactory.pathPool.nbCreated).to.equal(1);
        expect(traceSys.bufferFactory.pointPool.nbCreated).to.equal(2);
        expect(traceSys.bufferFactory.pointPool.values[0].point[0]).to.equal(firstPt[0]);
        expect(traceSys.bufferFactory.pointPool.values[0].point[1]).to.equal(firstPt[1]);
        expect(traceSys.bufferFactory.pointPool.values[1].point[0]).to.equal(thirdPt[0]);
        expect(traceSys.bufferFactory.pointPool.values[1].point[1]).to.equal(thirdPt[1]);
    });
    it("When the tracing is finished create a compoundPath in the main pool and copy the path", () => {
        const traceSys = new TracePathSystem(mouseC, cPool);

        expect(traceSys.bufferFactory.pathPool.nbCreated).to.equal(0);
        expect(traceSys.bufferFactory.pointPool.nbCreated).to.equal(0);
        expect(traceSys.destionationFactory.componentPool.nbCreated).to.equal(0);

        setMouseCoordinates(mouseC, firstPt, true);
        traceSys.process();
        setMouseCoordinates(mouseC, secondPt, true);
        traceSys.process();
        setMouseCoordinates(mouseC, thirdPt, true);
        traceSys.process();
        // mouse released
        setMouseCoordinates(mouseC, [0, 0], false);
        traceSys.process();

        expect(traceSys.destionationFactory.componentPool.nbCreated).to.equal(1);
        expect(traceSys.destionationFactory.componentPool.get(1).nbPath).to.equal(1);
        const id = traceSys.destionationFactory.componentPool.get(1).firstPathId;
        expect(traceSys.destionationFactory.pathEntityFactory.getPathComponent(id).nbPt).to.equal(3);
        const vals = traceSys.destionationFactory.pathEntityFactory.pointPool.values;
        expect(vals[0].point[0]).to.equal(firstPt[0]);
        expect(vals[0].point[1]).to.equal(firstPt[1]);
        expect(vals[1].point[0]).to.equal(secondPt[0]);
        expect(vals[1].point[1]).to.equal(secondPt[1]);
        expect(vals[2].point[0]).to.equal(thirdPt[0]);
        expect(vals[2].point[1]).to.equal(thirdPt[1]);

    });
    it("End the recording of mouse coordinates when the mouse/touch is released", () => {
        const traceSys = new TracePathSystem(mouseC, cPool);

        expect(traceSys.bufferFactory.pathPool.nbCreated).to.equal(0);
        expect(traceSys.bufferFactory.pointPool.nbCreated).to.equal(0);

        setMouseCoordinates(mouseC, firstPt, true);
        traceSys.process();
        setMouseCoordinates(mouseC, secondPt, true);
        traceSys.process();
        // should not record the last point since the mouse button is released
        setMouseCoordinates(mouseC, thirdPt, false);
        traceSys.process();

        // checking in the destionPool since we earase the buffer at the end of a tracing
        expect(traceSys.destionationFactory.pathEntityFactory.pathPool.nbCreated).to.equal(1);
        expect(traceSys.destionationFactory.pathEntityFactory.pointPool.nbCreated).to.equal(2);

        expect(traceSys.destionationFactory.pathEntityFactory.pointPool.values[0].point[X]).to.equal(firstPt[X]);
        expect(traceSys.destionationFactory.pathEntityFactory.pointPool.values[0].point[Y]).to.equal(firstPt[Y]);
        expect(traceSys.destionationFactory.pathEntityFactory.pointPool.values[1].point[X]).to.equal(secondPt[X]);
        expect(traceSys.destionationFactory.pathEntityFactory.pointPool.values[1].point[Y]).to.equal(secondPt[Y]);
    });
    it("When the tracing is finished the buffer should be reset", () => {
        const traceSys = new TracePathSystem(mouseC, cPool);

        expect(traceSys.bufferFactory.pathPool.nbCreated).to.equal(0);
        expect(traceSys.bufferFactory.pointPool.nbCreated).to.equal(0);
        expect(traceSys.destionationFactory.componentPool.nbCreated).to.equal(0);

        setMouseCoordinates(mouseC, firstPt, true);
        traceSys.process();
        setMouseCoordinates(mouseC, secondPt, true);
        traceSys.process();
        setMouseCoordinates(mouseC, thirdPt, true);
        traceSys.process();
        // mouse released
        setMouseCoordinates(mouseC, [0, 0], false);
        traceSys.process();

        expect(traceSys.bufferFactory.getPathComponent(1).nbPt).to.equal(0);
        expect(traceSys.bufferFactory.pointPool.nbCreated).to.equal(0);
    });
    it("If the nb of points in the current tracing exceed the buffer size it should allocate more free slot", () => {
        const traceSys = new TracePathSystem(mouseC, cPool);

        const poolSize = traceSys.bufferFactory.pointPool.size;
        const remainingSlotBeforeResize  = 20;
        traceSys.resizeWhenFreeSlotLeft = remainingSlotBeforeResize;
        for (let i = 0; i < poolSize - remainingSlotBeforeResize + 1; ++i) {
            setMouseCoordinates(mouseC, [i * 20, i  * 20], true);
            traceSys.process();
        }
        expect(traceSys.bufferFactory.pointPool.size).to.equal(poolSize);
        const refPt = vec2.fromValues(1.0, 1.0);
        setMouseCoordinates(mouseC, refPt, true);
        traceSys.process();
        expect(traceSys.bufferFactory.pointPool.size).to.be.greaterThan(poolSize);
    });
    it("When copying buffer to the destination pool, we should check if the destination pool has enought space, if not it should allocate more space", () => {
        const compoundPoolSize = 2;
        const pathPoolSize = 2;
        const pointPoolSize = 2;
        const destPool = new CompoundPathEntityFactory(compoundPoolSize, pathPoolSize, pointPoolSize);
        const traceSys = new TracePathSystem(mouseC, destPool);

        const bufferPoolSize = traceSys.bufferFactory.pointPool.size;
        for (let i = 0; i < bufferPoolSize / 2; ++i) {
            setMouseCoordinates(mouseC, [i * 20, i  * 20], true);
            traceSys.process();
        }
        setMouseCoordinates(mouseC, [1, 1], false);
        traceSys.process();
        const destCompoundPoolSize = traceSys.destionationFactory.componentPool.size;
        expect(destCompoundPoolSize).to.be.greaterThan(compoundPoolSize);
        const destPathPoolSize = traceSys.destionationFactory.pathEntityFactory.pathPool.size;
        expect(destPathPoolSize).to.be.greaterThan(pathPoolSize);
        const destPointPoolSize = traceSys.destionationFactory.pathEntityFactory.pointPool.size;
        expect(destPointPoolSize).to.be.greaterThan(pointPoolSize);
    });
    describe("Rendering", () => {
        it("Smooth the path while the user trace it", () => {

        });
        it("Path style while tracing could be different than the definite style", () => {

        });
    });
});

const setMouseCoordinates = (mouse: MouseComponent, coordinates: vec2 | [number, number], pressed: boolean) => {
    mouse.position[0] = coordinates[0];
    mouse.position[1] = coordinates[1];
    mouse.pressed = pressed;
};
