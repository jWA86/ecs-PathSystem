import { ComponentFactory, System } from "ecs-framework";
import { mat4 , vec2 } from "gl-matrix";
import { IPathStyle } from "./CompoundPathComponent";
import { CompoundPathEntityFactory } from "./CompoundPathEntityFactory";
import { CompoundPathRendererSystem } from "./CompoundPathRenderSystem";
import { PathComponent, pathType } from "./PathComponent";
import { PathEntityFactory } from "./PathEntityFactory";
import { PointComponent } from "./PointComponent";

export { DebugCompoundPathRendererSystem };

const DEBUG_FILLSTYLE = "rgb(51, 204, 255)";
const DEBUG_RADIUS = 2;
const DEBUG_LINEWITH = 0.5;
const DEBUG_STROKESTYLE = "rgb(0, 191, 255)";

const X = 0;
const Y = 1;

const scaleX = 0;
const scaleY = 5;
const skewX = 1;
const skewY = 4;
const translateX = 12;
const translateY = 13;

/** Render all controls point of paths from a CompoundPath component */
class DebugCompoundPathRendererSystem extends CompoundPathRendererSystem {
    constructor(context: CanvasRenderingContext2D, public style: { radius: number, fillStyle: string | CanvasGradient | CanvasPattern, lineWidth: number, strokeStyle: string | CanvasGradient | CanvasPattern } = { radius: DEBUG_RADIUS, fillStyle: DEBUG_FILLSTYLE, lineWidth: DEBUG_LINEWITH, strokeStyle: DEBUG_STROKESTYLE }) {
        super(context);
    }

    public execute(param1: { firstPathId: number }, param2: { nbPath: number }, param3: { style: IPathStyle }, param4: { transform: mat4 }) {
        // Iterate paths of the compoundPath Component
        const firstPathIndex = this.compoundPathEntityPool.pathEntityFactory.pathPool.keys.get(param1.firstPathId);
        const t = param4.transform;
        this.context.setTransform(t[scaleX], t[skewX], t[skewY], t[scaleY], t[translateX], t[translateY]);
        for (let i = firstPathIndex; i < firstPathIndex + param2.nbPath; ++i) {
            const path = this.compoundPathEntityPool.pathEntityFactory.pathPool.values[i];
            this.renderPoints(path);
        }
        this.context.setTransform(1, 0, 0, 1, 0, 0);
    }

    protected renderPoints(path: PathComponent): vec2 {
        this.context.fillStyle = this.style.fillStyle;
        this.context.lineWidth = this.style.lineWidth;
        this.context.strokeStyle = this.style.strokeStyle;

        const firstPtIndex = this.compoundPathEntityPool.pathEntityFactory.pointPool.keys.get(path.firstPtId);

        let pt: vec2;
        for (let j = firstPtIndex; j < firstPtIndex + path.nbPt; ++j) {
            pt = this.compoundPathEntityPool.pathEntityFactory.pointPool.values[j].point;
            this.context.beginPath();
            this.context.arc(pt[X], pt[Y], this.style.radius, 0, 2 * Math.PI, false);
            this.context.fill();
            this.context.stroke();
        }
        return pt;
    }
}
