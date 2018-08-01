/// <reference types="gl-matrix" />
import { interfaces } from "ecs-framework";
import { mat4 } from "gl-matrix";
export { CompoundPathComponent, IPathStyle, IRange };
interface IRange {
    from: number;
    to: number;
}
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
    trim: IRange;
    length: number;
    constructor(entityId: number, active: boolean, visible: boolean, firstPathId: number, nbPath: number, style: IPathStyle, transform: mat4, trim: IRange, length: number);
}
