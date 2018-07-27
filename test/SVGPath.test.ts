import { expect } from "chai";
import { mat4, vec2 } from "gl-matrix";
import "mocha";
import { CompoundPathEntityFactory } from "../src/CompoundPathEntityFactory";
import { svgPathUtil } from "../src/SVGPath";

describe("SVG path", () => {
    // Path in absolute coordinates
    const absPointPath1 = [vec2.fromValues(100, 200), vec2.fromValues(100, 100), vec2.fromValues(250, 100), vec2.fromValues(250, 200), vec2.fromValues(250, 300), vec2.fromValues(400, 300), vec2.fromValues(400, 200)];
    const absSVGPath1 = "M100, 200 C100, 100, 250, 100, 250, 200 C250, 300, 400, 300, 400, 200";
    const nbCurvePath1 = 2;

    // Same path but in relative coordinate
    // Path in relative coordinates
    // First coordinate refer to the M command so it's the reference points for the next point
    // First coordinate of a C command is relative to the last coordinte of the previous point
    // subsequents coordinates are relative to the first point of their corresping command (ie: first point of a C command)
    const relativePointPath1 = [vec2.fromValues(100, 200), vec2.fromValues(0, -100), vec2.fromValues(150, 0), vec2.fromValues(150, 100), vec2.fromValues(0, 100), vec2.fromValues(150, 0), vec2.fromValues(150, -100)];
    const relativeSVGPath1  = "M100, 200 c0 -100, 150, 0, 150, 100 c0, 100, 150, 0, 150 -100";

    let cPool: CompoundPathEntityFactory;
    beforeEach(() => {
        cPool = new CompoundPathEntityFactory(10, 100, 1000);
    });
    describe("parse a svg path composed of cubic bezier curve", ()  => {
        it("absolute coordinate", () => {
            expect(cPool.pathEntityFactory.pointPool.nbCreated).to.equal(0);
            const res = svgPathUtil.parseSVGPath(1, absSVGPath1, cPool);

            expect(res.nbPath).to.equal(nbCurvePath1);
            const pointPool = cPool.pathEntityFactory.pointPool;
            expect(pointPool.nbCreated).to.equal(nbCurvePath1 * 4);

            // verify that for each cubier bezier curve we have 4 points (first correspond to the last of the previous one)
            let j = 0;
            for (let i = 0; i < pointPool.activeLength; ++i) {
                if (i % 4 === 0 && i !== 0) {
                    j -= 1;
                }
                expect(pointPool.values[i].point[0]).to.equal(absPointPath1[j][0]);
                expect(pointPool.values[i].point[1]).to.equal(absPointPath1[j][1]);
                j += 1;
            }
        });
        it("relative coordinates (should convert to absolute coordinates)", () => {
            expect(cPool.pathEntityFactory.pointPool.nbCreated).to.equal(0);
            const res = svgPathUtil.parseSVGPath(1, relativeSVGPath1, cPool);

            expect(res.nbPath).to.equal(nbCurvePath1);
            const pointPool = cPool.pathEntityFactory.pointPool;
            expect(pointPool.nbCreated).to.equal(nbCurvePath1 * 4);

            let j = 0;
            for (let i = 0; i < pointPool.activeLength; ++i) {
                if (i % 4 === 0 && i !== 0) {
                    j -= 1;
                }
                // should be converted to absolute coordinates
                expect(pointPool.values[i].point[0]).to.equal(absPointPath1[j][0]);
                expect(pointPool.values[i].point[1]).to.equal(absPointPath1[j][1]);
                j += 1;
            }

        });
    });
    describe("Import group of path", () => {});
});

// convert absolute points to relative poitns
    // let ref: vec2 = absPointPath1[0];
    // relatibPointPath1.push(absPointPath1[0]);
    // absPointPath1.forEach((p, i) => {
    //     if ((i % 4 === 0 && i !== 0) || i === 1) {
    //         // // make coordinate relative to the previous
    //         const newP = vec2.create();
    //         vec2.sub(newP, p, absPointPath1[i - 1]);
    //         relatibPointPath1.push(newP);
    //         ref = p;
    //     } else if (i !== 0) {
    //         const newP = vec2.create();
    //         vec2.sub(newP, p, ref);
    //         relatibPointPath1.push(newP);
    //     }
    // });
