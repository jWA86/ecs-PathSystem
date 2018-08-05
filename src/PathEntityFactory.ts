import { ComponentFactory } from "ecs-framework";
import { vec2 } from "gl-matrix";
import { cubicBezierUtil } from "./BezierUtil";
import { computeLength, getPointAt, PathComponent, pathType } from "./PathComponent";
import { PointComponent } from "./PointComponent";

export { PathEntityFactory };
// Handle CRUD operations on PathComponentPool and PointComponentPool
class PathEntityFactory {
    public pointPool: ComponentFactory<PointComponent>;
    public pathPool: ComponentFactory<PathComponent>;
    /**
     * @param pointPoolSize size of the point component pool to be created if no pool are provided
     * @param pathPoolSize size of the path component pool to be created if no pool are provided
     * @param pointPool point component pool to be used by the PathEntityFactory for creating points of a path
     * @param pathPool path component pool to be used by the PathEntityFactory for creating path component
     */
    constructor(pointPoolSize: number, pathPoolSize: number, pointPool?: ComponentFactory<PointComponent>, pathPool?: ComponentFactory<PathComponent>) {
        this.pathPool = pathPool || new ComponentFactory<PathComponent>(pathPoolSize, new PathComponent(0, true, pathType.polyline, 0, 0, 0));
        this.pointPool = pointPool || new ComponentFactory<PointComponent>(pointPoolSize, new PointComponent(0, true, vec2.fromValues(0.0, 0.0)));
    }
    public createPathComponent(entityId: number, firstPointId: number, nbPoints: number, type: pathType, active = true): PathComponent {
        const c = this.pathPool.create(entityId, active);
        c.firstPtId = firstPointId;
        c.nbPt = nbPoints;
        c.type = type;
        this.setLength(c);
        return c;
    }
    public create(entityId: number, points: vec2[], type: pathType ): PathComponent {
        if (points.length < 1) {throw Error("a path mush have at least 1 points"); }

        const firstPointId = this.pointPool.nbCreated + 1;
        const l = points.length;
        for (let i = 0; i < l; ++i) {
            const p = this.pointPool.create(this.pointPool.nbCreated + 1, true);
            vec2.copy(p.point, points[i]);
        }
        const c = this.pathPool.create(entityId, true);
        c.type = type;
        c.firstPtId = firstPointId;
        c.nbPt = l;
        c.length = computeLength(points, type);
        return c;
    }
    /**
     * Compute the length and set the length proprety of the component
     * @param path the path component to set the length to
     */
    public setLength(path: PathComponent) {
        const points: vec2[] = [];
        const from = this.pointPool.keys.get(path.firstPtId);
        if (from === undefined) {
            throw Error("first point id not found in the point pool");
        }
        for (let i = from; i < from + path.nbPt; ++i) {
            points.push(this.pointPool.values[i].point);
        }
        path.length = computeLength(points, path.type);
    }
    /**
     * Return a Path component from the pathComponent pool
     * @param entityId Path entity id
     */
    public getPathComponent(entityId: number): PathComponent {
        return this.pathPool.get(entityId);
    }

    // should be a method of pool
    public getLastPathId(): number {
        if (this.pathPool.activeLength === 0) { return 0; }
        return this.pathPool.values[this.pathPool.activeLength - 1].entityId;
    }

    public getFirstPointIndex(path: PathComponent): number {
        // throw error if undefined ?
        return this.pointPool.keys.get(path.firstPtId);
    }

    /**
     * Return the index in point values of the last point of a path
     * @param pathId
     */
    public getLastPointIndex(path: PathComponent): number {

        let index = this.pointPool.keys.get(path.firstPtId);
        return index += path.nbPt;
    }

    public getPointAt = (t: number, path: PathComponent) => {
        const points: vec2[] = [];
        // case fromIndex is undefined ?
        const fromIndex = this.getFirstPointIndex(path);
        for (let i = fromIndex; i < fromIndex + path.nbPt; ++i ) {
            points.push(this.pointPool.values[i].point);
        }
        return getPointAt(t, points, path.type, path.length);
    }

    public trimPath = (path: PathComponent, trimFrom: number = 0, trimTo: number = 0, out: vec2[] ) => {
        const firstPtIndex = this.getFirstPointIndex(path);

        const pool = this.pointPool.values;
        switch (path.type) {
            case pathType.cubicBezier:
                cubicBezierUtil.trim(trimFrom, trimTo, pool[firstPtIndex].point, pool[firstPtIndex + 1].point, pool[firstPtIndex + 2].point, pool[firstPtIndex + 3].point, out);
                break;
            case pathType.polyline:
                this.trimPolyline(path, trimFrom, trimTo, out);
                break;
            default:
                break;
        }
    }

    public trimPolyline = (path: PathComponent, trimFrom: number = 0, trimTo: number = 0, out: vec2[]) => {
        const firstPtIndex = this.getFirstPointIndex(path);
        const pool = this.pointPool.values;
        let accumulatedDist = 0;
        const l = firstPtIndex  + path.nbPt;
        for (let i = firstPtIndex + 1 ; i < l; ++i ) {
            const dist = vec2.dist(pool[i - 1 ].point, pool[i].point);
            accumulatedDist += dist;
            const normCurrentPos = (accumulatedDist / path.length);
            // first point lerp
            if (out.length === 0 && (trimFrom <= normCurrentPos)) {
                const pt0 = vec2.create();
                const segNormT = this.normTRelativeToSegment(dist, path.length, trimFrom, normCurrentPos);
                vec2.lerp(pt0, pool[i - 1 ].point, pool[i].point, segNormT);
                out.push(pt0);
            }
            if (trimTo <= normCurrentPos) {
                // last point lerp
                const pt = vec2.create();
                const segNormT = this.normTRelativeToSegment(dist, path.length, trimTo, normCurrentPos);
                vec2.lerp(pt, pool[i - 1 ].point, pool[i].point, segNormT);
                out.push(pt);
                return;
            }
            if (out.length > 0 && trimTo > normCurrentPos) {
                // intermediate point
                out.push(pool[i].point);
            }
        }
    }

    protected normTRelativeToSegment(segmentLenght: number, pathLength: number, normAbsPosition: number, normAbsEndSegment: number) {
        const normSegLength = segmentLenght / pathLength;
        return ( normSegLength - (normAbsEndSegment - normAbsPosition)) / normSegLength;
    }

}
