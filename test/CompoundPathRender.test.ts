import { expect } from "chai";
import { ComponentFactory } from "ecs-framework";
import { mat4, vec2 } from "gl-matrix";
import "mocha";
import { CompoundPathComponent, IPathStyle } from "../src/CompoundPathComponent";
import { CompoundPathEntityFactory } from "../src/CompoundPathEntityFactory";
import { CompoundPathRendererSystem } from "../src/CompoundPathRenderSystem";
import { PathComponent, pathType } from "../src/PathComponent";
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
        canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        ctx = canvas.getContext("2d");
    });

    describe("polyline path", () => {
        const segmentPts1 = [vec2.fromValues(0.0, 0.0),
             vec2.fromValues(100.0, 100.0),
              vec2.fromValues(200.0, 100.0),
               vec2.fromValues(300.0, 200.0)];
        const segmentPts2 = [vec2.fromValues(300.0, 300.0),
             vec2.fromValues(200.0, 400.0),
              vec2.fromValues(100.0, 400.0),
               vec2.fromValues(0.0, 500.0)];
        it("render a polyline path from a compoundPath component", () => {
            const cId = 1;
            const renderSys = new CompoundPathRendererSystem(ctx);
            const cPool = new CompoundPathEntityFactory(10, 100, 1000);
            cPool.defaultStyle.lineWidth = 5;
            cPool.defaultStyle.strokeStyle = "red";
            cPool.defaultStyle.lineCap = "square";

            bufferPathFactory.create(1, segmentPts1, pathType.polyline);
            const cp1 = cPool.createFromPaths(cId, bufferPathFactory, [1]);

            renderSys.setFactories(cPool.componentPool, cPool.componentPool, cPool.componentPool);
            renderSys.compoundPathEntityPool = cPool;
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
            const renderSys = new CompoundPathRendererSystem(ctx);
            const cPool = new CompoundPathEntityFactory(10, 100, 1000);
            cPool.defaultStyle.lineWidth = 5;
            cPool.defaultStyle.strokeStyle = "red";
            cPool.defaultStyle.lineCap = "square";

            bufferPathFactory.create(1, segmentPts1, pathType.polyline);
            bufferPathFactory.create(2, segmentPts2, pathType.polyline);
            const cp1 = cPool.createFromPaths(cId, bufferPathFactory, [1, 2]);

            renderSys.setFactories(cPool.componentPool, cPool.componentPool, cPool.componentPool);
            renderSys.compoundPathEntityPool = cPool;
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
    // describe("bezier path", () => {
    //     it("render a bezier path from a compoundPath", () => { return false; });
    //     it("render multiple bezier path from a componentPath one after another ", () => {return false; });
    //     it("render a compound path composed of segment paths and bezier paths one after another", () => {return false;});
    //     it("render part of a bezier path to a percent different than 100", () => {return false;});
    //     it("render part of bezier path from a percent differetn than 0", () => {return false;});
    //     it("render a bezier path from a position different than the original starting point to a position different than the ending point", () => {return false;});
    // });
    // describe("layering", () => {
    //     it("render multiple compoundPath in the order of their layer index", () => {return false;});
    //     it("we should be able to change the layer of a compound path", () => {return false;});
    // });
    // describe("rendering part of a compoundPath", () => {
    //     it("from a position different than the 0", () => {return false;});
    //     it("to a position different than 1", () => {return false;});
    // });
    // describe("style", () => {
    //     it("render points of all path from a compoundPath component when debuge param is set to true", () => {return false;});
    // });
});

// Checking that the pixel is of the given color
const refImgPixelColorChecking = (pixel: ImageData, r: number, g: number, b: number, a: number) => {
    expect(pixel.data[0]).to.equal(r);
    expect(pixel.data[1]).to.equal(g);
    expect(pixel.data[2]).to.equal(b);
    expect(pixel.data[3]).to.equal(a);
};
