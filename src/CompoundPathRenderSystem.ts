import { ComponentFactory, System } from "ecs-framework";
import { mat4, vec2 } from "gl-matrix";
import * as CONF from "../src/config";
import { cubicBezierUtil } from "./BezierUtil";
import { IPathStyle } from "./CompoundPathComponent";
import { CompoundPathEntityFactory } from "./CompoundPathEntityFactory";
import { PathComponent, pathType } from "./PathComponent";
export { CompoundPathRendererSystem, ICompoundPathRendererParams };

interface ICompoundPathRendererParams {
    firstPathId: number;
    length: number;
    nbPath: number;
    style: IPathStyle;
    transform: mat4;
    trimFrom: number;
    trimTo: number;
}

const defaultCompoundPathRendererParams: ICompoundPathRendererParams = {
    firstPathId: 0,
    length: 0,
    nbPath: 0,
    style: { lineWidth: 1, strokeStyle: "black", lineCap: "square", lineJoin: "miter" },
    transform: mat4.create(),
    trimFrom: 0,
    trimTo: 0,
};

const nbAfterComa = 10000;
class CompoundPathRendererSystem extends System<ICompoundPathRendererParams> {
    public compoundPathEntityPool: CompoundPathEntityFactory;
    protected _defaultParameter: ICompoundPathRendererParams = defaultCompoundPathRendererParams;
    constructor(public context: CanvasRenderingContext2D) { super(); }
    // iterate on a compoundPAth component
    // then iterate on all their paths
    // finally iterate on points for rendering
    public execute(params: ICompoundPathRendererParams) {

        this.context.beginPath();

        // a	m11 : glM : m00 [0]
        // b	m12 : glM : m01 [1]
        // c	m21 : glM : m10 [4]
        // d	m22 : glM : m11 [5]
        // e	m41 : glM : m30 [12]
        // f	m42 : glM : m31 [13]
        const t = params.transform[this._k.transform];
        this.context.setTransform(t[CONF.SCALE_X], t[CONF.SKEW_X], t[CONF.SKEW_Y], t[CONF.SCALE_Y], t[CONF.TRANSLATE_X], t[CONF.TRANSLATE_Y]);

        // Iterate paths of the compoundPath Component
        const firstPathIndex = this.compoundPathEntityPool.pathEntityFactory.pathPool.keys.get(params.firstPathId[this._k.firstPathId]);

        // const previousTrace = { point: undefined, type: pathType.polyline };
        let accumulatedLength = 0;
        let firstPathTraced = false;
        // const from = Math.floor(param6.length * param5.trim.from * nbAfterComa) / nbAfterComa;
        const from = params.length[this._k.length] * params.trimFrom[this._k.trimFrom];
        // const to = Math.floor(param6.length * param5.trim.to * nbAfterComa) / nbAfterComa;
        const to = params.length[this._k.length] * params.trimTo[this._k.trimTo];
        for (let i = firstPathIndex; i < firstPathIndex + params.nbPath[this._k.nbPath]; ++i) {
            const path = this.compoundPathEntityPool.pathEntityFactory.pathPool.values[i];

            accumulatedLength += path.length;

            if (accumulatedLength < from) {
                // When trim begin at a next path
                continue;
            } else if (accumulatedLength >= from && accumulatedLength <= to) {
                // When trim begin on this path but end on a next path. or end on this path because it's the last one
                const normFrom = this.normalFrom(accumulatedLength, path.length, from);
                const normTo = 1;
                this.trace(path, normFrom, normTo );
                firstPathTraced = true;
            } else if (accumulatedLength >= to && !firstPathTraced) {
                // When trim begin and end on the same path

                // from from the begining of this path in normalized form
                const normFrom = (from === 0) ? 0 : (from - path.length) / path.length;
                const normTo = (path.length - to) / path.length;
                this.trace(path, normFrom, normTo);
                firstPathTraced = true;
                break;
            } else if (accumulatedLength >= to && firstPathTraced) {
                // When trim begin on a previous path and end on this one

                const normFrom = 0;
                const normTo = 1 - (accumulatedLength - to) / path.length;
                this.trace(path, normFrom, normTo );
                break;
            }
        }

        this.context.lineWidth = params.style[this._k.style].lineWidth;
        this.context.lineCap = params.style[this._k.style].lineCap;
        this.context.strokeStyle = params.style[this._k.style].strokeStyle;
        this.context.lineJoin = params.style[this._k.style].lineJoin;
        this.context.stroke();

        this.context.setTransform(1, 0, 0, 1, 0, 0);
    }

    // To move to compoundEntityFactory (or pathEntityFactory ??)
    public normalFrom(accumulatedLength: number, pathLength: number, from: number) {
        if (from === 0) { return 0; }
        const l = (pathLength - (accumulatedLength - from)) / pathLength;
        return (l < 0) ? 0 : l;
    }
    protected trace(path: PathComponent, trimFrom: number, trimTo: number) {
        switch (path.type) {
            case pathType.polyline:
                this.tracePolyLine(path, trimFrom, trimTo);
                break;
            case pathType.cubicBezier:
                this.traceCubicBezier(path, trimFrom, trimTo);
                break;
            default:
                break;
        }
    }
    /**
     * lineTo points of pathComponent
     */
    protected tracePolyLine(path: PathComponent, trimFrom: number = 0, trimTo: number = 1 ) {

        if (trimFrom === 0 && trimTo === 1) {
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
            this.compoundPathEntityPool.pathEntityFactory.trimPath(path, trimFrom, trimTo, out);
            this.context.moveTo(out[0][CONF.X], out[0][CONF.Y]);
            for (let j = 1; j < out.length; ++j) {
                this.context.lineTo(out[j][CONF.X], out[j][CONF.Y]);
            }
        }
    }

    protected traceCubicBezier(path: PathComponent, trimFrom: number = 0, trimTo: number = 1 ) {
        // trim
        if (trimFrom !== 0 || trimTo !== 1) {
            const out: vec2[] = [];
            this.compoundPathEntityPool.pathEntityFactory.trimPath(path, trimFrom, trimTo, out);
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
