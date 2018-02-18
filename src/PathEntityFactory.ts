import { ComponentFactory } from "ecs-framework";
import { PathComponent, IPathStyle, pathType } from "./PathComponent";
import { PointComponent } from "./PointComponent";
import { vec2 } from "gl-matrix";
export { PathEntityFactory }

// Handle CRUD operations on PathComponentPool and PointComponentPool
class PathEntityFactory {
    public pointPool: ComponentFactory<PointComponent>;
    public pathPool: ComponentFactory<PathComponent>;
    public defaultStyle: IPathStyle = { lineWidth: 1, strokeStyle: "black", lineCap: "butt", lineJoin: "miter" };
    /**
     * 
     * @param pointPoolSize size of the point component pool to be created if no pool are provided
     * @param pathPoolSize size of the path component pool to be created if no pool are provided
     * @param pointPool point component pool to be used by the PathEntityFactory for creating points of a path
     * @param pathPool path component pool to be used by the PathEntityFactory for creating path component
     */
    constructor(pointPoolSize: number, pathPoolSize: number, pointPool?: ComponentFactory<PointComponent>, pathPool?: ComponentFactory<PathComponent>) {
        this.pathPool = pathPool || new ComponentFactory<PathComponent>(pathPoolSize, PathComponent, pathType.polyline, 0, 0, this.defaultStyle);
        this.pointPool = pointPool || new ComponentFactory<PointComponent>(pointPoolSize, PointComponent, vec2.fromValues(0.0, 0.0));
    }
    public create(entityId: number, points:vec2[], type: pathType, style: IPathStyle = this.defaultStyle) : PathComponent {
        if(points.length<1){throw new Error("a path mush have at least 1 point");}
        if(this.pathPool.has(entityId)){throw new Error("a path entity with this Id already exist");}
        const firstPointId = this.pathPool.nbCreated + 1;
        let l = points.length;
        for(let i = 0; i < l; ++i) {
            let p = this.pointPool.create(this.pointPool.nbCreated + 1, true);
            vec2.copy(p.point, points[i]);
        }
        let c = this.pathPool.create(entityId, true);
        c.type = type;
        c.firstPtId = firstPointId;
        c.nbPt = l;
        // copy prop of style to the component
        Object.keys(style).forEach((k) => {
            c.style[k] = style[k];
        });
        return c;
    }
}