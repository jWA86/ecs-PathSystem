import { expect } from "chai";
import "mocha";
import { PathComponent, pathType } from "../src/PathComponent";

describe("Path component should ", () => {
    const ID = {
        currentId: 0,
        next: () => {
            this.currentId += 1;
            return this.currentId;
        },
    };
    it("hold the type of path it represent", () => {
        const myCubicPath = new PathComponent(ID.next(), true, pathType.cubicBezier, 1, 4);
        const myLinePath = new PathComponent(ID.next(), true, pathType.polyline, 1, 2);
        expect(myCubicPath.type).to.equal(pathType.cubicBezier);
        expect(myLinePath.type).to.equal(pathType.polyline);
    });
    it("hold the id of the first point that compose the path from the points pool", () => {
        const myPath = new PathComponent(ID.next(), true, pathType.polyline, 1, 2);
        expect(myPath.firstPtId).to.equal(1);
    });
    it("hold the number of points that compose the path", () => {
        // a path of line that is composed of 6 points (5 segments)
        const nbPt = 6;
        const myPath = new PathComponent(ID.next(), true, pathType.polyline, 1, nbPt);
        expect(myPath.nbPt).to.equal(nbPt);
    });

    describe("length of a path", () => {
        describe("type segment", () => {
            it("holds the length of the path", () => {});
            it("give the coordinate of the point on the path at a given percent (0 to 1) ", () => {});
        });
        describe("bezier path", () => {
            it("holds the length of the path", () => {});
            it("give the coordinate of the point on the path at a given percent (0 to 1) ", () => {});
            it("should be able to render points at a regular interval in order to judge of the precision of the integration", () => {});
        });
    });
});
