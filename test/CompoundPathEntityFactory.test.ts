import { expect } from "chai";
import "mocha";
import { ComponentFactory } from "ecs-framework";
import { mat4, vec2 } from "gl-matrix";
import { PathComponent, pathType, IPathStyle } from "../src/PathComponent";
import { CompoundPathEntityFactory } from "../src/CompoundPathEntityFactory";
import { PathEntityFactory } from "../src/PathEntityFactory";
import { PointComponent } from "../src/PointComponent";
import { CompoundPathComponent } from "../src/CompoundPathComponent";

describe("CompoundPathEntityFactory ", () => {
    let defaultStyle: IPathStyle;
    beforeEach(() => {
        defaultStyle = { lineWidth: 1, strokeStyle: "black", lineCap: "butt", lineJoin: "miter" };
    });
    describe("construction", () => {
        it("should hold a reference to a compound path component pool and a pathComponentFactory", () => {
            const pathPool = new ComponentFactory<PathComponent>(50, PathComponent, pathType.cubicBezier, 1, 4, defaultStyle);
            const pointPool = new ComponentFactory<PointComponent>(500, PointComponent, vec2.fromValues(0.0, 0.0));
            const pathEntityFactory = new PathEntityFactory(0, 0, pointPool, pathPool);

            const compoundPathFactory = new ComponentFactory<CompoundPathComponent>(10, CompoundPathComponent, true, 0, 0);

            const compoundEntityFactory = new CompoundPathEntityFactory(0, 0, 0, compoundPathFactory, pathEntityFactory)
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
        describe("create() should", () => {
            const cubicBezierPts1 = [vec2.fromValues(100, 200), vec2.fromValues(100, 100), vec2.fromValues(250, 100), vec2.fromValues(250, 200)];
            const cubicBezierPts2 = [vec2.fromValues(250, 200), vec2.fromValues(250, 300), vec2.fromValues(400, 300), vec2.fromValues(400, 200)];
            it("be able to create a new compoundPath component in the compondPath pool", () => {
                compoundEntityFactory.create(1);
                expect(compoundEntityFactory.componentPool.get(1).entityId).to.equal(1);
            });
            it("return a compound path component", () => {
                const res = compoundEntityFactory.create(1);
                expect(res instanceof CompoundPathComponent).to.equal(true);
            });
            it("create a component path with the path component provided", () => {
                const pathEntityFactory = new PathEntityFactory(100, 10);
                const p1 = pathEntityFactory.create(1, cubicBezierPts1, pathType.cubicBezier);
                const p2 = pathEntityFactory.create(2, cubicBezierPts2, pathType.cubicBezier);
                const res = compoundEntityFactory.create(1, [p1, p2]);
                expect(res.firstPathId).to.equal(1);
                expect(res.nbPath).to.equal(2);
                expect(compoundEntityFactory.pathEntityFactory.pathPool.nbCreated).to.equal(2);
                expect(compoundEntityFactory.pathEntityFactory.pointPool.nbCreated).to.equal(cubicBezierPts1.length + cubicBezierPts2.length);
            });
        });
        describe("createPathAt() should", () => {
            it("")
            it("create a path and insert it at the end of the compound path if no pathId is provided", () => {
                // expect(compoundEntityFactory.componentPool.nbCreated).to.equal(0);
                // expect(compoundEntityFactory.pathEntityFactory.pathPool.nbCreated).to.equal(0);
                // expect(compoundEntityFactory.pathEntityFactory.pointPool.nbCreated).to.equal(0);
                // let res = compoundEntityFactory.create(1);
                // expect(res).to.not.equal(null || undefined);
                // let cubicBezierPts = [vec2.fromValues(100, 200),
                //      vec2.fromValues(100, 100),
                //       vec2.fromValues(250, 100),
                //        vec2.fromValues(250, 200)];
                // compoundEntityFactory.createPathAt(res.entityId, cubicBezierPts, pathType.cubicBezier);
                // expect(res.firstPathId).to.equal(1);
                // expect(res.nbPath).to.equal(1);
                
                // expect(compoundEntityFactory.pathEntityFactory.pathPool.get(1).firstPtId).to.equal(1);
                // expect(compoundEntityFactory.pathEntityFactory.pathPool.get(1).nbPt).to.equal(cubicBezierPts.length);
                //     // have to check with a path in the middle of the pool 
            });
        });
    });
});
