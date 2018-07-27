import { expect } from "chai";
import { ComponentFactory } from "ecs-framework";
import { mat4, vec2 } from "gl-matrix";
import "mocha";
import { X, Y } from "../src/config";
import { PathComponent, pathType } from "../src/PathComponent";
import { PathEntityFactory } from "../src/PathEntityFactory";
import { PointComponent } from "../src/PointComponent";
import { isPointOnPolyline } from "./CanvasTestHelper";

describe("PathEntityFactory ", () => {

    describe("construction", () => {
        it("should hold a reference to a path component pool and a point component pool", () => {
            const pathFactory = new ComponentFactory<PathComponent>(50, new PathComponent(0, true, pathType.cubicBezier, 1, 4, 0));
            const pointFactory = new ComponentFactory<PointComponent>(500, new PointComponent(0, true, vec2.fromValues(0.0, 0.0)));
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
    describe("create should", () => {
        let pathFactory: ComponentFactory<PathComponent>;
        let pointFactory: ComponentFactory<PointComponent>;
        let entityFactory: PathEntityFactory;
        beforeEach(() => {
            pathFactory = new ComponentFactory<PathComponent>(10, new PathComponent(0, true, pathType.polyline, 0, 0, 0));
            pointFactory = new ComponentFactory<PointComponent>(100, new PointComponent(0, true, vec2.fromValues(0.0, 0.0)));
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
                expect(c.firstPtId).to.equal((pId - 1) * points.length + 1);
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
            const res: any = entityFactory.create(1, [vec2.create(), vec2.fromValues(1.0, 1.0)], pathType.polyline);
            const compareObject = new PathComponent(0, true, pathType.cubicBezier, 0, 0, 0);
            const compountPCKeys = Object.keys(compareObject);
            const keys = Object.keys(res);
            expect(keys.length).to.equal(compountPCKeys.length);
            keys.forEach((k, i) => {
                expect(k).to.equal(compountPCKeys[i]);
            });
            // // mat4 is serialize as an litteral object, therefore instanceof doesn't work
            // expect(res instanceof PathComponent).to.equal(true);
            expect(res.entityId).to.equal(1);
        });
        it("should compute the length of a polyline path and store it in the component", () => {
            const p1 = vec2.fromValues(0.0, 0.0);
            const p2 = vec2.fromValues(10.0, 10.0);
            const p3 = vec2.fromValues(20.0, 20.0);
            const p4 = vec2.fromValues(30.0, 30.0);
            let dist = vec2.distance(p1, p2);
            dist += vec2.distance(p2, p3);
            dist += vec2.distance(p3, p4);
            const res: any = entityFactory.create(1, [p1, p2, p3, p4], pathType.polyline);
            expect(res.length).to.equal(dist);
        });
        it("should compute the length of a bezier curve and store it in the component", () => {
            const p1 = vec2.fromValues(0.0, 0.0);
            const p2 = vec2.fromValues(10.0, 10.0);
            const p3 = vec2.fromValues(20.0, 20.0);
            const p4 = vec2.fromValues(30.0, 30.0);
            let dist = vec2.distance(p1, p2);
            dist += vec2.distance(p2, p3);
            dist += vec2.distance(p3, p4);
            const res: any = entityFactory.create(1, [p1, p2, p3, p4], pathType.cubicBezier);
            expect(res.length).to.be.greaterThan(0);
            // cubicbezier length should be different thant the distance between points of polyline
            expect(res.length).to.not.equal(dist);
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
            entityFactory.create(1, [vec2.create(), vec2.create()], pathType.polyline);
            entityFactory.create(2, [vec2.create(), vec2.create()], pathType.cubicBezier);
            expect(entityFactory.getPathComponent(2).type).to.equal(pathType.cubicBezier);

        });
        it("getLastPathId should return the id of the last path component in the pool, so we can work with incremental id", () => {
            const entityFactory = new PathEntityFactory(100, 10);
            entityFactory.create(3, [vec2.create(), vec2.create()], pathType.polyline);
            entityFactory.create(1, [vec2.create(), vec2.create()], pathType.cubicBezier);
            expect(entityFactory.pathPool.nbCreated).to.equal(2);
            expect(entityFactory.getLastPathId()).to.equal(1);
        });
    });
    describe("createPathComponent", () => {
        it("should compute and set the length of a path at creation", () => {
            const entityFactory = new PathEntityFactory(10, 2);
            // entityFactory.pathPool.create(1, true);
            const p1 = entityFactory.pointPool.create(1, true);
            p1.point = vec2.fromValues(0.0, 0.0);
            const p2 = entityFactory.pointPool.create(2, true);
            p2.point = vec2.fromValues(10.0, 10.0);
            const p3 = entityFactory.pointPool.create(3, true);
            p3.point = vec2.fromValues(20.0, 20.0);
            const p4 = entityFactory.pointPool.create(4, true);
            p3.point = vec2.fromValues(30.0, 30.0);

            let dist = vec2.distance(p1.point, p2.point);
            dist += vec2.distance(p2.point, p3.point);
            dist += vec2.distance(p3.point, p4.point);

            const res = entityFactory.createPathComponent(1, 1, 4, pathType.polyline);
            expect(res.length).to.equal(dist);
        });
    });
    describe("Trim path", () => {
        describe("Polyline", () => {
            it("'from' and 'to' end on the same segment", () => {
                const entityFactory = new PathEntityFactory(10, 2);
                const p1 = entityFactory.pointPool.create(1, true);
                p1.point = vec2.fromValues(0.0, 0.0);
                const p2 = entityFactory.pointPool.create(2, true);
                p2.point = vec2.fromValues(10.0, 10.0);
                const p3 = entityFactory.pointPool.create(3, true);
                p3.point = vec2.fromValues(20.0, 20.0);

                const path = entityFactory.createPathComponent(1, 1, 3, pathType.polyline);

                const out: vec2[] = [];
                entityFactory.trimPolyline(entityFactory.getPathComponent(1), { from: 0.10, to: 0.30 }, out);

                // since from and to ended on the same segment
                // it should return only one segment (2 points)
                expect(out.length).to.equal(2);

                expect(out[0][X]).to.not.equal(out[1][X]);
                expect(out[0][Y]).to.not.equal(out[1][Y]);

                expect(out[0][X]).to.lessThan(p2.point[X]);
                expect(out[0][Y]).to.lessThan(p2.point[Y]);

                expect(out[1][X]).to.lessThan(p2.point[X]);
                expect(out[1][Y]).to.lessThan(p2.point[Y]);

                const res0 = isPointOnPolyline(out[0], [p1.point, p2.point]);
                const res1 = isPointOnPolyline(out[1], [p1.point, p2.point]);
                expect(res0).to.equal(true);
                expect(res1).to.equal(true);
            });
            it("'from' and 'to' end on different segment", () => {
                const entityFactory = new PathEntityFactory(10, 2);
                const p1 = entityFactory.pointPool.create(1, true);
                p1.point = vec2.fromValues(0.0, 0.0);
                const p2 = entityFactory.pointPool.create(2, true);
                p2.point = vec2.fromValues(10.0, 10.0);
                const p3 = entityFactory.pointPool.create(3, true);
                p3.point = vec2.fromValues(20.0, 20.0);
                const p4 = entityFactory.pointPool.create(4, true);
                p3.point = vec2.fromValues(30.0, 30.0);

                const res = entityFactory.createPathComponent(1, 1, 4, pathType.polyline);

                const out: vec2[] = [];
                entityFactory.trimPolyline(entityFactory.getPathComponent(1), { from: 0.1, to: 0.9 }, out);

                expect(out.length).to.equal(4);

                expect(out[0][X]).to.not.equal(p1.point[X]);
                expect(out[0][Y]).to.not.equal(p1.point[Y]);

                expect(out[1][X]).to.equal(p2.point[X]);
                expect(out[1][Y]).to.equal(p2.point[Y]);

                expect(out[2][X]).to.equal(p3.point[X]);
                expect(out[2][Y]).to.equal(p3.point[Y]);

                expect(out[3][X]).to.not.equal(p4.point[X]);
                expect(out[3][Y]).to.not.equal(p4.point[Y]);

            });
        });
    });
});
