/// <reference types="gl-matrix" />
import { ComponentFactory } from "ecs-framework";
import { CompoundPathComponent, IPathStyle } from "../src/CompoundPathComponent";
import { PathEntityFactory } from "../src/PathEntityFactory";
export { CompoundPathEntityFactory };
import { vec2 } from "gl-matrix";
declare class CompoundPathEntityFactory {
    componentPool: ComponentFactory<CompoundPathComponent>;
    pathEntityFactory: PathEntityFactory;
    defaultStyle: IPathStyle;
    constructor(compoundPathPoolSize: number, pathPoolSize: number, pointPoolSize: number, componentPool?: ComponentFactory<CompoundPathComponent>, pathEntityFactory?: PathEntityFactory, defaultStyle?: IPathStyle);
    /**
     * Create an empty compound path component
     * @param {number} entityId Compound Path component id
     * @param {boolean} [visible=true] Set visibility
     * @param {boolean} [active=true]  Activate the component
     */
    create(entityId: number, visible?: boolean, style?: IPathStyle, active?: boolean): CompoundPathComponent;
    /** Create a CompoundPathComponent and copy PathComponents from an input pathEntityFactory and a list of PathComponents id
     * return a CompoundPathComponent
     * @param entityId
     * @param sourcePathFactory
     * @param pathIds
     * @param visible
     * @param active
     */
    createFromPaths(entityId: number, sourcePathFactory: PathEntityFactory, pathIds: number[], visible?: boolean, style?: IPathStyle, active?: boolean): CompoundPathComponent;
    setLenght(cPath: CompoundPathComponent): void;
    getLastPathId(): number;
    getPointAt(t: number, cPath: CompoundPathComponent): vec2;
    getFirstPathIndex(cPath: CompoundPathComponent): number;
    /** Copy paths components and their corresponding points from an inpute PathEntityFactory to the PathEntityFactory of the CompoundFactory
     * Return the pathId of the first path
     * @param inputPathFactory
     * @param pathId
     */
    protected copyPaths(inputPathFactory: PathEntityFactory, pathId: number[]): number;
}
