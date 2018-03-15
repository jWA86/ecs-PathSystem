import { IComponent } from "ecs-framework";
import { mat4, vec2 } from "gl-matrix";
import { cubicBezierUtil } from "./BezierUtil";
import { L_PRECISION } from "./config";
export { computeLength, PathComponent, pathType };

enum pathType {
    polyline,
    cubicBezier,
}

class PathComponent implements IComponent {
    constructor(public entityId: number, public active: boolean, public type: pathType, public firstPtId: number, public nbPt: number, public length: number) {

    }
}

const computeLength = (points, type, precision = L_PRECISION) => {
    if (type === pathType.polyline) {
        return polyLineLength(points);
    } else if (type === pathType.cubicBezier) {
        return cubicBezierLength(points, precision);
    }
};

const polyLineLength = (points) => {
    if ( points.length < 2) { return 0; }
    let length = 0;
    for (let i = 1; i < points.length; ++i) {
        length += vec2.distance(points[i - 1], points[i]);
    }
    return length;
};

const cubicBezierLength = (points, precision) => {
    if (points.length < 4) { return 0; }
    return cubicBezierUtil.lengthByLineInterpolation(points[0], points[1], points[2], points[3], precision);
};
