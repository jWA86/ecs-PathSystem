/// <reference types="gl-matrix" />
import { System } from "ecs-framework";
import { mat4 } from "gl-matrix";
import { IPathStyle } from "./CompoundPathComponent";
import { CompoundPathEntityFactory } from "./CompoundPathEntityFactory";
import { PathComponent } from "./PathComponent";
export { CompoundPathRendererSystem, ICompoundPathRendererParams };
interface ICompoundPathRendererParams {
    firstPathId: number;
    length: number;
    nbPath: number;
    style: IPathStyle;
    transform: mat4;
    trimFrom: number;
    trimTo: number;
}
declare class CompoundPathRendererSystem extends System<ICompoundPathRendererParams> {
    context: CanvasRenderingContext2D;
    compoundPathEntityPool: CompoundPathEntityFactory;
    protected _defaultParameter: ICompoundPathRendererParams;
    constructor(context: CanvasRenderingContext2D);
    execute(params: ICompoundPathRendererParams): void;
    normalFrom(accumulatedLength: number, pathLength: number, from: number): number;
    protected trace(path: PathComponent, trimFrom: number, trimTo: number): void;
    /**
     * lineTo points of pathComponent
     */
    protected tracePolyLine(path: PathComponent, trimFrom?: number, trimTo?: number): void;
    protected traceCubicBezier(path: PathComponent, trimFrom?: number, trimTo?: number): void;
}
