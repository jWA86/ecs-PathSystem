/// <reference types="gl-matrix" />
import { ComponentFactory } from "ecs-framework";
import { vec2 } from "gl-matrix";
import { PathComponent, pathType } from "./PathComponent";
import { PointComponent } from "./PointComponent";
export { PathEntityFactory };
declare class PathEntityFactory {
    pointPool: ComponentFactory<PointComponent>;
    pathPool: ComponentFactory<PathComponent>;
    /**
     * @param pointPoolSize size of the point component pool to be created if no pool are provided
     * @param pathPoolSize size of the path component pool to be created if no pool are provided
     * @param pointPool point component pool to be used by the PathEntityFactory for creating points of a path
     * @param pathPool path component pool to be used by the PathEntityFactory for creating path component
     */
    constructor(pointPoolSize: number, pathPoolSize: number, pointPool?: ComponentFactory<PointComponent>, pathPool?: ComponentFactory<PathComponent>);
    createPathComponent(entityId: number, firstPointId: number, nbPoints: number, type: pathType, active?: boolean): PathComponent;
    create(entityId: number, points: vec2[], type: pathType): PathComponent;
    /**
     * Compute the length and set the length proprety of the component
     * @param path the path component to set the length to
     */
    setLength(path: PathComponent): void;
    /**
     * Return a Path component from the pathComponent pool
     * @param entityId Path entity id
     */
    getPathComponent(entityId: number): PathComponent;
    getLastPathId(): number;
    getFirstPointIndex(path: PathComponent): number;
    /**
     * Return the index in point values of the last point of a path
     * @param pathId
     */
    getLastPointIndex(path: PathComponent): number;
    getPointAt: (t: number, path: PathComponent) => vec2;
    trimPath: (path: PathComponent, trimFrom: number, trimTo: number, out: vec2[]) => void;
    trimPolyline: (path: PathComponent, trimFrom: number, trimTo: number, out: vec2[]) => void;
    protected normTRelativeToSegment(segmentLenght: number, pathLength: number, normAbsPosition: number, normAbsEndSegment: number): number;
}
