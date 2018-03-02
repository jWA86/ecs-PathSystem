import { ComponentFactory, System } from "ecs-framework";
import { vec2 } from "gl-matrix";
import { IPathStyle } from "./CompoundPathComponent";
import { CompoundPathEntityFactory } from "./CompoundPathEntityFactory";
import { PathComponent, pathType } from "./PathComponent";
import { PathEntityFactory } from "./PathEntityFactory";
import { PointComponent } from "./PointComponent";
export { CompoundPathRendererSystem };
const X = 0;
const Y = 1;
class CompoundPathRendererSystem extends System {
    public compoundPathEntityPool: CompoundPathEntityFactory;
    constructor(public context: CanvasRenderingContext2D) { super(); }
   // iterate on a compoundPAth component
   // then iterate on all their paths
   // finally iterate on points for drawing
    public execute(param1: { firstPathId: number }, param2: { nbPath: number }, param3: { style: IPathStyle }) {

        this.context.beginPath();
        // iterate paths of the compoundPath Component
        const firstPathIndex = this.compoundPathEntityPool.pathEntityFactory.pathPool.keys.get(param1.firstPathId);
        let lastPt: vec2;
        for (let i = firstPathIndex; i < firstPathIndex + param2.nbPath; ++i) {
            const path = this.compoundPathEntityPool.pathEntityFactory.pathPool.values[i];
            // polyline
            if (path.type === pathType.polyline) {
                lastPt = this.tracePolyLine(path, lastPt);
            } else if (path.type === pathType.cubicBezier) {

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
    protected tracePolyLine(path: PathComponent, from?: vec2 ): vec2 {
        const firstPtIndex = this.compoundPathEntityPool.pathEntityFactory.pointPool.keys.get(path.firstPtId);
        let pt = this.compoundPathEntityPool.pathEntityFactory.pointPool.values[firstPtIndex].point;
        from = from || pt;
        this.context.moveTo(from[X], from[Y]);
        for (let j = firstPtIndex; j < firstPtIndex + path.nbPt; ++j) {
            pt = this.compoundPathEntityPool.pathEntityFactory.pointPool.values[j].point;
            this.context.lineTo(pt[X], pt[Y]);
        }
        return pt;
    }
}
