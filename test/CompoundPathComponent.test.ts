import { expect } from "chai";
import "mocha";
import { ComponentFactory } from "ecs-framework";
import { CompoundPathComponent } from "../src/CompoundPathComponent";

describe("Compound path component should ", () => {
    it("have a proprety that allow toggling visibility", () => {
        let visibility = false;
        const cp = new CompoundPathComponent(1, true, visibility, 0, 0);
        expect(cp.visible).to.equal(visibility);
        cp.visible = true;
        expect(cp.visible).to.equal(true);
    });
    it("holds the id of the first path", () => {
        const idPath = 1;
        const cp = new CompoundPathComponent(1, true, true, idPath, 0);
        expect(cp.firstPathId).to.equal(idPath);
    });
    it("holds the number of path that compose the compound path", () => {
        const nbPath = 2;
        const cp = new CompoundPathComponent(1, true, true, 0, nbPath);
        expect(cp.nbPath).to.equal(nbPath);
    });
    
});