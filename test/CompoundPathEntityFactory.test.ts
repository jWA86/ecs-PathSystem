import { expect } from "chai";
import { ComponentFactory } from "ecs-framework";
import { mat4, vec2 } from "gl-matrix";
import "mocha";
import { cubicBezierUtil } from "../src/BezierUtil";
import { CompoundPathComponent, IPathStyle } from "../src/CompoundPathComponent";
import { CompoundPathEntityFactory } from "../src/CompoundPathEntityFactory";
import { PathComponent, pathType } from "../src/PathComponent";
import { PathEntityFactory } from "../src/PathEntityFactory";
import { PointComponent } from "../src/PointComponent";

describe("CompoundPathEntityFactory ", () => {
    let defaultStyle: IPathStyle;
    let cubicBezierPts1: vec2[] = [];
    let cubicBezierPts2: vec2[] = [];
    let segmentPts1: vec2[] = [];
    let segmentPts2: vec2[] = [];
    beforeEach(() => {
        defaultStyle = { lineWidth: 1, strokeStyle: "black", lineCap: "butt", lineJoin: "miter" };
        cubicBezierPts1 = [vec2.fromValues(100, 200), vec2.fromValues(100, 100), vec2.fromValues(250, 100), vec2.fromValues(250, 200)];
        cubicBezierPts2 = [vec2.fromValues(250, 200), vec2.fromValues(250, 300), vec2.fromValues(400, 300), vec2.fromValues(400, 200)];
        segmentPts1 = [vec2.fromValues(0.0, 0.0), vec2.fromValues(100.0, 100.0), vec2.fromValues(200.0, 100.0), vec2.fromValues(300.0, 200.0)];
        segmentPts2 = [vec2.fromValues(300.0, 300.0), vec2.fromValues(200.0, 400.0), vec2.fromValues(100.0, 400.0), vec2.fromValues(0.0, 500.0)];
    });
    describe("construction", () => {
        it("should hold a reference to a compound path component pool and a pathComponentFactory", () => {
            const pathPool = new ComponentFactory<PathComponent>(50, PathComponent, pathType.cubicBezier, 1, 4);
            const pointPool = new ComponentFactory<PointComponent>(500, PointComponent, vec2.fromValues(0.0, 0.0));
            const pathEntityFactory = new PathEntityFactory(0, 0, pointPool, pathPool);

            const compoundPathFactory = new ComponentFactory<CompoundPathComponent>(10, CompoundPathComponent, true, 0, 0);

            const compoundEntityFactory = new CompoundPathEntityFactory(0, 0, 0, compoundPathFactory, pathEntityFactory);
            expect(compoundEntityFactory.pathEntityFactory).to.equal(pathEntityFactory);
            expect(compoundEntityFactory.componentPool).to.equal(compoundPathFactory);
        });
        it("if not provided in the construction, it should create the pools and factories", () => {
            // using pool size to check factories ares created at construction
            const nbCompondPath = 11;
            const nbPath = 15;
            const nbPoints = 102;
            const entityFactory = new PathEntityFactory(nbPoints, nbPath);
            const compoundEntityFactory = new CompoundPathEntityFactory(nbCompondPath, nbPath, nbPoints);
            expect(compoundEntityFactory.componentPool.size).to.equal(nbCompondPath);
            expect(compoundEntityFactory.pathEntityFactory.pathPool.size).to.equal(nbPath);
            expect(compoundEntityFactory.pathEntityFactory.pointPool.size).to.equal(nbPoints);
        });
    });
    describe("CRUD operations", () => {
        const nbCompondPath = 10;
        const nbPath = 15;
        const nbPoints = 100;
        let compoundEntityFactory: CompoundPathEntityFactory;
        beforeEach(() => {
            compoundEntityFactory = new CompoundPathEntityFactory(nbCompondPath, nbPath, nbPoints);
        });
        describe("create", () => {
            it("be able to create a new compoundPath component in the compondPath pool", () => {
                compoundEntityFactory.create(1);
                expect(compoundEntityFactory.componentPool.get(1).entityId).to.equal(1);
            });
            it("return a compound path component", () => {
                const res = compoundEntityFactory.create(1);
                expect(res instanceof CompoundPathComponent).to.equal(true);
            });
            it("create a CompoundPath component from list of path component", () => {
                const pathEntityFactory = new PathEntityFactory(100, 10);
                const p1 = pathEntityFactory.create(1, cubicBezierPts1, pathType.cubicBezier);
                const p2 = pathEntityFactory.create(2, cubicBezierPts2, pathType.cubicBezier);
                const res = compoundEntityFactory.createFromPaths(1, pathEntityFactory, [p1.entityId, p2.entityId], false);
                expect(res.firstPathId).to.equal(1);
                expect(res.nbPath).to.equal(2);
                expect(compoundEntityFactory.pathEntityFactory.pathPool.nbCreated).to.equal(2);
                expect(compoundEntityFactory.pathEntityFactory.pointPool.nbCreated).to.equal(cubicBezierPts1.length + cubicBezierPts2.length);
            });
            it("createFromPaths should set the length of the compoundPath as the sum of all the its paths", () => {
                const pathEntityFactory = new PathEntityFactory(100, 10);
                const pBezier1 = pathEntityFactory.create(1, cubicBezierPts1, pathType.cubicBezier);
                const pBezier2 = pathEntityFactory.create(2, cubicBezierPts2, pathType.cubicBezier);
                const pPolyLine1 = pathEntityFactory.create(3, segmentPts1, pathType.polyline);
                const pPolyLine2 = pathEntityFactory.create(4, segmentPts2, pathType.polyline);

                const composition = [pBezier1.entityId, pBezier2.entityId, pPolyLine1.entityId, pPolyLine2.entityId, pBezier2.entityId];
                const res = compoundEntityFactory.createFromPaths(1, pathEntityFactory, composition, true);

                console.log("refactor length");
                const expectedLength = pBezier1.length + pBezier2.length + pPolyLine1.length + pPolyLine2.length  + pBezier2.length;

                expect(res.length).to.approximately(expectedLength, 0.1);
            });
        });
        describe("createPathAt() should", () => {
            // it("", () => {});
            // it("create a path and insert it at the end of the compound path if no pathId is provided", () => {
            // });
        });
    });

    describe("Helper function", () => {
        let compoundEntityFactory: CompoundPathEntityFactory;
        beforeEach(() => {
            compoundEntityFactory = new CompoundPathEntityFactory(100, 200, 1000);
        });
        describe("interpolation", () => {
            let bufferPathEntity: PathEntityFactory;
            let pBezier1: PathComponent;
            let pBezier2: PathComponent;
            let pPolyLine1: PathComponent;
            let pPolyLine2: PathComponent;

            beforeEach(() => {
                bufferPathEntity = new PathEntityFactory(100, 10);
                pBezier1 = bufferPathEntity.create(1, cubicBezierPts1, pathType.cubicBezier);
                pBezier2 = bufferPathEntity.create(2, cubicBezierPts2, pathType.cubicBezier);
                pPolyLine1 = bufferPathEntity.create(3, segmentPts1, pathType.polyline);
                pPolyLine2 = bufferPathEntity.create(4, segmentPts2, pathType.polyline);
            });
            it("point fall on a bezier curve", () => {
                const cp = compoundEntityFactory.createFromPaths(1, bufferPathEntity, [pBezier1.entityId, pBezier2.entityId, pPolyLine1.entityId], false);
                const t = (pBezier1.length * 0.5 ) / cp.length;
                const res = compoundEntityFactory.getPointAt(t, cp);
                // point should be the middle point of the first bezier curve
                const pt = cubicBezierUtil.getPointAt(0.5, cubicBezierPts1[0], cubicBezierPts1[1], cubicBezierPts1[2], cubicBezierPts1[3]);
                expect(res[0]).to.equal(pt[0]);
                expect(res[1]).to.equal(pt[1]);

            });
            it("point fall on a polyline", () => {
                const cp = compoundEntityFactory.createFromPaths(1, bufferPathEntity, [pBezier1.entityId, pBezier2.entityId, pPolyLine1.entityId], false);
                // point fall on the third path which is a polyline
                const t = ((pPolyLine1.length * 0.5 ) + pBezier1.length + pBezier2.length) / cp.length;
                const res = compoundEntityFactory.getPointAt(t, cp);
                // point should be between 2 control points of the polyline
                expect(isPointOnPolyline(res, segmentPts1)).to.equal(true);
            });
        });
    });
});

const isPointOnPolyline = (point: vec2, polyLinePts: vec2[]): boolean => {
    let onTheLine = false;
    for (let i = 0; i < polyLinePts.length - 1; ++i) {
        // y - y1 = slope(x - x1)
        const slope = ( polyLinePts[i + 1][1] - polyLinePts[i][1] ) / ( polyLinePts[i + 1][0] - polyLinePts[i][0] );
        const x = slope * (point[0] - polyLinePts[i][0]);
        const y = point[1] - polyLinePts[i][1];
        if (x === y) {
            onTheLine = true;
            break;
        }
    }
    return onTheLine;
};
