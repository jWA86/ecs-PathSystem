import { ComponentFactory, System } from "ecs-framework";
import { mat4, vec2 } from "gl-matrix";
import * as CONF from "../src/config";
import { cubicBezierUtil } from "./BezierUtil";
import { IPathStyle, IRange } from "./CompoundPathComponent";
import { CompoundPathEntityFactory } from "./CompoundPathEntityFactory";
import { PathComponent, pathType } from "./PathComponent";
import { PathEntityFactory } from "./PathEntityFactory";
import { PointComponent } from "./PointComponent";
export { CompoundPathRendererSystem };

const nbAfterComa = 10000;
class CompoundPathRendererSystem extends System {
    public compoundPathEntityPool: CompoundPathEntityFactory;
    constructor(public context: CanvasRenderingContext2D) { super(); }
    // iterate on a compoundPAth component
    // then iterate on all their paths
    // finally iterate on points for rendering
    public execute(param1: { firstPathId: number }, param2: { nbPath: number }, param3: { style: IPathStyle }, param4: { transform: mat4 }, param5: { trim: IRange }, param6: { length: number }) {

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

        // const previousTrace = { point: undefined, type: pathType.polyline };
        let accumulatedLength = 0;
        let firstPathTraced = false;
        // const from = Math.floor(param6.length * param5.trim.from * nbAfterComa) / nbAfterComa;
        const from = param6.length * param5.trim.from;
        // const to = Math.floor(param6.length * param5.trim.to * nbAfterComa) / nbAfterComa;
        const to = param6.length * param5.trim.to;
        for (let i = firstPathIndex; i < firstPathIndex + param2.nbPath; ++i) {
            const path = this.compoundPathEntityPool.pathEntityFactory.pathPool.values[i];

            accumulatedLength += path.length;

            if (accumulatedLength < from) {
                // When trim begin at a next path
                continue;
            } else if (accumulatedLength >= from && accumulatedLength <= to) {
                // When trim begin on this path but end on a next path. or end on this path because it's the last one
                const normFrom = this.normalFrom(accumulatedLength, path.length, from);
                const normTo = 1;
                this.trace(path, { from: normFrom, to: normTo });
                firstPathTraced = true;
            } else if (accumulatedLength >= to && !firstPathTraced) {
                // When trim begin and end on the same path

                // from from the begining of this path in normalized form
                const normFrom = (from === 0) ? 0 : (from - path.length) / path.length;
                const normTo = (path.length - to) / path.length;
                this.trace(path, { from: normFrom, to: normTo });
                firstPathTraced = true;
                break;
            } else if (accumulatedLength >= to && firstPathTraced) {
                // When trim begin on a previous path and end on this one

                const normFrom = 0;
                const normTo = 1 - (accumulatedLength - to) / path.length;
                this.trace(path, { from: normFrom, to: normTo });
                break;
            }
        }

        this.context.lineWidth = param3.style.lineWidth;
        this.context.lineCap = param3.style.lineCap;
        this.context.strokeStyle = param3.style.strokeStyle;
        this.context.lineJoin = param3.style.lineJoin;
        this.context.stroke();

        this.context.setTransform(1, 0, 0, 1, 0, 0);
    }

    // To move to compoundEntityFactory (or pathEntityFactory ??)
    public normalFrom(accumulatedLength: number, pathLength: number, from: number) {
        if (from === 0) { return 0; }
        const l = (pathLength - (accumulatedLength - from)) / pathLength;
        return (l < 0) ? 0 : l;
    }
    protected trace(path: PathComponent, trim: IRange) {
        switch (path.type) {
            case pathType.polyline:
                this.tracePolyLine(path, trim);
                break;
            case pathType.cubicBezier:
                this.traceCubicBezier(path, trim);
                break;
            default:
                break;
        }
    }
    /**
     * lineTo points of pathComponent
     */
    protected tracePolyLine(path: PathComponent, trim = { from: 0, to: 1 }) {

        if (trim.from === 0 && trim.to === 1) {
            const firstPtIndex = this.compoundPathEntityPool.pathEntityFactory.getFirstPointIndex(path);
            const pool = this.compoundPathEntityPool.pathEntityFactory.pointPool.values;

            let pt = pool[firstPtIndex].point;
            this.context.moveTo(pt[CONF.X], pt[CONF.Y]);
            for (let j = firstPtIndex + 1; j < firstPtIndex + path.nbPt; ++j) {
                pt = pool[j].point;
                this.context.lineTo(pt[CONF.X], pt[CONF.Y]);
            }
        } else {
            const out: vec2[] = [];
            this.compoundPathEntityPool.pathEntityFactory.trimPath(path, trim, out);
            this.context.moveTo(out[0][CONF.X], out[0][CONF.Y]);
            for (let j = 1; j < out.length; ++j) {
                this.context.lineTo(out[j][CONF.X], out[j][CONF.Y]);
            }
        }
    }

    protected traceCubicBezier(path: PathComponent, trim = { from: 0, to: 1 }) {
        // trim
        if (trim.from !== 0 || trim.to !== 1) {
            const out: vec2[] = [];
            this.compoundPathEntityPool.pathEntityFactory.trimPath(path, trim, out);
            // cubicBezierUtil.trim(trim.from, trim.to, pt0, pt1, pt2, pt3, out);
            this.context.moveTo(out[0][CONF.X], out[0][CONF.Y]);
            this.context.bezierCurveTo(out[1][CONF.X], out[1][CONF.Y], out[2][CONF.X], out[2][CONF.Y], out[3][CONF.X], out[3][CONF.Y]);
        } else {
            // no trim
            // get points from factory,
            // move to first point
            // trace the bezier curve
            const firstPtIndex = this.compoundPathEntityPool.pathEntityFactory.getFirstPointIndex(path);
            const pool = this.compoundPathEntityPool.pathEntityFactory.pointPool.values;
            const pt0 = pool[firstPtIndex].point;
            const pt1 = pool[firstPtIndex + 1].point;
            const pt2 = pool[firstPtIndex + 2].point;
            const pt3 = pool[firstPtIndex + 3].point;

            this.context.moveTo(pt0[CONF.X], pt0[CONF.Y]);

            this.context.bezierCurveTo(pt1[CONF.X], pt1[CONF.Y], pt2[CONF.X], pt2[CONF.Y], pt3[CONF.X], pt3[CONF.Y]);
        }
    }
}
