import { expect } from "chai";
import { ComponentFactory } from "ecs-framework";
import { mat4, vec2 } from "gl-matrix";
import "mocha";
import { CompoundPathComponent } from "../src/CompoundPathComponent";
import { CompoundPathEntityFactory } from "../src/CompoundPathEntityFactory";
import { IPathStyle, PathComponent, pathType } from "../src/PathComponent";
import { PathEntityFactory } from "../src/PathEntityFactory";
import { PointComponent } from "../src/PointComponent";

describe( "Renderer", () => {
    describe("segment path", () => {
        it("render all path from a compoundPath component", () => {});
    });
    describe("bezier path", () => {
        it("render a bezier path from a compoundPath", () => {});
        it("render multiple bezier path from a componentPath one after another ", () => {});
        it("render a compound path composed of segment paths and bezier paths one after another", () => {});
        it("render part of a bezier path to a percent different than 100", () => {});
        it("render part of bezier path from a percent differetn than 0", () => {});
        it("render a bezier path from a position different than the original starting point to a position different than the ending point", () => {});
    });
    describe("layering", () => {
        it("render multiple compoundPath in the order of their layer index", () => {});
        it("we should be able to change the layer of a compound path", () => {});
    });
    describe("rendering part of a compoundPath", () => {
        it("from a position different than the 0", () => {});
        it("to a position different than 1", () => {});
    });
    describe("style", () => {
        it("render points of all path from a compoundPath component when debuge param is set to true", () => {});
    });
});
