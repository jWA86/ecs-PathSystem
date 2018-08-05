import { expect } from "chai";
import { mat4 } from "gl-matrix";
import "mocha";
import { CompoundPathComponent, IPathStyle } from "../src/CompoundPathComponent";

describe("Compound path component should ", () => {
    const defaultStyle: IPathStyle = {lineWidth: 1, strokeStyle: "black", lineCap: "butt", lineJoin: "miter"};

    const ID = {
        currentId: 0,
        next: () => {
            this.currentId += 1;
            return this.currentId;
        },
    };

    let myCPath: CompoundPathComponent;
    beforeEach(() => {
        myCPath = new CompoundPathComponent(ID.next(), true, true, 0, 0, defaultStyle, mat4.create(), 0, 1, 0);
    });

    it("have a proprety that allow toggling visibility", () => {
        const visibility = false;
        myCPath.visible = visibility;
        expect(myCPath.visible).to.equal(visibility);
        myCPath.visible = true;
        expect(myCPath.visible).to.equal(true);
    });
    it("holds the id of the first path", () => {
        const idPath = 1;
        myCPath.firstPathId = idPath;
        expect(myCPath.firstPathId).to.equal(idPath);
    });
    it("holds the number of path that compose the compound path", () => {
        const nbPath = 2;
        myCPath.nbPath = nbPath;
        expect(myCPath.nbPath).to.equal(nbPath);
    });
    it("holds stroke style information", () => {
        const color = "blue";
        const cap = "round";
        const join = "round";
        const width = 5;
        const style: IPathStyle = {lineWidth: width, strokeStyle: color, lineCap: cap, lineJoin: join};
        myCPath.style = style;
        expect(myCPath.style.lineWidth).to.equal(width);
        expect(myCPath.style.strokeStyle).to.equal(color);
        expect(myCPath.style.lineCap).to.equal(cap);
        expect(myCPath.style.lineJoin).to.equal(join);
    });
    it("holds a transformation matrix", () => {
        myCPath.transform = mat4.create();
        expect(myCPath.transform[0]).to.equal(1);
        expect(myCPath.transform[5]).to.equal(1);
        expect(myCPath.transform[10]).to.equal(1);
        expect(myCPath.transform[15]).to.equal(1);
    });
    it("holds information on percentage to draw", () => {
        const from = 0.5;
        const to = 0.75;
        myCPath.trimFrom = from;
        myCPath.trimTo = to;
        expect(myCPath.trimFrom).to.equal(from);
        expect(myCPath.trimTo).to.equal(to);
    });
    it("holds the total length of the compound path", () => {
        const length = 10;
        myCPath.length = length;
        expect(myCPath.length).to.equal(length);
    });
});
