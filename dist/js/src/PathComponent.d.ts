/// <reference types="gl-matrix" />
import { interfaces } from "ecs-framework";
import { vec2 } from "gl-matrix";
export { computeLength, getPointAt, PathComponent, pathType };
declare enum pathType {
    polyline = 0,
    cubicBezier = 1,
}
declare class PathComponent implements interfaces.IComponent {
    entityId: number;
    active: boolean;
    type: pathType;
    firstPtId: number;
    nbPt: number;
    length: number;
    constructor(entityId: number, active: boolean, type: pathType, firstPtId: number, nbPt: number, length: number);
}
declare const computeLength: (points: vec2[], type: pathType, precision?: number) => number;
declare const getPointAt: (t: number, points: vec2[], type: pathType, length: number) => vec2;
