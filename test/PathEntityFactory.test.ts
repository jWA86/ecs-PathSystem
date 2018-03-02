import { expect } from "chai";
import { ComponentFactory } from "ecs-framework";
import { mat4, vec2 } from "gl-matrix";
import "mocha";
import { PathComponent, pathType  } from "../src/PathComponent";
import { PathEntityFactory } from "../src/PathEntityFactory";
import { PointComponent } from "../src/PointComponent";

describe("PathEntityFactory ", () => {

    describe("construction", () => {
        it("should hold a reference to a path component pool and a point component pool", () => {
            const pathFactory = new ComponentFactory<PathComponent>(50, PathComponent, pathType.cubicBezier, 1, 4);
            const pointFactory = new ComponentFactory<PointComponent>(500, PointComponent, vec2.fromValues(0.0, 0.0));
            const entityFactory = new PathEntityFactory(0, 0, pointFactory, pathFactory);
            expect(entityFactory.pathPool).to.equal(pathFactory);
            expect(entityFactory.pointPool).to.equal(pointFactory);
        });
        it("if not provided in the construction, it should create the pools", () => {
            const nbPath = 10;
            const nbPoints = 100;
            const entityFactory = new PathEntityFactory(nbPoints, nbPath);
            expect(entityFactory.pathPool.size).to.equal(nbPath);
            expect(entityFactory.pointPool.size).to.equal(nbPoints);
        });
    });
    describe("create() should", () => {
        let pathFactory: ComponentFactory<PathComponent>;
        let pointFactory: ComponentFactory<PointComponent>;
        let entityFactory: PathEntityFactory;
        beforeEach(() => {
            pathFactory = new ComponentFactory<PathComponent>(10, PathComponent, pathType.polyline, 0, 0);
            pointFactory = new ComponentFactory<PointComponent>(100, PointComponent, vec2.fromValues(0.0, 0.0));
            entityFactory = new PathEntityFactory(0, 0, pointFactory, pathFactory);
        });
        it("create Path component along its points in the appropriete pool", () => {
            const points = [];
            points.push(vec2.fromValues(1.0, 1.0));
            points.push(vec2.fromValues(2.0, 2.0));
            points.push(vec2.fromValues(3.0, 3.0));
            points.push(vec2.fromValues(4.0, 4.0));
            const points2 = points.map((p) => {
                const v = vec2.create();
                vec2.add(v, p, [.5, .5]);
                return v;
            });
            entityFactory.create(1, points, pathType.cubicBezier);
            entityFactory.create(2, points2, pathType.cubicBezier);
            let pId = 1;
            while (pId <= 2) {
                const c = entityFactory.pathPool.get(pId);
                // point pool is supposed to be empty before we create a path entity
                // therefore the first point id should be 1
                console.log(c.firstPtId);
                expect(c.firstPtId).to.equal((pId - 1 ) * points.length + 1);
                expect(c.nbPt).to.equal(points.length);
                expect(c.type).to.equal(pathType.cubicBezier);
                pId += 1;
            }
            // checking that points are created in the point pool
            const pt1 = entityFactory.pointPool.get(1).point;
            expect(vec2.distance(pt1, points[0])).to.equal(0);
            const pt2 = entityFactory.pointPool.get(2).point;
            expect(vec2.distance(pt2, points[1])).to.equal(0);
            const pt3 = entityFactory.pointPool.get(3).point;
            expect(vec2.distance(pt3, points[2])).to.equal(0);
            const pt4 = entityFactory.pointPool.get(4).point;
            expect(vec2.distance(pt4, points[3])).to.equal(0);

            const pt21 = entityFactory.pointPool.get(5).point;
            expect(vec2.distance(pt21, points2[0])).to.equal(0);
            const pt22 = entityFactory.pointPool.get(6).point;
            expect(vec2.distance(pt22, points2[1])).to.equal(0);
            const pt23 = entityFactory.pointPool.get(7).point;
            expect(vec2.distance(pt23, points2[2])).to.equal(0);
            const pt24 = entityFactory.pointPool.get(8).point;
            expect(vec2.distance(pt24, points2[3])).to.equal(0);

        });
        it("return a PathComponent", () => {
            const res: any = entityFactory.create(1, [vec2.fromValues(1.0, 1.0)], pathType.polyline);
            expect(res instanceof PathComponent).to.equal(true);
            expect(res.entityId).to.equal(1);
        });
        // it("if the entity already exist it should fire an error", () =>{
        //     let path1:any = entityFactory.create(1, [vec2.fromValues(1.0, 1.0)], pathType.polyline, defaultStyle);
        //     try {
        //         let path2:any = entityFactory.create(1, [vec2.fromValues(2.0, 2.0)], pathType.cubicBezier, defaultStyle);
        //     }catch(e) {
        //         expect(e instanceof Error).to.equal(true);
        //     }
        // });
        it("if the number of points provided are < 1 it should fire an error", () => {
            try {
                const path1: any = entityFactory.create(1, [], pathType.polyline);
            } catch (e) {
                expect(e instanceof Error).to.equal(true);
            }
        });
    });
    describe("get ", () => {
        it("getPathComponent should return the Path Component with the id provided", () => {
            const entityFactory = new PathEntityFactory(100, 10);
            entityFactory.create(1, [vec2.create()], pathType.polyline);
            entityFactory.create(2, [vec2.create()], pathType.cubicBezier);
            expect(entityFactory.getPathComponent(2).type).to.equal(pathType.cubicBezier);

        });
        it("getLastPathId should return the id of the last path component in the pool, so we can work with incremental id", () => {
            const entityFactory = new PathEntityFactory(100, 10);
            entityFactory.create(3, [vec2.create()], pathType.polyline);
            entityFactory.create(1, [vec2.create()], pathType.cubicBezier);
            expect(entityFactory.pathPool.nbCreated).to.equal(2);
            expect(entityFactory.getLastPathId()).to.equal(1);
        });
    });

});
