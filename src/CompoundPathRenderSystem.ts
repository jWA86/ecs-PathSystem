import { ComponentFactory, System } from "ecs-framework";
import { vec2 } from "gl-matrix";
import { CompoundPathEntityFactory } from "./CompoundPathEntityFactory";
import { IPathStyle, PathComponent, pathType } from "./PathComponent";
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

        // iterate on the compound paths
        const firstPathIndex = this.compoundPathEntityPool.pathEntityFactory.pathPool.keys.get(param1.firstPathId);
        for (let i = firstPathIndex; i < firstPathIndex + param2.nbPath; ++i) {
            const path = this.compoundPathEntityPool.pathEntityFactory.pathPool.values[i];
            // polyline
            if (path.type === pathType.polyline) {
                // iterate on points
                const firstPtIndex = this.compoundPathEntityPool.pathEntityFactory.pointPool.keys.get(path.firstPtId);
                let pt: vec2 = this.compoundPathEntityPool.pathEntityFactory.pointPool.values[firstPtIndex].point;
                // move to the first point than start drawing
                this.context.beginPath();
                this.context.moveTo(pt[X], pt[Y]);
                for (let j = firstPtIndex + 1; j < firstPtIndex + path.nbPt; ++j) {
                    pt = this.compoundPathEntityPool.pathEntityFactory.pointPool.values[j].point;
                    this.context.lineTo(pt[X], pt[Y]);
                }
                this.context.lineWidth = path.style.lineWidth;
                this.context.lineCap = path.style.lineCap;
                this.context.strokeStyle = path.style.strokeStyle;
                this.context.lineJoin = path.style.lineJoin;
                this.context.stroke();
                this.context.setTransform(1, 0, 0, 1, 0, 0);
            } else if (path.type === pathType.cubicBezier) {

            }
        }
    }
}
