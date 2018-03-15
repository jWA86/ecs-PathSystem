import { mat4, vec2, vec4 } from "gl-matrix";
import { isIPv4 } from "net";
export { cubicBezierUtil };
const cubicBezierUtil = {
    getPointAt(t: number, p0: vec2, p1: vec2, p2: vec2, p3: vec2) {
        const u = 1 - t;
        const tt = t * t;
        const uu = u * u;
        const uuu = uu * u;
        const ttt = tt * t;
        const p = vec2.create();
        // console.log(p0);
        vec2.scale(p, p0, uuu);
        vec2.scaleAndAdd(p, p, p1, 3 * uu * t);
        vec2.scaleAndAdd(p, p, p2, 3 * u * tt);
        vec2.scaleAndAdd(p, p, p3, ttt);
        return p;
    },
    // Slow
    lengthByLineInterpolation(p0: vec2, p1: vec2, p2: vec2, p3: vec2, precision: number) {
        const dt = precision / vec2.distance(p0, p3);
        // console.log(dt);
        let length = 0;
        for (let t = dt; t < 1.0; t += dt) {
            const from = cubicBezierUtil.getPointAt(t - dt, p0, p1, p2, p3);
            const to = cubicBezierUtil.getPointAt(t, p0, p1, p2, p3);
            length += vec2.distance(from, to);
        }
        return length;
    },
    trim: (t0: number, t1: number, p0: vec2, p1: vec2, p2: vec2, p3: vec2, out: vec2[]) => {
        // B(t) = (1−t)3 P1 + 3(1−t)2t P2 + 3(1−t)t2 P3 + t3 P4
        // t = 0 = first Point P1
        // t = 1 = last Point P4
        const u0 = 1.0 - t0;
        const u1 = 1.0 - t1;
        // p0' = (u0*u0*u0*p0
        // + (t0*u0*u0 + u0*t0*u0 + u0*u0*t0)*p1
        // + (t0*t0*u0 + u0*t0*t0 + t0*u0*t0)*p2
        // + t0*t0*t0*p3)
        const p0prime = vec2.create();
        vec2.scale(p0prime, p0, u0 * u0 * u0);
        vec2.scaleAndAdd(p0prime, p0prime, p1, t0 * u0 * u0 + u0 * t0 * u0 + u0 * u0 * t0);
        vec2.scaleAndAdd(p0prime, p0prime, p2, t0 * t0 * u0 + u0 * t0 * t0 + t0 * u0 * t0);
        vec2.scaleAndAdd(p0prime, p0prime, p3, t0 * t0 * t0);
        // p1' = (u0*u0*u1*p0
        // + (t0*u0*u1 + u0*t0*u1 + u0*u0*t1)*p1
        // + (t0*t0*u1 + u0*t0*t1 + t0*u0*t1)*p2
        // + t0*t0*t1*p3)
        const p1prime = vec2.create();
        vec2.scale(p1prime, p0, u0 * u0 * u1);
        vec2.scaleAndAdd(p1prime, p1prime, p1, t0 * u0 * u1 + u0 * t0 * u1 + u0 * u0 * t1);
        vec2.scaleAndAdd(p1prime, p1prime, p2, t0 * t0 * u1 + u0 * t0 * t1 + t0 * u0 * t1);
        vec2.scaleAndAdd(p1prime, p1prime, p3, t0 * t0 * t1);
        // p2' (u0*u1*u1*p0
        // + (t0*u1*u1 + u0*t1*u1 + u0*u1*t1)*p1
        // + (t0*t1*u1 + u0*t1*t1 + t0*u1*t1)*p2
        // + t0*t1*t1*p3)
        const p2prime = vec2.create();
        vec2.scale(p2prime, p0, u0 * u1 * u1);
        vec2.scaleAndAdd(p2prime, p2prime, p1, t0 * u1 * u1 + u0 * t1 * u1 + u0 * u1 * t1);
        vec2.scaleAndAdd(p2prime, p2prime, p2, t0 * t1 * u1 + u0 * t1 * t1 + t0 * u1 * t1);
        vec2.scaleAndAdd(p2prime, p2prime, p3, t0 * t1 * t1);
        // p3' = (u1*u1*u1*p1
        // + (t1*u1*u1 + u1*t1*u1 + u1*u1*t1)*p2
        // + (t1*t1*u1 + u1*t1*t1 + t1*u1*t1)*p3
        // + t1*t1*t1*p4)
        const p3prime = vec2.create();
        vec2.scale(p3prime, p0, u1 * u1 * u1);
        vec2.scaleAndAdd(p3prime, p3prime, p1, t1 * u1 * u1 + u1 * t1 * u1 + u1 * u1 * t1);
        vec2.scaleAndAdd(p3prime, p3prime, p2, t1 * t1 * u1 + u1 * t1 * t1 + t1 * u1 * t1);
        vec2.scaleAndAdd(p3prime, p3prime, p3, t1 * t1 * t1);

        out[0] = p0prime;
        out[1] = p1prime;
        out[2] = p2prime;
        out[3] = p3prime;
    },

};
