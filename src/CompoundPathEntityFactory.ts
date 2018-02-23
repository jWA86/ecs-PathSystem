import { ComponentFactory } from "ecs-framework";
// import { PathComponent, IPathStyle, pathType } from "./PathComponent";
import { CompoundPathComponent } from "../src/CompoundPathComponent";

import { PathEntityFactory, PathEntityFactory } from "../src/PathEntityFactory";
// import { PointComponent } from "./PointComponent";
import { vec2 } from "gl-matrix";
import { PathComponent, pathType, IPathStyle } from "./PathComponent";
export { CompoundPathEntityFactory }

// Handle CRUD operation on CompoundPath component
class CompoundPathEntityFactory {
    public componentPool: ComponentFactory<CompoundPathComponent>;
    public pathEntityFactory: PathEntityFactory;
    constructor(compoundPathPoolSize: number,
        pathPoolSize: number,
        pointPoolSize: number,
        componentPool?: ComponentFactory<CompoundPathComponent>,
        pathEntityFactory?: PathEntityFactory) {
        this.componentPool = componentPool || new ComponentFactory<CompoundPathComponent>(compoundPathPoolSize, CompoundPathComponent, true, 0, 0);
        this.pathEntityFactory = pathEntityFactory || new PathEntityFactory(pointPoolSize, pathPoolSize);
        }
    /**
     * Create an empty compound path component
     * @param {number} entityId Compound Path component id
     * @param {boolean} [visible=true] Set visibility
     * @param {boolean} [active=true]  Activate the component
     */
        public create(entityId: number, visible: boolean = true, active = true): CompoundPathComponent {
        const c = this.componentPool.create(entityId, active);
        c.visible = visible;
        return c;
    }
    // create a CompoundPathComponent and copy PathComponent from a list of a id that are in a PathEntityFactory
    public createAndCopyPaths(entityId: number, pathFactory: PathEntityFactory, pathId: number[], visible: boolean = true, active = true) : CompoundPathComponent {
            let c = this.componentPool.create(entityId, active);
            let pFactory = this.pathEntityFactory;
            pathId.forEach((id) => {
                // get the path from the buffer factory
                // create a new pathC
                // iterate on the buffer points pool and copy points
                // set firstPointId and nbPt on the new pathC 
                try {

                } catch(e: Error) {
                    pathFactory.get(id);
                }
                
                const copiedP = pathFactory.pathPool.create(pathFactory.pathPool.nbCreated, true);
                
            });
            pFactory.create(pFactory.pathPool.nbCreated, pathComponent[i]. ,pathComponent[i].type, pathComponent[i].style);
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
}