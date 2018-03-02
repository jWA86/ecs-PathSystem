import { expect } from "chai";
import { ComponentFactory } from "ecs-framework";
import "mocha";
import { CompoundPathComponent, IPathStyle } from "../src/CompoundPathComponent";
import { pathType } from "../src/PathComponent";

describe("Compound path component should ", () => {
    const defaultStyle: IPathStyle = {lineWidth: 1, strokeStyle: "black", lineCap: "butt", lineJoin: "miter"};

    const ID = {
        currentId: 0,
        next: () => {
            this.currentId += 1;
            return this.currentId;
        },
    };

    it("have a proprety that allow toggling visibility", () => {
        const visibility = false;
        const cp = new CompoundPathComponent(1, true, visibility, 0, 0, defaultStyle);
        expect(cp.visible).to.equal(visibility);
        cp.visible = true;
        expect(cp.visible).to.equal(true);
    });
    it("holds the id of the first path", () => {
        const idPath = 1;
        const cp = new CompoundPathComponent(1, true, true, idPath, 0, defaultStyle);
        expect(cp.firstPathId).to.equal(idPath);
    });
    it("holds the number of path that compose the compound path", () => {
        const nbPath = 2;
        const cp = new CompoundPathComponent(1, true, true, 0, nbPath, defaultStyle);
        expect(cp.nbPath).to.equal(nbPath);
    });
    it("hold stroke style information", () => {
        const color = "blue";
        const cap = "round";
        const join = "round";
        const width = 5;
        const style: IPathStyle = {lineWidth: width, strokeStyle: color, lineCap: cap, lineJoin: join};
        const myCPath = new CompoundPathComponent(ID.next(), true, true, 1, 2, style);
        expect(myCPath.style.lineWidth).to.equal(width);
        expect(myCPath.style.strokeStyle).to.equal(color);
        expect(myCPath.style.lineCap).to.equal(cap);
        expect(myCPath.style.lineJoin).to.equal(join);
    });

});
