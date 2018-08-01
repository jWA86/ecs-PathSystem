/// <reference types="gl-matrix" />
import { vec2 } from "gl-matrix";
import { pathType } from "../src/PathComponent";
export { isPointOnPolyline, refImgPixelColorChecking, samplePath, getPointOnCubicBezier };
/**
 * Expect the pixel color to equal the given rgb component
 * @param pixel
 * @param r
 * @param g
 * @param b
 * @param a
 */
declare const refImgPixelColorChecking: (pixel: ImageData, r: number, g: number, b: number, a: number) => void;
declare const samplePath: (sampleRange: {
    from: number;
    to: number;
}, nbSample: number, ctrlPts: vec2[], type: pathType, callBack: (sampledPoint: vec2) => any) => void;
/**
 * Return a point at given interval on cubic bezier parameter curve space
 * @param t Position between 0 and 1
 * @param p0
 * @param p1
 * @param p2
 * @param p3
 */
declare const getPointOnCubicBezier: (t: number, p0: vec2, p1: vec2, p2: vec2, p3: vec2) => vec2;
declare const isPointOnPolyline: (point: vec2, polyLinePts: vec2[]) => boolean;
