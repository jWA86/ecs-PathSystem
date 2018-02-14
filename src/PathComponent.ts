import { IComponent } from "ecs-framework";
import { mat4, vec2 } from "gl-matrix";
export {IPathStyle, PathComponent, pathType}

enum pathType {
    line,
    cubicBezier,
}

interface IPathStyle {
    lineWidth: number;
    strokeStyle: CanvasRenderingContext2D["strokeStyle"];
    lineCap: CanvasRenderingContext2D["lineCap"];
    lineJoin: CanvasRenderingContext2D["lineJoin"];
}

class PathComponent implements IComponent {
    constructor(public entityId: number, public active: boolean,
         public type: pathType,
          public firstPtId: number,
           public nbPt: number, 
            public style: IPathStyle){

    }
}