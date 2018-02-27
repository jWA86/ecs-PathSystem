import { expect } from "chai";
import "mocha";
import { IPathStyle, PathComponent, pathType } from "../src/PathComponent";

describe("Path component should ", () => {
    const ID = {
        currentId: 0,
        next: () => {
            this.currentId += 1;
            return this.currentId;
        },
    };
    const defaultStyle: IPathStyle = {lineWidth: 1, strokeStyle: "black", lineCap: "butt", lineJoin: "miter"};

    it("hold the type of path it represent", () => {
        const myCubicPath = new PathComponent(ID.next(), true, pathType.cubicBezier, 1, 4, defaultStyle);
        const myLinePath = new PathComponent(ID.next(), true, pathType.polyline, 1, 2, defaultStyle);
        expect(myCubicPath.type).to.equal(pathType.cubicBezier);
        expect(myLinePath.type).to.equal(pathType.polyline);
    });
    it("hold the id of the first point that compose the path from the points pool", () => {
        const myPath = new PathComponent(ID.next(), true, pathType.polyline, 1, 2, defaultStyle);
        expect(myPath.firstPtId).to.equal(1);
    });
    it("hold the number of points that compose the path", () => {
        // a path of line that is composed of 6 points (5 segments)
        const nbPt = 6;
        const myPath = new PathComponent(ID.next(), true, pathType.polyline, 1, nbPt, defaultStyle);
        expect(myPath.nbPt).to.equal(nbPt);
    });
    it("hold stroke style information", () => {
        const color = "blue";
        const cap = "round";
        const join = "round";
        const width = 5;
        const style: IPathStyle = {lineWidth: width, strokeStyle: color, lineCap: cap, lineJoin: join};
        const myPath = new PathComponent(ID.next(), true, pathType.polyline, 1, 2, style);
        expect(myPath.style.lineWidth).to.equal(width);
        expect(myPath.style.strokeStyle).to.equal(color);
        expect(myPath.style.lineCap).to.equal(cap);
        expect(myPath.style.lineJoin).to.equal(join);
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
