import { IComponent } from "ecs-framework";
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

class CompoundPathComponent implements IComponent {
    constructor(public entityId: number, public active: boolean, public visible: boolean, public firstPathId: number, public nbPath: number, public style: IPathStyle, public transform: mat4, public trim: IRange, public length: number) {}
}
