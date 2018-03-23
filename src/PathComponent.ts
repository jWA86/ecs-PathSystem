import { IComponent } from "ecs-framework";
import { mat4, vec2 } from "gl-matrix";
import { cubicBezierUtil } from "./BezierUtil";
import { L_PRECISION } from "./config";
export { computeLength, getPointAt, PathComponent, pathType };

enum pathType {
    polyline,
    cubicBezier,
}

class PathComponent implements IComponent {
    constructor(public entityId: number, public active: boolean, public type: pathType, public firstPtId: number, public nbPt: number, public length: number) {

    }
}

const computeLength = (points: vec2[], type: pathType, precision = L_PRECISION) => {
    if (type === pathType.polyline) {
        return polyLineLength(points);
    } else if (type === pathType.cubicBezier) {
        return cubicBezierLength(points, precision);
    }
};

const polyLineLength = (points: vec2[]) => {
    if ( points.length < 2) { return 0; }
    let length = 0;
    for (let i = 1; i < points.length; ++i) {
        length += vec2.distance(points[i - 1], points[i]);
    }
    return length;
};

const cubicBezierLength = (points: vec2[], precision: number) => {
    if (points.length < 4) { return 0; }
    return cubicBezierUtil.lengthByLineInterpolation(points[0], points[1], points[2], points[3], precision);
};

const getPointAt = (t: number, points: vec2[], type: pathType, length: number) => {
    if (type === pathType.cubicBezier) {
        return cubicBezierUtil.getPointAt(t, points[0], points[1], points[2], points[3]);
    } else if (type === pathType.polyline) {
        return polyLineInterpolation(t, points, length);
    }
};

const polyLineInterpolation = (t: number, points: vec2[], pathLength: number) => {
    let accumulatedDist = 0;
    for (let i = 0; i < points.length - 1; ++i) {
        const dist = vec2.distance(points[i], points[i + 1]);
        accumulatedDist += dist;
        if (t <= (accumulatedDist / pathLength) ) {
            const res = vec2.create();
            return vec2.lerp(res, points[i], points[ i + 1], t);
            // return lineInterpolation(t, points[i], points[i + 1]);
        }
    }
};

// const lineInterpolation = (t: number, point0: vec2, point1: vec2): vec2  => {
//     const x = t * (point1[0] - point0[0]) + point0[0];
//     const y = t * (point1[1] - point0[1]) + point0[1];
//     return vec2.fromValues(x, y);
// };
