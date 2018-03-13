import { expect } from "chai";
import { ComponentFactory } from "ecs-framework";
import { mat4, vec2 } from "gl-matrix";
import "mocha";
import { CompoundPathComponent, IPathStyle } from "../src/CompoundPathComponent";
import { CompoundPathEntityFactory } from "../src/CompoundPathEntityFactory";
import { CompoundPathRendererSystem } from "../src/CompoundPathRenderSystem";
import { DebugCompoundPathRendererSystem } from "../src/DebugCompoundPathRenderSystem";
import { PathComponent, pathType } from "../src/PathComponent";
import { PathEntityFactory } from "../src/PathEntityFactory";
import { PointComponent } from "../src/PointComponent";
import { getPointOnCubicBezier, refImgPixelColorChecking } from "./CanvasTestHelper";

describe("Renderer", () => {
    // mocking canvas
    const canvasId = "canvas";
    document.body.innerHTML = "";
    let mockHtml;
    let canvas;
    let ctx: CanvasRenderingContext2D;
    let bufferPathFactory: PathEntityFactory;
    let renderSys: CompoundPathRendererSystem;
    let cPool: CompoundPathEntityFactory;

    // points in absolute / world coordinates
    const segmentPts1 = [vec2.fromValues(0.0, 0.0),
    vec2.fromValues(100.0, 100.0),
    vec2.fromValues(200.0, 100.0),
    vec2.fromValues(300.0, 200.0)];
    const segmentPts2 = [vec2.fromValues(300.0, 300.0),
    vec2.fromValues(200.0, 400.0),
    vec2.fromValues(100.0, 400.0),
    vec2.fromValues(0.0, 500.0)];

    const cubicBezierPts1 = [vec2.fromValues(100, 200), vec2.fromValues(100, 100), vec2.fromValues(250, 100), vec2.fromValues(250, 200)];
    const cubicBezierPts2 = [vec2.fromValues(250, 200), vec2.fromValues(250, 300), vec2.fromValues(400, 300), vec2.fromValues(400, 200)];

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

        renderSys.setFactories(cPool.componentPool, cPool.componentPool, cPool.componentPool, cPool.componentPool);
        renderSys.compoundPathEntityPool = cPool;
    });

    describe("polyline path", () => {

        it("render a polyline path from a compoundPath component", () => {
            const cId = 1;
            bufferPathFactory.create(1, segmentPts1, pathType.polyline);
            const cp1 = cPool.createFromPaths(cId, bufferPathFactory, [1]);

            renderSys.process();

            expect(cPool.componentPool.get(cId).style.strokeStyle).to.equal("red");
            // checking that ctrl points are drown on the canvas
            let data = ctx.getImageData(segmentPts1[0][0], segmentPts1[0][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            data = ctx.getImageData(segmentPts1[1][0], segmentPts1[1][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            data = ctx.getImageData(segmentPts1[2][0], segmentPts1[2][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            data = ctx.getImageData(segmentPts1[3][0], segmentPts1[3][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
        });
        it("render multiple polyline paths from a compoundPath component linked", () => {
            const cId = 1;

            bufferPathFactory.create(1, segmentPts1, pathType.polyline);
            bufferPathFactory.create(2, segmentPts2, pathType.polyline);
            const cp1 = cPool.createFromPaths(cId, bufferPathFactory, [1, 2]);

            renderSys.process();

            expect(cPool.componentPool.get(cId).style.strokeStyle).to.equal("red");
            // checking that ctrl points are drown on the canvas
            let data = ctx.getImageData(segmentPts1[0][0], segmentPts1[0][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            data = ctx.getImageData(segmentPts1[1][0], segmentPts1[1][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            data = ctx.getImageData(segmentPts1[2][0], segmentPts1[2][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            data = ctx.getImageData(segmentPts1[3][0], segmentPts1[3][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);

            data = ctx.getImageData(segmentPts2[0][0], segmentPts2[0][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            data = ctx.getImageData(segmentPts2[1][0], segmentPts2[1][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            data = ctx.getImageData(segmentPts2[2][0], segmentPts2[2][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            data = ctx.getImageData(segmentPts2[3][0], segmentPts2[3][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
        });
    });
    describe("bezier path", () => {

        it("render a bezier path from a compoundPath", () => {
            const cId = 1;

            bufferPathFactory.create(1, cubicBezierPts1, pathType.cubicBezier);
            const cp1 = cPool.createFromPaths(cId, bufferPathFactory, [1]);

            renderSys.process();

            let data = ctx.getImageData(cubicBezierPts1[0][0], cubicBezierPts1[0][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            let ptOnTheCurve = getPointOnCubicBezier(0.3, cubicBezierPts1[0], cubicBezierPts1[1], cubicBezierPts1[2], cubicBezierPts1[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]), Number(ptOnTheCurve[1]), 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            ptOnTheCurve = getPointOnCubicBezier(0.5, cubicBezierPts1[0], cubicBezierPts1[1], cubicBezierPts1[2], cubicBezierPts1[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]), Number(ptOnTheCurve[1]), 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            ptOnTheCurve = getPointOnCubicBezier(1, cubicBezierPts1[0], cubicBezierPts1[1], cubicBezierPts1[2], cubicBezierPts1[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]), Number(ptOnTheCurve[1]), 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
        });
        it("render multiple bezier path from a componentPath one after another ", () => {
            const cId = 1;

            bufferPathFactory.create(1, cubicBezierPts1, pathType.cubicBezier);
            bufferPathFactory.create(2, cubicBezierPts2, pathType.cubicBezier);
            const cp1 = cPool.createFromPaths(cId, bufferPathFactory, [1, 2]);

            renderSys.process();

            let data = ctx.getImageData(cubicBezierPts1[0][0], cubicBezierPts1[0][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            let ptOnTheCurve = getPointOnCubicBezier(0.3, cubicBezierPts1[0], cubicBezierPts1[1], cubicBezierPts1[2], cubicBezierPts1[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]), Number(ptOnTheCurve[1]), 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            ptOnTheCurve = getPointOnCubicBezier(0.5, cubicBezierPts1[0], cubicBezierPts1[1], cubicBezierPts1[2], cubicBezierPts1[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]), Number(ptOnTheCurve[1]), 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            ptOnTheCurve = getPointOnCubicBezier(1, cubicBezierPts1[0], cubicBezierPts1[1], cubicBezierPts1[2], cubicBezierPts1[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]), Number(ptOnTheCurve[1]), 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);

            data = ctx.getImageData(cubicBezierPts2[0][0], cubicBezierPts2[0][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            ptOnTheCurve = getPointOnCubicBezier(0.3, cubicBezierPts2[0], cubicBezierPts2[1], cubicBezierPts2[2], cubicBezierPts2[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]), Number(ptOnTheCurve[1]), 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            ptOnTheCurve = getPointOnCubicBezier(0.5, cubicBezierPts2[0], cubicBezierPts2[1], cubicBezierPts2[2], cubicBezierPts2[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]), Number(ptOnTheCurve[1]), 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            ptOnTheCurve = getPointOnCubicBezier(1, cubicBezierPts2[0], cubicBezierPts2[1], cubicBezierPts2[2], cubicBezierPts2[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]), Number(ptOnTheCurve[1]), 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
        });
        it("render a compound path composed of polyline paths and bezier paths linked", () => {
            const cId = 1;

            bufferPathFactory.create(1, cubicBezierPts1, pathType.cubicBezier);
            bufferPathFactory.create(2, segmentPts2, pathType.polyline);
            bufferPathFactory.create(3, cubicBezierPts2, pathType.cubicBezier);
            bufferPathFactory.create(4, segmentPts1, pathType.polyline);
            const cp1 = cPool.createFromPaths(cId, bufferPathFactory, [1, 2, 3, 4]);

            renderSys.process();

            // when cubic bezier follow a polyline we should not skip the first points of the cubic bezier

            let data = ctx.getImageData(cubicBezierPts1[0][0], cubicBezierPts1[0][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            let ptOnTheCurve = getPointOnCubicBezier(0.5, cubicBezierPts1[0], cubicBezierPts1[1], cubicBezierPts1[2], cubicBezierPts1[3]);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            ptOnTheCurve = getPointOnCubicBezier(1, cubicBezierPts1[0], cubicBezierPts1[1], cubicBezierPts1[2], cubicBezierPts1[3]);

            data = ctx.getImageData(segmentPts1[0][0], segmentPts1[0][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            data = ctx.getImageData(segmentPts1[1][0], segmentPts1[1][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            data = ctx.getImageData(segmentPts1[2][0], segmentPts1[2][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            data = ctx.getImageData(segmentPts1[3][0], segmentPts1[3][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);

            ptOnTheCurve = getPointOnCubicBezier(0, cubicBezierPts2[0], cubicBezierPts2[1], cubicBezierPts2[2], cubicBezierPts2[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]), Number(ptOnTheCurve[1]), 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            ptOnTheCurve = getPointOnCubicBezier(0.5, cubicBezierPts2[0], cubicBezierPts2[1], cubicBezierPts2[2], cubicBezierPts2[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]), Number(ptOnTheCurve[1]), 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            ptOnTheCurve = getPointOnCubicBezier(1, cubicBezierPts2[0], cubicBezierPts2[1], cubicBezierPts2[2], cubicBezierPts2[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]), Number(ptOnTheCurve[1]), 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);

            data = ctx.getImageData(segmentPts2[0][0], segmentPts2[0][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            data = ctx.getImageData(segmentPts2[1][0], segmentPts2[1][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            data = ctx.getImageData(segmentPts2[2][0], segmentPts2[2][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            data = ctx.getImageData(segmentPts2[3][0], segmentPts2[3][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);

        });
        //     it("render part of a bezier path to a percent different than 100", () => {return false;});
        //     it("render part of bezier path from a percent differetn than 0", () => {return false;});
        //     it("render a bezier path from a position different than the original starting point to a position different than the ending point", () => {return false;});
    });
    // describe("layering", () => {
    //     it("render multiple compoundPath in the order of their layer index", () => {return false;});
    //     it("we should be able to change the layer of a compound path", () => {return false;});
    // });
    // describe("rendering part of a compoundPath", () => {
    //     it("from a position different than the 0", () => {return false;});
    //     it("to a position different than 1", () => {return false;});
    // });
    describe("Presentation", () => {
        it("translate a compoundPath", () => {
            bufferPathFactory.create(1, cubicBezierPts1, pathType.cubicBezier);
            bufferPathFactory.create(2, segmentPts2, pathType.polyline);
            bufferPathFactory.create(3, cubicBezierPts2, pathType.cubicBezier);

            const cp1 = cPool.createFromPaths(1, bufferPathFactory, [2, 3]);
            const tx = 50;
            const ty = 50;
            mat4.translate(cp1.transform, cp1.transform, [tx, ty, 1]);

            // create a second component and make sure it's undergo the previous transformation
            const cp2 = cPool.createFromPaths(2, bufferPathFactory, [1]);

            renderSys.process();

            let ptOnTheCurve = getPointOnCubicBezier(0, segmentPts2[0], segmentPts2[1], segmentPts2[2], segmentPts2[3]);
            let data = ctx.getImageData(Number(ptOnTheCurve[0]) + tx, Number(ptOnTheCurve[1]) + ty, 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            ptOnTheCurve = getPointOnCubicBezier(0.5, segmentPts2[0], segmentPts2[1], segmentPts2[2], segmentPts2[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]) + tx, Number(ptOnTheCurve[1]) + ty, 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            ptOnTheCurve = getPointOnCubicBezier(1, segmentPts2[0], segmentPts2[1], segmentPts2[2], segmentPts2[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]) + tx, Number(ptOnTheCurve[1]) + ty, 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);

            ptOnTheCurve = getPointOnCubicBezier(0, cubicBezierPts2[0], cubicBezierPts2[1], cubicBezierPts2[2], cubicBezierPts2[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]) + tx, Number(ptOnTheCurve[1]) + ty, 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            ptOnTheCurve = getPointOnCubicBezier(0.5, cubicBezierPts2[0], cubicBezierPts2[1], cubicBezierPts2[2], cubicBezierPts2[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]) + tx, Number(ptOnTheCurve[1]) + ty, 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            ptOnTheCurve = getPointOnCubicBezier(1, cubicBezierPts2[0], cubicBezierPts2[1], cubicBezierPts2[2], cubicBezierPts2[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]) + tx, Number(ptOnTheCurve[1]) + ty, 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);

            // should not be translated
            ptOnTheCurve = getPointOnCubicBezier(0, cubicBezierPts1[0], cubicBezierPts1[1], cubicBezierPts1[2], cubicBezierPts1[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]), Number(ptOnTheCurve[1]), 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            ptOnTheCurve = getPointOnCubicBezier(0.5, cubicBezierPts1[0], cubicBezierPts1[1], cubicBezierPts1[2], cubicBezierPts1[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]), Number(ptOnTheCurve[1]), 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            ptOnTheCurve = getPointOnCubicBezier(1, cubicBezierPts1[0], cubicBezierPts1[1], cubicBezierPts1[2], cubicBezierPts1[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]), Number(ptOnTheCurve[1]), 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
        });
        it("scale a compountPath", () => {
            bufferPathFactory.create(1, cubicBezierPts1, pathType.cubicBezier);
            bufferPathFactory.create(2, segmentPts2, pathType.polyline);
            bufferPathFactory.create(3, cubicBezierPts2, pathType.cubicBezier);
            // make the linewidth biger since we downscale, so we avoid sampling a pixel on the border of the line which would be of lighter color than the center of the line
            cPool.defaultStyle.lineWidth = 10;
            const cp1 = cPool.createFromPaths(1, bufferPathFactory, [2, 3]);
            const sx = 0.5;
            const sy = 0.5;
            mat4.scale(cp1.transform, cp1.transform, [sx, sy, 1]);

            // create a second component and make sure it's undergo the previous transformation
            const cp2 = cPool.createFromPaths(2, bufferPathFactory, [1]);

            renderSys.process();

            let ptOnTheCurve = getPointOnCubicBezier(0, segmentPts2[0], segmentPts2[1], segmentPts2[2], segmentPts2[3]);
            let data = ctx.getImageData(Number(ptOnTheCurve[0]) * sx, Number(ptOnTheCurve[1]) * sy, 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            ptOnTheCurve = getPointOnCubicBezier(0.5, segmentPts2[0], segmentPts2[1], segmentPts2[2], segmentPts2[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]) * sx, Number(ptOnTheCurve[1]) * sy, 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            ptOnTheCurve = getPointOnCubicBezier(1, segmentPts2[0], segmentPts2[1], segmentPts2[2], segmentPts2[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]) * sx, Number(ptOnTheCurve[1]) * sy, 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);

            ptOnTheCurve = getPointOnCubicBezier(0, cubicBezierPts2[0], cubicBezierPts2[1], cubicBezierPts2[2], cubicBezierPts2[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]) * sx, Number(ptOnTheCurve[1]) * sy, 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            ptOnTheCurve = getPointOnCubicBezier(0.5, cubicBezierPts2[0], cubicBezierPts2[1], cubicBezierPts2[2], cubicBezierPts2[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]) * sx, Number(ptOnTheCurve[1]) * sy, 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            ptOnTheCurve = getPointOnCubicBezier(1, cubicBezierPts2[0], cubicBezierPts2[1], cubicBezierPts2[2], cubicBezierPts2[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]) * sx, Number(ptOnTheCurve[1]) * sy, 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);

            // should not be translated
            ptOnTheCurve = getPointOnCubicBezier(0, cubicBezierPts1[0], cubicBezierPts1[1], cubicBezierPts1[2], cubicBezierPts1[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]), Number(ptOnTheCurve[1]), 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            ptOnTheCurve = getPointOnCubicBezier(0.5, cubicBezierPts1[0], cubicBezierPts1[1], cubicBezierPts1[2], cubicBezierPts1[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]), Number(ptOnTheCurve[1]), 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            ptOnTheCurve = getPointOnCubicBezier(1, cubicBezierPts1[0], cubicBezierPts1[1], cubicBezierPts1[2], cubicBezierPts1[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]), Number(ptOnTheCurve[1]), 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
        });
        it("rotate", () => {
            const bezierC = [vec2.fromValues(0, 0), vec2.fromValues(0, 100), vec2.fromValues(150, 100), vec2.fromValues(150, 0)];
            bufferPathFactory.create(1, cubicBezierPts1, pathType.cubicBezier);
            // bufferPathFactory.create(2, segmentPts2, pathType.polyline);
            bufferPathFactory.create(3, bezierC, pathType.cubicBezier);
            // make the linewidth biger since we downscale, so we avoid sampling a pixel on the border of the line which would be of lighter color than the center of the line
            const cp1 = cPool.createFromPaths(1, bufferPathFactory, [3]);

            // Translate then rotate so it render at the place of cubicBezier 1
            mat4.translate(cp1.transform, cp1.transform, [cubicBezierPts2[0][0], cubicBezierPts2[0][1], 1]);
            mat4.rotateZ(cp1.transform, cp1.transform, Math.PI);

            renderSys.process();

            const cubicBezier1 = [vec2.fromValues(100, 200), vec2.fromValues(100, 100), vec2.fromValues(250, 100), vec2.fromValues(250, 200)];

            let ptOnTheCurve = getPointOnCubicBezier(0, cubicBezier1[0], cubicBezier1[1], cubicBezier1[2], cubicBezier1[3]);
            let data = ctx.getImageData(Number(ptOnTheCurve[0]), Number(ptOnTheCurve[1]), 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            ptOnTheCurve = getPointOnCubicBezier(0.5, cubicBezier1[0], cubicBezier1[1], cubicBezier1[2], cubicBezier1[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]), Number(ptOnTheCurve[1]), 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            ptOnTheCurve = getPointOnCubicBezier(1, cubicBezier1[0], cubicBezier1[1], cubicBezier1[2], cubicBezier1[3]);
            data = ctx.getImageData(Number(ptOnTheCurve[0]), Number(ptOnTheCurve[1]), 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
        });
    });
});
