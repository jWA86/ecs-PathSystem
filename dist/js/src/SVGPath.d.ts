/// <reference types="gl-matrix" />
import { vec2 } from "gl-matrix";
import { CompoundPathComponent } from "./CompoundPathComponent";
import { CompoundPathEntityFactory } from "./CompoundPathEntityFactory";
export { svgPathUtil };
declare const svgPathUtil: {
    parseSVGPath: (entityId: number, svgPath: string, compoundFactory: CompoundPathEntityFactory) => CompoundPathComponent;
    parseM: (c: string, refVec: vec2, output: vec2[]) => void;
    parseC: (c: string, refVec: vec2, output: vec2[]) => void;
};
