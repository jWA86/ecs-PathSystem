import { ComponentFactory, System } from "ecs-framework";
import { mat4 , vec2 } from "gl-matrix";
import * as CONF from "../src/config";
import { IPathStyle } from "./CompoundPathComponent";
import { CompoundPathEntityFactory } from "./CompoundPathEntityFactory";
import { CompoundPathRendererSystem } from "./CompoundPathRenderSystem";
import { PathComponent, pathType } from "./PathComponent";
import { PathEntityFactory } from "./PathEntityFactory";
import { PointComponent } from "./PointComponent";

export { DebugCompoundPathRendererSystem };

/** Render all controls point of paths from a CompoundPath component */
class DebugCompoundPathRendererSystem extends CompoundPathRendererSystem {
    constructor(context: CanvasRenderingContext2D, public style: { radius: number, fillStyle: string | CanvasGradient | CanvasPattern, lineWidth: number, strokeStyle: string | CanvasGradient | CanvasPattern } = { radius: CONF.DEBUG.RADIUS, fillStyle: CONF.DEBUG.FILLSTYLE, lineWidth: CONF.DEBUG.LINEWITH, strokeStyle: CONF.DEBUG.STROKESTYLE }) {
        super(context);
    }

    public execute(param1: { firstPathId: number }, param2: { nbPath: number }, param3: { style: IPathStyle }, param4: { transform: mat4 }) {
        // Iterate paths of the compoundPath Component
        const firstPathIndex = this.compoundPathEntityPool.pathEntityFactory.pathPool.keys.get(param1.firstPathId);

        // a	m11 : glM : m00 [0]
        // b	m12 : glM : m01 [1]
        // c	m21 : glM : m10 [4]
        // d	m22 : glM : m11 [5]
        // e	m41 : glM : m30 [12]
        // f	m42 : glM : m31 [13]
        const t = param4.transform;
        this.context.setTransform(t[CONF.SCALE_X], t[CONF.SKEW_X], t[CONF.SKEW_Y], t[CONF.SCALE_Y], t[CONF.TRANSLATE_X], t[CONF.TRANSLATE_Y]);

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
            this.context.arc(pt[CONF.X], pt[CONF.Y], this.style.radius, 0, 2 * Math.PI, false);
            this.context.fill();
            this.context.stroke();
        }
        return pt;
    }
}
