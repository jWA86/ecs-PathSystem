import { ComponentFactory } from "ecs-framework";
import { computeLength, PathComponent, pathType } from "./PathComponent";
import { PointComponent } from "./PointComponent";
export { PathEntityFactory };
import { vec2 } from "gl-matrix";

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
        this.pathPool = pathPool || new ComponentFactory<PathComponent>(pathPoolSize, PathComponent, pathType.polyline, 0, 0, 0);
        this.pointPool = pointPool || new ComponentFactory<PointComponent>(pointPoolSize, PointComponent, vec2.fromValues(0.0, 0.0));
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
        if (points.length < 1) {throw Error("a path mush have at least 1 point"); }
        // If(this.pathPool.has(entityId)){throw new Error("a path entity with this Id already exist");}
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

    // should a method of pool
    public getLastPathId(): number {
        if (this.pathPool.iterationLength === 0) { return 0; }
        return this.pathPool.values[this.pathPool.iterationLength - 1].entityId;
    }

    /**
     * Return the index in point values of the last point of a path
     * @param pathId
     */
    public getLastPointIndex(path: PathComponent): number {

        let index = this.pointPool.keys.get(path.firstPtId);
        return index += path.nbPt;
    }

}
