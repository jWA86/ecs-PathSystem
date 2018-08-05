/// <reference types="gl-matrix" />
import { interfaces, System } from "ecs-framework";
import { vec2 } from "gl-matrix";
import { CompoundPathEntityFactory } from "./CompoundPathEntityFactory";
import { PathComponent } from "./PathComponent";
import { PathEntityFactory } from "./PathEntityFactory";
export { MouseComponent, TracePathSystem };
declare class MouseComponent implements interfaces.IComponent {
    entityId: number;
    active: boolean;
    position: vec2;
    pressed: boolean;
    constructor(entityId: number, active: boolean, position: vec2, pressed: boolean);
}
declare class TracePathSystem extends System<{}> {
    input: MouseComponent;
    destionationFactory: CompoundPathEntityFactory;
    minDistanceBtwPts: number;
    currentState: {
        currentPtId: number;
        action: string;
    };
    bufferFactory: PathEntityFactory;
    bufferPath: PathComponent;
    protected _defaultParameter: {};
    resizeWhenFreeSlotLeft: number;
    protected _resizeWhenFreeSlotLeft: number;
    protected _parameters: {};
    constructor(input: MouseComponent, destionationFactory: CompoundPathEntityFactory, minDistanceBtwPts?: number, bufferNbPoints?: number);
    resetBufferPath(): void;
    process(): void;
    moveBuffersToPool(): void;
    eraseBuffers(): void;
    execute(): void;
}
