import { IComponent } from "ecs-framework";
import { mat4, vec2 } from "gl-matrix";
export { PathComponent, pathType };

enum pathType {
    polyline,
    cubicBezier,
}

class PathComponent implements IComponent {
    constructor(public entityId: number, public active: boolean, public type: pathType, public firstPtId: number, public nbPt: number) {

    }
}
