import { expect } from "chai";
import { ComponentFactory } from "ecs-framework";
import { mat4, vec2 } from "gl-matrix";
import "mocha";
import { CompoundPathComponent, IPathStyle } from "../src/CompoundPathComponent";
import { CompoundPathEntityFactory } from "../src/CompoundPathEntityFactory";
import { CompoundPathRendererSystem, ICompoundPathRendererParams } from "../src/CompoundPathRenderSystem";
import { DebugCompoundPathRendererSystem } from "../src/DebugCompoundPathRenderSystem";
import { PathComponent, pathType } from "../src/PathComponent";
import { PathEntityFactory } from "../src/PathEntityFactory";
import { PointComponent } from "../src/PointComponent";
import { refImgPixelColorChecking } from "./CanvasTestHelper";

describe("Debug", () => {

    // mocking canvas
    const canvasId = "canvas";
    document.body.innerHTML = "";
    let mockHtml;
    let canvas;
    let ctx: CanvasRenderingContext2D;
    let bufferPathFactory: PathEntityFactory;
    let renderSys: CompoundPathRendererSystem;
    let cPool: CompoundPathEntityFactory;

    const defaultCompoundPathRendererParams: ICompoundPathRendererParams = {
        f: { firstPathId: 0 },
        l: { length: 0 },
        n: { nbPath: 0 },
        s: { style: { lineWidth: 1, strokeStyle: "black", lineCap: "square", lineJoin: "miter" } },
        tra: { transform: mat4.create() },
        tri: { trim: {from: 0, to: 0} },
    };

    const DEBUG_RED = 0;
    const DEBUG_GREEN = 0;
    const DEBUG_BLUE = 255;
    const debugColorString = `rgba(${DEBUG_RED}, ${DEBUG_GREEN}, ${DEBUG_BLUE}, 255)`;
    const debugStyle = { radius: 4, fillStyle: debugColorString, lineWidth: 0.5, strokeStyle: debugColorString };

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
        renderSys = new CompoundPathRendererSystem(defaultCompoundPathRendererParams, ctx);
        cPool = new CompoundPathEntityFactory(10, 100, 1000);
        cPool.defaultStyle.lineWidth = 5;
        cPool.defaultStyle.strokeStyle = "red";
        cPool.defaultStyle.lineCap = "square";
    });

    it("render control points from a compoundPath component as points when debuge param is set to true", () => {
        const cId = 1;

        bufferPathFactory.create(2, segmentPts2, pathType.polyline);
        bufferPathFactory.create(3, cubicBezierPts2, pathType.cubicBezier);
        const debugSys = new DebugCompoundPathRendererSystem(defaultCompoundPathRendererParams, ctx, debugStyle);
        debugSys.setParamsSource(cPool.componentPool, cPool.componentPool, cPool.componentPool, cPool.componentPool);
        debugSys.compoundPathEntityPool = cPool;
        const cp1 = cPool.createFromPaths(cId, bufferPathFactory, [2, 3]);
        debugSys.process();

        let data = ctx.getImageData(segmentPts2[0][0], segmentPts2[0][1], 1, 1);
        refImgPixelColorChecking(data, DEBUG_RED, DEBUG_GREEN, DEBUG_BLUE, 255);
        data = ctx.getImageData(segmentPts2[1][0], segmentPts2[1][1], 1, 1);
        refImgPixelColorChecking(data, DEBUG_RED, DEBUG_GREEN, DEBUG_BLUE, 255);
        data = ctx.getImageData(segmentPts2[2][0], segmentPts2[2][1], 1, 1);
        refImgPixelColorChecking(data, DEBUG_RED, DEBUG_GREEN, DEBUG_BLUE, 255);
        data = ctx.getImageData(segmentPts2[3][0], segmentPts2[3][1], 1, 1);
        refImgPixelColorChecking(data, DEBUG_RED, DEBUG_GREEN, DEBUG_BLUE, 255);

        data = ctx.getImageData(cubicBezierPts2[0][0], cubicBezierPts2[0][1], 1, 1);
        refImgPixelColorChecking(data, DEBUG_RED, DEBUG_GREEN, DEBUG_BLUE, 255);
        data = ctx.getImageData(cubicBezierPts2[1][0], cubicBezierPts2[1][1], 1, 1);
        refImgPixelColorChecking(data, DEBUG_RED, DEBUG_GREEN, DEBUG_BLUE, 255);
        data = ctx.getImageData(cubicBezierPts2[2][0], cubicBezierPts2[2][1], 1, 1);
        refImgPixelColorChecking(data, DEBUG_RED, DEBUG_GREEN, DEBUG_BLUE, 255);
        data = ctx.getImageData(cubicBezierPts2[3][0], cubicBezierPts2[3][1], 1, 1);
        refImgPixelColorChecking(data, DEBUG_RED, DEBUG_GREEN, DEBUG_BLUE, 255);
    });
});
