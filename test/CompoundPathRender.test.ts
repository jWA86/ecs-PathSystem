import { expect } from "chai";
import { ComponentFactory } from "ecs-framework";
import { mat4, vec2 } from "gl-matrix";
import "mocha";
import { CompoundPathComponent } from "../src/CompoundPathComponent";
import { CompoundPathEntityFactory } from "../src/CompoundPathEntityFactory";
import { CompoundPathRendererSystem } from "../src/CompoundPathRenderSystem";
import { IPathStyle, PathComponent, pathType } from "../src/PathComponent";
import { PathEntityFactory } from "../src/PathEntityFactory";
import { PointComponent } from "../src/PointComponent";

describe( "Renderer", () => {
    // mocking canvas
    const canvasId = "canvas";
    document.body.innerHTML = "";
    let mockHtml;
    let canvas;
    let ctx: CanvasRenderingContext2D;
    let bufferPathFactory: PathEntityFactory;

    beforeEach(() => {
        // remove the canvas before recreating one for each test
        document.body.innerHTML = "";
        mockHtml = '<canvas id="canvas" width="800" height="600"></canvas>';
        document.body.innerHTML = mockHtml;
        bufferPathFactory = new PathEntityFactory(1000, 100);
        bufferPathFactory.defaultStyle.lineWidth = 2;
        bufferPathFactory.defaultStyle.strokeStyle = "red";
        canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        ctx = canvas.getContext("2d");
    });

    describe("polyline path", () => {
        const segmentPts1 = [vec2.fromValues(0.0, 10.0), vec2.fromValues(10.0, 10.0), vec2.fromValues(20.0, 10.0), vec2.fromValues(30.0, 20.0)];
        const segmentPts2 = [vec2.fromValues(0.0, 30.0), vec2.fromValues(10.0, 20.0), vec2.fromValues(20.0, 10.0), vec2.fromValues(30.0, 0.0)];
        it("render a polyline path from a compoundPath component", () => {
            const cId = 1;
            const renderSys = new CompoundPathRendererSystem(ctx);
            const cPool = new CompoundPathEntityFactory(10, 100, 1000);

            bufferPathFactory.create(1, segmentPts1, pathType.polyline);
            const cp1 = cPool.createFromPaths(cId, bufferPathFactory, [1]);

            renderSys.setFactories(cPool.componentPool, cPool.componentPool, cPool.componentPool);
            renderSys.compoundPathEntityPool = cPool;
            renderSys.process();

            expect(cPool.pathEntityFactory.getPathComponent(cPool.componentPool.get(cId).firstPathId).style.strokeStyle).to.equal("red");
            let data = ctx.getImageData(100, 100, 1, 1); // nothing is supposed to be drawn here
            refImgPixelColorChecking(data, 0, 0, 0, 0);
            // checking that ctrl points are drown on the canvas
            data = ctx.getImageData(segmentPts1[0][0], segmentPts1[0][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            data = ctx.getImageData(segmentPts1[1][0], segmentPts1[1][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            data = ctx.getImageData(segmentPts1[2][0], segmentPts1[2][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
            data = ctx.getImageData(segmentPts1[3][0], segmentPts1[3][1], 1, 1);
            refImgPixelColorChecking(data, 255, 0, 0, 255);
        });
        it("render multiple polyline path from a compoundPath component one after another", () => {});
    });
    describe("bezier path", () => {
        it("render a bezier path from a compoundPath", () => {});
        it("render multiple bezier path from a componentPath one after another ", () => {});
        it("render a compound path composed of segment paths and bezier paths one after another", () => {});
        it("render part of a bezier path to a percent different than 100", () => {});
        it("render part of bezier path from a percent differetn than 0", () => {});
        it("render a bezier path from a position different than the original starting point to a position different than the ending point", () => {});
    });
    describe("layering", () => {
        it("render multiple compoundPath in the order of their layer index", () => {});
        it("we should be able to change the layer of a compound path", () => {});
    });
    describe("rendering part of a compoundPath", () => {
        it("from a position different than the 0", () => {});
        it("to a position different than 1", () => {});
    });
    describe("style", () => {
        it("render points of all path from a compoundPath component when debuge param is set to true", () => {});
    });
});

// Checking that the pixel is of the given color
const refImgPixelColorChecking = (pixel: ImageData, r: number, g: number, b: number, a: number) => {
    expect(pixel.data[0]).to.equal(r);
    expect(pixel.data[1]).to.equal(g);
    expect(pixel.data[2]).to.equal(b);
    expect(pixel.data[3]).to.equal(a);
};
