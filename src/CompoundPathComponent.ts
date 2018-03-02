import { IComponent } from "ecs-framework";
export { CompoundPathComponent, IPathStyle };

interface IPathStyle {
    lineWidth: number;
    strokeStyle: CanvasRenderingContext2D["strokeStyle"];
    lineCap: CanvasRenderingContext2D["lineCap"];
    lineJoin: CanvasRenderingContext2D["lineJoin"];
}

class CompoundPathComponent implements IComponent {
    constructor(public entityId: number, public active: boolean, public visible: boolean, public firstPathId: number, public nbPath: number, public style: IPathStyle) {}
}
// to add : lenght
