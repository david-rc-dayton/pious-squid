import * as assert from "assert";
import { Vector } from "../vector";

describe("Vector", () => {
    const vecA = new Vector([1, 2, 3]);
    const vecB = new Vector([4, 5, 6]);
    const vecR = new Vector([1, 1, 1]);

    describe("#slice()", () => {
        const vecASlice = vecA.slice(1, 3);
        it("should shorten the vector state length", () => {
            assert.deepEqual(vecASlice.state, [2, 3]);
        });
    });

    describe("#magnitude()", () => {
        const vecAMag = vecA.magnitude();
        it("should return the vector magnitude", () => {
            assert.equal(vecAMag, 3.7416573867739413);
        });
    });

    describe("#origin()", () => {
        const vecOrig = Vector.origin(3);
        it("should create a vector with zero state fields", () => {
            assert.deepEqual(vecOrig.state, [0, 0, 0]);
        });
    });

    describe("#distance()", () => {
        const vecDist = vecA.distance(vecB);
        it("should return the distance between two vectors", () => {
            assert.equal(vecDist, 5.196152422706632);
        });
    });

    describe("#add()", () => {
        const vecAdd = vecA.add(vecB);
        it("should return the sum of two vectors", () => {
            assert.deepEqual(vecAdd.state, [5, 7, 9]);
        });
    });

    describe("#concat()", () => {
        const vecConcat = vecA.concat(vecB);
        it("should return the concatenated state of two vectors", () => {
            assert.deepEqual(vecConcat.state, [1, 2, 3, 4, 5, 6]);
        });
    });

    describe("#scale()", () => {
        const vecScale = vecA.scale(2);
        it("should linearly scale the vector", () => {
            assert.deepEqual(vecScale.state, [2, 4, 6]);
        });
    });

    describe("#normalize()", () => {
        const vecNorm = vecA.normalize();
        it("should return a unit vector", () => {
            assert.deepEqual(vecNorm.state, [
                0.2672612419124244,
                0.5345224838248488,
                0.8017837257372732,
            ]);
            assert.equal(vecNorm.magnitude(), 1);
        });
    });

    describe("#cross()", () => {
        const vecCross = vecA.cross(vecB);
        it("should return the cross product of two vectors", () => {
            assert.deepEqual(vecCross.state, [-3, 6, -3]);
        });
    });

    describe("#dot()", () => {
        const vecDot = vecA.dot(vecB);
        it("should return the dot product of two vectors", () => {
            assert.equal(vecDot, 32);
        });
    });

    describe("#rot1()", () => {
        const vecRot1 = vecR.rot1(Math.PI);
        it("should rotate the vector along the x-axis", () => {
            assert.deepEqual(vecRot1.state.map((x) => Math.round(x)),
                [1, -1, -1]);
        });
    });

    describe("#rot2()", () => {
        const vecRot2 = vecR.rot2(Math.PI);
        it("should rotate the vector along the y-axis", () => {
            assert.deepEqual(vecRot2.state.map((x) => Math.round(x)),
                [-1, 1, -1]);
        });
    });

    describe("#rot3()", () => {
        const vecRot3 = vecR.rot3(Math.PI);
        it("should rotate the vector along the z-axis", () => {
            assert.deepEqual(vecRot3.state.map((x) => Math.round(x)),
                [-1, -1, 1]);
        });
    });
});
