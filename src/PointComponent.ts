import { IComponent } from "ecs-framework";
import { mat4, vec2 } from "gl-matrix";

export {PointComponent}
class PointComponent implements IComponent {
    constructor(public entityId: number, public active: boolean, public point: vec2){}
}