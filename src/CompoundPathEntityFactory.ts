import { ComponentFactory } from "ecs-framework";
import { CompoundPathComponent, IPathStyle } from "../src/CompoundPathComponent";
import { PathEntityFactory} from "../src/PathEntityFactory";
import { PathComponent, pathType } from "./PathComponent";
export { CompoundPathEntityFactory };
import { vec2 } from "gl-matrix";

class CompoundPathEntityFactory {
    public componentPool: ComponentFactory<CompoundPathComponent>;
    public pathEntityFactory: PathEntityFactory;
    public defaultStyle: IPathStyle = { lineWidth: 1, strokeStyle: "black", lineCap: "butt", lineJoin: "miter" };
    constructor(compoundPathPoolSize: number, pathPoolSize: number, pointPoolSize: number, componentPool?: ComponentFactory<CompoundPathComponent>, pathEntityFactory?: PathEntityFactory, defaultStyle?: IPathStyle ) {
        this.defaultStyle = defaultStyle || this.defaultStyle;
        this.componentPool = componentPool || new ComponentFactory<CompoundPathComponent>(compoundPathPoolSize, CompoundPathComponent, true, 0, 0, this.defaultStyle);
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
        console.log(c);
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
        if (this.pathEntityFactory.pathPool.nbCreated - beforeNbComp !==  pathIds.length) {
             throw Error("Not all paths component were copied");
        }

        const newCompound = this.create(entityId, visible, style, active);
        newCompound.firstPathId = fId;
        newCompound.nbPath = pathIds.length;
        return newCompound;
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

    // // this requiered moving all following path component / points if there are other path in the path pool
    // /**
    //  * create a path and insert it at the end of a given path
    //  * by default insert it at the end of the last path from the compound path
    //  * @param entityId
    //  * @param points
    //  * @param type
    //  * @param style
    //  */
    // public createNewPathAfter(compoundPathId: number, points:vec2[], type: pathType, style?: IPathStyle, pathId?: number) {
    //     const compoundPath = this.componentPool.get(compoundPathId);
    //     if(!compoundPath){ return; }
    //     // if no path id provided get the id of the last path of the compound path to modify
    //     const pathToInsertAfter = pathId?this.fetchLastPath(pathId):this.getLastPath(compoundPath);
    //     // create the path in the pool
    //         // first we need to
    // }
    // /**
    //  * Add a path at the tail of a compound path
    //  * @param compoundPathId
    //  * @param PathComponent
    //  */
    // public addPath(compoundPathId: number, PathComponent) {

    // }

    // public fetchPathAtPosition(compoundPathId: number, position: number) {

    // }
    // public fetchLastPath(compoundPathId: number) : PathComponent {

    // }
    // public getLastPath(compoundPath: CompoundPathComponent) : PathComponent {

    // }
// }