import { expect } from "chai";
import { vec2 } from "gl-matrix";
import { pathType } from "../src/PathComponent";

export { refImgPixelColorChecking, samplePath, getPointOnCubicBezier };

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

const samplePath = (sampleRange: {from: number, to: number}, nbSample: number, ctrlPts: vec2[], type: pathType, callBack: (sampledPoint: vec2) => any ) => {
    nbSample = Math.abs(Math.floor(nbSample));
    switch (type) {
        case pathType.polyline:
        samplePolyLine(sampleRange, nbSample, ctrlPts, callBack);
        break;
        case pathType.cubicBezier:
        sampleCubicBezier(sampleRange, nbSample, ctrlPts, callBack);
        break;
        default:
        break;
    }
};

const samplePolyLine = (sampleRange: {from: number, to: number}, nbSamplePerSegment: number, ctrlPts: vec2[], callBack: (samplePoint: vec2) => any) => {
    const totalLength = polyLineLength(ctrlPts);
    const fromAbs = sampleRange.from * totalLength;
    const toAbs = sampleRange.to * totalLength;
    let accumulatedDist = 0;
    let reachedEnd = false;
    for (let i = 0; i < ctrlPts.length - 1; ++i) {
        const segLength = vec2.dist(ctrlPts[i], ctrlPts[i + 1]);
        accumulatedDist += segLength;
        if (accumulatedDist >= fromAbs && !reachedEnd) {
            const segmentStart = accumulatedDist - segLength;
            const segFrom = (fromAbs - segmentStart) <= 0 ? 0 : (fromAbs - segmentStart);
            reachedEnd = (accumulatedDist >= toAbs);
            const segTo = reachedEnd ? (segLength - (accumulatedDist - toAbs)) : segLength;

            const fromVec = vec2.create();
            vec2.lerp(fromVec, ctrlPts[i], ctrlPts[i + 1], segFrom / segLength);
            const toVec = vec2.create();
            vec2.lerp(toVec, ctrlPts[i], ctrlPts[i + 1], segTo / segLength);

            sampleLine(nbSamplePerSegment, fromVec, toVec, callBack);
        }
    }
};

const polyLineLength = (ctrlPts: vec2[]) => {
    return ctrlPts.reduce((accumulator, c, i) => {
        if (i !== ctrlPts.length - 1) {
            accumulator += vec2.dist(c, ctrlPts[i + 1]);
        }
        return accumulator;
    }, 0);
};

const sampleLine = (nbSample, pt0, pt1, callBack: (pt: vec2) => any) => {
    const length = vec2.dist(pt0, pt1);
    const interval = length / nbSample;
    const res = vec2.create();
    for (let s = 0; s < nbSample + 1; ++s) {
        const t = (interval * s) / length;
        vec2.lerp(res, pt0, pt1, t);
        callBack(res);
    }
};

const sampleCubicBezier = (sampleRange: { from: number, to: number }, nbSample: number, ctrlPts: vec2[], callBack: (samplePoint: vec2) => any) => {
    const interval = (sampleRange.to - sampleRange.from) / nbSample;
    for (let s = 0; s < nbSample + 1; ++s) {
        const t = (interval * s) + sampleRange.from;
        const res = getPointOnCubicBezier(t, ctrlPts[0], ctrlPts[1], ctrlPts[2], ctrlPts[3]);
        callBack(res);
    }
};

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
