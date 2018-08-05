import { vec2 } from "gl-matrix";
import { CompoundPathComponent } from "./CompoundPathComponent";
import { CompoundPathEntityFactory } from "./CompoundPathEntityFactory";
import { pathType } from "./PathComponent";
export { svgPathUtil };

const svgPathUtil = {
    /**
     * Create a CompoundEntity from a svg path
     * @param entityId the enityId to give to the entity to be created
     * @param svgPath the svgPath in string format
     * @param compoundFactory the CompoundEntityFactory use for creating the compound entity
     */
    parseSVGPath : (entityId: number, svgPath: string, compoundFactory: CompoundPathEntityFactory): CompoundPathComponent => {
        // every c or C or M = a new cubic bezier path
        // since we record 4 points for each cubic bezier we need record the last point of the previous path as the first of the new path
        // once we have the 4 points coordinates
        // create a new path
        // at the end create a compoindPath which refer to the created path

        const commands = svgPath.split(/(?=c|C|M|m)/g);
        const points: vec2[] = [];
        // Split the string so we have all elements in a array
        const firstPathId = compoundFactory.pathEntityFactory.getLastPathId() + 1;
        let nbPath = 0;
        const referencePoint = vec2.create();
        commands.forEach((command, index) => {
            command = command.trim();
            switch (command.charAt(0)) {
                case "M":
                    svgPathUtil.parseM(command, referencePoint, points);
                    break;
                case "C":
                    if (index === 0) {
                        return Error("A path can't begin with a C command");
                    }
                    svgPathUtil.parseC(command, referencePoint, points);
                    createCubicBezierComponent(points);
                    nbPath += 1;
                    break;
                case "c":
                    svgPathUtil.parseC(command, referencePoint, points);
                    createCubicBezierComponent(points);
                    nbPath += 1;
                    break;
                default:
                    return Error("Parsing of this command is not implemented : " + command);
            }
        });
        // Remove the first poitns since we copy the previous points for every C command but the first command is a M command.
        points.shift();

        // create the compoundPath and add reference to the paths
        function createCubicBezierComponent(pts: vec2[]) {
            const id = compoundFactory.pathEntityFactory.getLastPathId() + 1;
            const c = compoundFactory.pathEntityFactory.create(id, points.slice(-4), pathType.cubicBezier);
            return c;
        }

        // create the compoundPath and add reference to the paths
        const res = compoundFactory.create(entityId);
        res.firstPathId = firstPathId;
        res.nbPath = nbPath;
        return res;
    },

    /** Parse a Move command,
     *
     * Set the point as a reference for next path,
     * Point is pushed to the output array.
     * @param c
     * @param refVec
     * @param output
     */
    parseM : (c: string, refVec: vec2, output: vec2[]) => {
        // remove 'M'
        c = c.slice(1, c.length);
        const coord = c.split(",");
        const x = Number(coord[0]);
        const y = Number(coord[1]);
        if (x !== undefined && y !== undefined) {
            output.push(vec2.fromValues(x, y));
            vec2.copy(refVec, output[output.length - 1]);
        } else {
            throw Error("No readable coordinates on element : " + c);
        }
    },

    /** Parse a cubic bezier curve,
     * Set the last point as a reference for next path,
     * Points are pushed to the output array.
     * @param c
     * @param refVec
     * @param output
     */
    parseC : (c: string, refVec: vec2, output: vec2[]) => {
        const relative = c.charAt(0) === "c";
        // remove 'C' or 'c'
        c = c.slice(1, c.length);
        const curvePts = c.split(/(?=,|\-)/g);
        if (curvePts.length === 6) {
            for (let i = 0; i < 6; i += 2) {
                const x = Number(curvePts[i].replace(/^,/, ""));
                const y = Number(curvePts[i + 1].replace(/^,/, ""));
                if (relative) {
                    output.push(vec2.fromValues(refVec[0] + x, refVec[1] + y));
                } else {
                    output.push(vec2.fromValues(x, y));
                }
                // last point would serve as a reference point for the next path
                if (i === 4) {
                    vec2.copy(refVec, output[output.length - 1]);
                } else if (i === 0) {
                    vec2.copy(refVec, output[output.length - 1]);
                }
            }
        } else {
            throw Error("C, Cubic bezier element need 3 points : " + c);
        }
    },
};
