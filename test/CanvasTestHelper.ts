import { expect } from "chai";
import { vec2 } from "gl-matrix";

export { refImgPixelColorChecking, getPointOnCubicBezier };

/**
 * Expect the pixel color to equal the given rgb component
 * @param pixel
 * @param r
 * @param g
 * @param b
 * @param a
 */
const refImgPixelColorChecking = (pixel: ImageData, r: number, g: number, b: number, a: number) => {
    expect(pixel.data[0]).to.equal(r);
    expect(pixel.data[1]).to.equal(g);
    expect(pixel.data[2]).to.equal(b);
    expect(pixel.data[3]).to.equal(a);
};
// get point at a position on the curves parameter space

/**
 * Return a point at given interval on cubic bezier parameter curve space
 * @param t Position between 0 and 1
 * @param p0
 * @param p1
 * @param p2
 * @param p3
 */
const getPointOnCubicBezier = (t: number, p0: vec2, p1: vec2, p2: vec2, p3: vec2) => {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;
    const p = vec2.create();

    vec2.scale(p, p0, uuu);
    vec2.scaleAndAdd(p, p, p1, 3 * uu * t);
    vec2.scaleAndAdd(p, p, p2, 3 * u * tt);
    vec2.scaleAndAdd(p, p, p3, ttt);

    return p;
};
