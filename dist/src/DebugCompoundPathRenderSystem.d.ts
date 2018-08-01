/// <reference types="gl-matrix" />
import { vec2 } from "gl-matrix";
import { CompoundPathRendererSystem, ICompoundPathRendererParams } from "./CompoundPathRenderSystem";
import { PathComponent } from "./PathComponent";
export { DebugCompoundPathRendererSystem };
/** Render all controls point of paths from a CompoundPath component */
declare class DebugCompoundPathRendererSystem extends CompoundPathRendererSystem {
    style: {
        radius: number;
        fillStyle: string | CanvasGradient | CanvasPattern;
        lineWidth: number;
        strokeStyle: string | CanvasGradient | CanvasPattern;
    };
    constructor(context: CanvasRenderingContext2D, style?: {
        radius: number;
        fillStyle: string | CanvasGradient | CanvasPattern;
        lineWidth: number;
        strokeStyle: string | CanvasGradient | CanvasPattern;
    });
    execute(params: ICompoundPathRendererParams): void;
    protected renderPoints(path: PathComponent): vec2;
}
