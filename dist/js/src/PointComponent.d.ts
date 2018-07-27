/// <reference types="gl-matrix" />
import { interfaces } from "ecs-framework";
import { vec2 } from "gl-matrix";
export { PointComponent };
declare class PointComponent implements interfaces.IComponent {
    entityId: number;
    active: boolean;
    point: vec2;
    constructor(entityId: number, active: boolean, point: vec2);
}
