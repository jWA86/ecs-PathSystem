import { expect } from "chai";
import { mat4, vec2 } from "gl-matrix";
import "mocha";
import { cubicBezierUtil } from "../src/BezierUtil";
import { CompoundPathEntityFactory } from "../src/CompoundPathEntityFactory";

describe("Bezier util", () => {
    const X = 0;
    const Y = 1;
    const absPointPath1 = [vec2.fromValues(100, 200), vec2.fromValues(100, 100), vec2.fromValues(250, 100), vec2.fromValues(250, 200), vec2.fromValues(250, 300), vec2.fromValues(400, 300), vec2.fromValues(400, 200)];
    it("give a point on the curve at given value t (between 0 and 1)", () => {
        const p = absPointPath1;
        let res = cubicBezierUtil.getPointAt(0, p[0], p[1], p[2], p[3]);
        expect(res[X]).to.equal(p[0][X]);
        expect(res[Y]).to.equal(p[0][Y]);
        res = cubicBezierUtil.getPointAt(1, p[0], p[1], p[2], p[3]);
        expect(res[X]).to.equal(p[3][X]);
        expect(res[Y]).to.equal(p[3][Y]);
    });
    it("trim a cubic bezier curve", () => {
        // trim of 0 to 1 should return the same bezier curve
        const p = absPointPath1;
        const res = [vec2.create(), vec2.create(), vec2.create(), vec2.create()];
        cubicBezierUtil.trim(0, 1, p[0], p[1], p[2], p[3], res);
        expect(res[0][X]).to.equal(p[0][X]);
        expect(res[0][Y]).to.equal(p[0][Y]);
        expect(res[1][X]).to.equal(p[1][X]);
        expect(res[1][Y]).to.equal(p[1][Y]);
        expect(res[2][X]).to.equal(p[2][X]);
        expect(res[2][Y]).to.equal(p[2][Y]);
        expect(res[3][X]).to.equal(p[3][X]);
        expect(res[3][Y]).to.equal(p[3][Y]);

        cubicBezierUtil.trim(0.25, 0.75, p[0], p[1], p[2], p[3], res);
        const p025 = cubicBezierUtil.getPointAt(0.25, p[0], p[1], p[2], p[3]);
        expect(res[0][X]).to.equal(p025[X]);
        expect(res[0][Y]).to.equal(p025[Y]);
        const p075 = cubicBezierUtil.getPointAt(0.75, p[0], p[1], p[2], p[3]);
        expect(res[3][X]).to.equal(p075[X]);
        expect(res[3][Y]).to.equal(p075[Y]);

    });
    it("compute the length of a cubic bezier curve", () => {
        const p = absPointPath1;
        const precision = 0.8;
        const res = cubicBezierUtil.lengthByLineInterpolation(p[0], p[1], p[2], p[3], precision);
        expect(res).to.be.greaterThan(vec2.distance(p[0], p[3]));
    });
    it("be able to place points at regular interval on the curve", () => {

    });
});
