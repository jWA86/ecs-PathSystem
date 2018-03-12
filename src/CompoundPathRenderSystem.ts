import { ComponentFactory, System } from "ecs-framework";
import { mat4, vec2 } from "gl-matrix";
import * as CONF from "../src/config";
import { IPathStyle } from "./CompoundPathComponent";
import { CompoundPathEntityFactory } from "./CompoundPathEntityFactory";
import { PathComponent, pathType } from "./PathComponent";
import { PathEntityFactory } from "./PathEntityFactory";
import { PointComponent } from "./PointComponent";
export { CompoundPathRendererSystem };

// const X = 0;
// const Y = 1;
// const scaleX = 0;
// const scaleY = 5;
// const skewX = 1;
// const skewY = 4;
// const translateX = 12;
// const translateY = 13;

class CompoundPathRendererSystem extends System {
    public compoundPathEntityPool: CompoundPathEntityFactory;
    constructor(public context: CanvasRenderingContext2D) { super(); }
    // iterate on a compoundPAth component
    // then iterate on all their paths
    // finally iterate on points for rendering
    public execute(param1: { firstPathId: number }, param2: { nbPath: number }, param3: { style: IPathStyle }, param4: { transform: mat4}) {

        this.context.beginPath();

        // a	m11 : glM : m00 [0]
        // b	m12 : glM : m01 [1]
        // c	m21 : glM : m10 [4]
        // d	m22 : glM : m11 [5]
        // e	m41 : glM : m30 [12]
        // f	m42 : glM : m31 [13]
        const t = param4.transform;
        this.context.setTransform(t[CONF.SCALE_X], t[CONF.SKEW_X], t[CONF.SKEW_Y], t[CONF.SCALE_Y], t[CONF.TRANSLATE_X], t[CONF.TRANSLATE_Y]);

        // Iterate paths of the compoundPath Component
        const firstPathIndex = this.compoundPathEntityPool.pathEntityFactory.pathPool.keys.get(param1.firstPathId);
        let lastPt: vec2;
        let lastType: pathType;
        for (let i = firstPathIndex; i < firstPathIndex + param2.nbPath; ++i) {
            const path = this.compoundPathEntityPool.pathEntityFactory.pathPool.values[i];
            // polyline
            if (path.type === pathType.polyline) {
                lastPt = this.tracePolyLine(path, lastPt);
                lastType = pathType.polyline;
            } else if (path.type === pathType.cubicBezier) {
                lastPt = this.traceCubicBezier(path, lastType, lastPt);
                lastType = pathType.cubicBezier;
            }
        }
        this.context.lineWidth = param3.style.lineWidth;
        this.context.lineCap = param3.style.lineCap;
        this.context.strokeStyle = param3.style.strokeStyle;
        this.context.lineJoin = param3.style.lineJoin;
        this.context.stroke();

        this.context.setTransform(1, 0, 0, 1, 0, 0);
    }
    /**
     * lineTo points of pathComponent from a position.
     * @param path
     * @param from position to draw from, if it's not provided we draw from the first point of the path
     */
    protected tracePolyLine(path: PathComponent, from?: vec2): vec2 {
        const firstPtIndex = this.compoundPathEntityPool.pathEntityFactory.pointPool.keys.get(path.firstPtId);
        let pt = this.compoundPathEntityPool.pathEntityFactory.pointPool.values[firstPtIndex].point;
        from = from || pt;
        this.context.moveTo(from[CONF.X], from[CONF.Y]);
        for (let j = firstPtIndex; j < firstPtIndex + path.nbPt; ++j) {
            pt = this.compoundPathEntityPool.pathEntityFactory.pointPool.values[j].point;
            this.context.lineTo(pt[CONF.X], pt[CONF.Y]);
        }
        return pt;
    }

    protected traceCubicBezier(path: PathComponent, lastType: pathType, from?: vec2): vec2 {
        const firstPtIndex = this.compoundPathEntityPool.pathEntityFactory.pointPool.keys.get(path.firstPtId);
        const pt0 = this.compoundPathEntityPool.pathEntityFactory.pointPool.values[firstPtIndex].point;
        from = from || pt0;
        this.context.moveTo(from[CONF.X], from[CONF.Y]);

        const pool = this.compoundPathEntityPool.pathEntityFactory.pointPool.values;
        // if the previous path was a polyline lineTo the first point of the bezier curve
        if (lastType === pathType.polyline) {
            this.context.lineTo(pt0[CONF.X], pt0[CONF.Y]);
        }
        // skip the first point since we only need 3 points
        const pt1 = pool[firstPtIndex + 1].point;
        const pt2 = pool[firstPtIndex + 2].point;
        const pt3 = pool[firstPtIndex + 3].point;
        this.context.bezierCurveTo(pt1[CONF.X], pt1[CONF.Y], pt2[CONF.X], pt2[CONF.Y], pt3[CONF.X], pt3[CONF.Y]);
        return pt3;
    }
}
