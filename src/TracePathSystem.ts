import { ComponentFactory, interfaces, System } from "ecs-framework";
import { vec2 } from "gl-matrix";
// import { distance } from "gl-matrix/src/gl-matrix/vec2";
import { BUFFER_NB_POINTS, MIN_DIST_BTW_PTS } from "../src/config";
import { IPathStyle } from "./CompoundPathComponent";
import { CompoundPathEntityFactory } from "./CompoundPathEntityFactory";
import { PathComponent, pathType } from "./PathComponent";
import { PathEntityFactory } from "./PathEntityFactory";
import { PointComponent } from "./PointComponent";
export { MouseComponent, TracePathSystem };

class MouseComponent implements interfaces.IComponent {
    constructor(public entityId: number, public active: boolean, public position: vec2, public pressed: boolean) { }
}

// record mouse input as a polyline path in a buffer pool
// when the mouse is release the polyline is copied to the destination buffer
// it then can be converted to  a bezier curve
class TracePathSystem extends System<{}> {
    public currentState: { currentPtId: number, action: string };
    public bufferFactory: PathEntityFactory;
    public bufferPath: PathComponent;
    public get resizeWhenFreeSlotLeft() {
        return this._resizeWhenFreeSlotLeft;
    }
    public set resizeWhenFreeSlotLeft(val: number) {
        this._resizeWhenFreeSlotLeft = val;
    }
    protected _resizeWhenFreeSlotLeft = 20;
    protected _parameters: {} = {};
    constructor(public input: MouseComponent, public destionationFactory: CompoundPathEntityFactory, public minDistanceBtwPts: number = MIN_DIST_BTW_PTS, bufferNbPoints: number = BUFFER_NB_POINTS) {
        super();
        this.bufferFactory = new PathEntityFactory(BUFFER_NB_POINTS, 2);
        this.currentState = { currentPtId: 0, action: "NAN" };
    }
    public resetBufferPath() {
        this.bufferPath = this.bufferFactory.create(1, [], pathType.polyline);
    }
    public process() {
        if (this.currentState.currentPtId > 0 && this.currentState.action === "DRAWING") {
            // continue adding point
            if (this.input.pressed) {
                // don't save same position point
                const prevPoint = this.bufferFactory.pointPool.get(this.currentState.currentPtId).point;
                if (vec2.distance(prevPoint, this.input.position) < this.minDistanceBtwPts) {
                    return;
                }
                resizePoolIfNotEnoughtSpace(this.bufferFactory.pointPool, this._resizeWhenFreeSlotLeft);
                this.currentState.currentPtId += 1;
                const newPt = this.bufferFactory.pointPool.create(this.currentState.currentPtId, true);
                vec2.copy(newPt.point, this.input.position);
                this.bufferPath.nbPt += 1;

            } else if (!this.input.pressed && this.currentState.action === "DRAWING") {
                // mouse released, end of recording

                // reset currentState
                this.currentState.action = "NAN";
                this.currentState.currentPtId = 0;

                // only keep path with nb point > 1
                if (this.bufferPath.nbPt > 1) {
                    // copy buffer point & sahpe to pointPool
                    this.moveBuffersToPool();
                }

                this.eraseBuffers();
            }

        } else if (this.currentState.action === "NAN" && this.input.pressed) {
            // create new path
            this.currentState.currentPtId += 1;
            this.currentState.action = "DRAWING";

            this.bufferPath = this.bufferFactory.create(this.currentState.currentPtId, [this.input.position], pathType.polyline);

            this.bufferPath.firstPtId = 1;
            this.bufferPath.nbPt = 1;
        }
    }
    public moveBuffersToPool() {
        const pointPool = this.destionationFactory.pathEntityFactory.pointPool;
        resizePoolIfNotEnoughtSpace(pointPool, this.bufferFactory.pointPool.nbCreated * 3);
        const id = this.destionationFactory.getLastPathId() + 1;
        resizePoolIfNotEnoughtSpace(this.destionationFactory.componentPool, 10);
        resizePoolIfNotEnoughtSpace(this.destionationFactory.pathEntityFactory.pathPool, 10);

        this.destionationFactory.createFromPaths(id, this.bufferFactory, [1]);
    }
    public eraseBuffers() {
        // free points
        const buffer = this.bufferFactory.pointPool;
        const l = buffer.activeLength;
        for (let i = l; i > -1; --i) {
            const id = buffer.values[i].entityId;
            buffer.free(id);
        }
        this.bufferPath.nbPt = 0;
     }
    public execute() { }
}

// should be part of a ComponentPool class
// behavior should be more transparent
const resizePoolIfNotEnoughtSpace = (pool: ComponentFactory<interfaces.IComponent>, nbFreeNeeded: number) => {
    if (pool.nbFreeSlot < nbFreeNeeded) {
        let size = Math.floor(pool.size + (pool.size / 2));
        if (size < nbFreeNeeded) {
            size = nbFreeNeeded * 2;
        }
        pool.resizeTo(size);
    }
};
