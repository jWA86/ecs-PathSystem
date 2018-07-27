/// <reference types="gl-matrix" />
import { vec2 } from "gl-matrix";
export { cubicBezierUtil };
declare const cubicBezierUtil: {
    getPointAt(t: number, p0: vec2, p1: vec2, p2: vec2, p3: vec2): vec2;
    lengthByLineInterpolation(p0: vec2, p1: vec2, p2: vec2, p3: vec2, precision: number): number;
    trim: (t0: number, t1: number, p0: vec2, p1: vec2, p2: vec2, p3: vec2, out: vec2[]) => void;
};
