import { ComponentFactory } from "ecs-framework";
import { CompoundPathComponent, IPathStyle } from "../src/CompoundPathComponent";
import { PathEntityFactory } from "../src/PathEntityFactory";
import { PathComponent, pathType } from "./PathComponent";
export { CompoundPathEntityFactory };
import { mat4, vec2 } from "gl-matrix";
import { PointComponent } from "./PointComponent";

class CompoundPathEntityFactory {
    public componentPool: ComponentFactory<CompoundPathComponent>;
    public pathEntityFactory: PathEntityFactory;
    public defaultStyle: IPathStyle = { lineWidth: 1, strokeStyle: "black", lineCap: "butt", lineJoin: "miter" };
    constructor(compoundPathPoolSize: number, pathPoolSize: number, pointPoolSize: number, componentPool?: ComponentFactory<CompoundPathComponent>, pathEntityFactory?: PathEntityFactory, defaultStyle?: IPathStyle) {
        this.defaultStyle = defaultStyle || this.defaultStyle;
        this.componentPool = componentPool || new ComponentFactory<CompoundPathComponent>(compoundPathPoolSize, new CompoundPathComponent(0, true, true, 0, 0, this.defaultStyle, mat4.create(), { from: 0, to: 1 }, 0));
        this.pathEntityFactory = pathEntityFactory || new PathEntityFactory(pointPoolSize, pathPoolSize);
    }
    /**
     * Create an empty compound path component
     * @param {number} entityId Compound Path component id
     * @param {boolean} [visible=true] Set visibility
     * @param {boolean} [active=true]  Activate the component
     */
    public create(entityId: number, visible: boolean = true, style = this.defaultStyle, active = true): CompoundPathComponent {
        const c = this.componentPool.create(entityId, active);
        c.visible = visible;
        // copy prop of style to the component
        Object.keys(style).forEach((k) => {
            c.style[k] = style[k];
        });
        return c;
    }

    /** Create a CompoundPathComponent and copy PathComponents from an input pathEntityFactory and a list of PathComponents id
     * return a CompoundPathComponent
     * @param entityId
     * @param sourcePathFactory
     * @param pathIds
     * @param visible
     * @param active
     */
    public createFromPaths(entityId: number, sourcePathFactory: PathEntityFactory, pathIds: number[], visible: boolean = true, style = this.defaultStyle, active = true) {

        const beforeNbComp = this.pathEntityFactory.pathPool.nbCreated;
        // copy paths before creating new compoundPath component
        const fId = this.copyPaths(sourcePathFactory, pathIds);
        if (this.pathEntityFactory.pathPool.nbCreated - beforeNbComp !== pathIds.length) {
            throw Error("Not all paths component were copied");
        }

        const newCompound = this.create(entityId, visible, style, active);
        newCompound.firstPathId = fId;
        newCompound.nbPath = pathIds.length;
        this.setLenght(newCompound);
        return newCompound;
    }

    public setLenght(cPath: CompoundPathComponent) {
        const points: vec2[] = [];
        const fromIndex = this.pathEntityFactory.pathPool.keys.get(cPath.firstPathId);
        if (fromIndex === undefined) {
            throw Error("first point id not found in the point pool");
        }
        const l = [];
        let length = 0;
        for (let i = fromIndex; i < fromIndex + cPath.nbPath; ++i) {
            const p = this.pathEntityFactory.pathPool.values[i];
            length += p.length;
        }
        cPath.length = length;
    }

    // should be a method of the pool
    public getLastPathId(): number {
        if (this.componentPool.activeLength === 0) { return 0; }
        return this.componentPool.values[this.componentPool.activeLength - 1].entityId;
    }

    public getPointAt(t: number, cPath: CompoundPathComponent) {
        // t distance relative to the compoundPath lenght
        const tLength = t * cPath.length;
        const fromIndex = this.getFirstPathIndex(cPath);
        let accumulatedLength = 0;
        for (let i = fromIndex; i < fromIndex + cPath.nbPath; ++i) {
            const path = this.pathEntityFactory.pathPool.values[i];
            accumulatedLength += path.length;
            if (accumulatedLength >= tLength) {
                const pathStart = accumulatedLength - path.length;
                if (pathStart < tLength) {
                    // the point lies on a path
                    // normalized t relative to the pathLenght
                    const normT = Math.abs((tLength - pathStart) / path.length);
                    const res = this.pathEntityFactory.getPointAt(normT, path);
                    return res;
                }
            }
        }
    }

    public getFirstPathIndex(cPath: CompoundPathComponent): number {
        return this.pathEntityFactory.pathPool.keys.get(cPath.firstPathId);
    }

    /** Copy paths components and their corresponding points from an inpute PathEntityFactory to the PathEntityFactory of the CompoundFactory
     * Return the pathId of the first path
     * @param inputPathFactory
     * @param pathId
     */
    protected copyPaths(inputPathFactory: PathEntityFactory, pathId: number[]): number {
        // checking that list of path id provided exist before copy them
        pathId.forEach((id) => {
            if (!inputPathFactory.pathPool.has(id)) { throw Error("some path id are incorrects"); }
        });
        const firstPathId = this.pathEntityFactory.pathPool.nbCreated + 1;
        pathId.forEach((id) => {
            // get the path from the buffer factory
            // iterate on the buffer points pool and copy points
            // create a new pathC
            // set firstPointId and nbPt on the newly created pathC

            const path = inputPathFactory.getPathComponent(id);
            const fromIndex = inputPathFactory.pointPool.keys.get(path.firstPtId);
            const firstPtId = this.pathEntityFactory.pointPool.nbCreated + 1;
            let newId = firstPtId - 1;

            // copy points
            for (let i = fromIndex; i < fromIndex + path.nbPt; ++i) {
                newId += 1;
                const newPt = this.pathEntityFactory.pointPool.create(newId, true);
                vec2.copy(newPt.point, inputPathFactory.pointPool.values[i].point);
            }
            const copiedP = this.pathEntityFactory.createPathComponent(this.pathEntityFactory.getLastPathId() + 1, firstPtId, path.nbPt, path.type, path.active);
        });
        return firstPathId;
    }

}
