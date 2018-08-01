/// <reference types="gl-matrix" />
import { System } from "ecs-framework";
import { mat4 } from "gl-matrix";
import { IPathStyle, IRange } from "./CompoundPathComponent";
import { CompoundPathEntityFactory } from "./CompoundPathEntityFactory";
import { PathComponent } from "./PathComponent";
export { CompoundPathRendererSystem, ICompoundPathRendererParams };
interface ICompoundPathRendererParams {
    f: {
        firstPathId: number;
    };
    l: {
        length: number;
    };
    n: {
        nbPath: number;
    };
    s: {
        style: IPathStyle;
    };
    tra: {
        transform: mat4;
    };
    tri: {
        trim: IRange;
    };
}
declare class CompoundPathRendererSystem extends System<ICompoundPathRendererParams> {
    context: CanvasRenderingContext2D;
    compoundPathEntityPool: CompoundPathEntityFactory;
    protected _parameters: ICompoundPathRendererParams;
    constructor(context: CanvasRenderingContext2D);
    execute(params: ICompoundPathRendererParams): void;
    normalFrom(accumulatedLength: number, pathLength: number, from: number): number;
    protected trace(path: PathComponent, trim: IRange): void;
    /**
     * lineTo points of pathComponent
     */
    protected tracePolyLine(path: PathComponent, trim?: {
        from: number;
        to: number;
    }): void;
    protected traceCubicBezier(path: PathComponent, trim?: {
        from: number;
        to: number;
    }): void;
}
