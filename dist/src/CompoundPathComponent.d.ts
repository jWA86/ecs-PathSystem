/// <reference types="gl-matrix" />
import { interfaces } from "ecs-framework";
import { mat4 } from "gl-matrix";
export { CompoundPathComponent, IPathStyle };
interface IPathStyle {
    lineWidth: number;
    strokeStyle: CanvasRenderingContext2D["strokeStyle"];
    lineCap: CanvasRenderingContext2D["lineCap"];
    lineJoin: CanvasRenderingContext2D["lineJoin"];
}
declare class CompoundPathComponent implements interfaces.IComponent {
    entityId: number;
    active: boolean;
    visible: boolean;
    firstPathId: number;
    nbPath: number;
    style: IPathStyle;
    transform: mat4;
    trimFrom: number;
    trimTo: number;
    length: number;
    constructor(entityId: number, active: boolean, visible: boolean, firstPathId: number, nbPath: number, style: IPathStyle, transform: mat4, trimFrom: number, trimTo: number, length: number);
}
