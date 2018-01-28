import { Vector } from '../vector'
import * as assert from 'assert'
import { deepEqual } from 'assert';

describe("Vector", function () {
    let vecA = new Vector([1, 2, 3])
    let vecB = new Vector([4, 5, 6])
    let vecR = new Vector([1, 1, 1])

    describe("#slice()", function () {
        let vecASlice = vecA.slice(1, 3)
        it("should shorten the vector state length", function () {
            assert.deepEqual(vecASlice.state, [2, 3])
        })
    })

    describe("#magnitude()", function () {
        let vecAMag = vecA.magnitude()
        it("should return the vector magnitude", function () {
            assert.equal(vecAMag, 3.7416573867739413)
        })
    })

    describe("#origin()", function () {
        let vecOrig = Vector.origin(3)
        it("should create a vector with zero state fields", function () {
            assert.deepEqual(vecOrig.state, [0, 0, 0])
        })
    })

    describe("#distance()", function () {
        let vecDist = vecA.distance(vecB)
        it("should return the distance between two vectors", function () {
            assert.equal(vecDist, 5.196152422706632)
        })
    })

    describe("#add()", function () {
        let vecAdd = vecA.add(vecB)
        it("should return the sum of two vectors", function () {
            assert.deepEqual(vecAdd.state, [5, 7, 9])
        })
    })

    describe("#concat()", function () {
        let vecConcat = vecA.concat(vecB)
        it("should return the concatenated state of two vectors", function () {
            assert.deepEqual(vecConcat.state, [1, 2, 3, 4, 5, 6])
        })
    })

    describe("#scale()", function () {
        let vecScale = vecA.scale(2)
        it("should linearly scale the vector", function () {
            assert.deepEqual(vecScale.state, [2, 4, 6])
        })
    })

    describe("#normalize()", function () {
        let vecNorm = vecA.normalize()
        it("should return a unit vector", function () {
            assert.deepEqual(vecNorm.state, [
                0.2672612419124244,
                0.5345224838248488,
                0.8017837257372732
            ])
            assert.equal(vecNorm.magnitude(), 1)
        })
    })

    describe("#cross()", function () {
        let vecCross = vecA.cross(vecB)
        it("should return the cross product of two vectors", function () {
            assert.deepEqual(vecCross.state, [-3, 6, -3])
        })
    })

    describe("#dot()", function () {
        let vecDot = vecA.dot(vecB)
        it("should return the dot product of two vectors", function () {
            assert.equal(vecDot, 32)
        })
    })

    describe("#rot1()", function () {
        let vecRot1 = vecR.rot1(Math.PI)
        it("should rotate the vector along the x-axis", function () {
            assert.deepEqual(vecRot1.state.map((x) => Math.round(x)),
                [1, -1, -1])
        })
    })

    describe("#rot2()", function () {
        let vecRot2 = vecR.rot2(Math.PI)
        it("should rotate the vector along the y-axis", function () {
            assert.deepEqual(vecRot2.state.map((x) => Math.round(x)),
                [-1, 1, -1])
        })
    })

    describe("#rot3()", function () {
        let vecRot3 = vecR.rot3(Math.PI)
        it("should rotate the vector along the z-axis", function () {
            assert.deepEqual(vecRot3.state.map((x) => Math.round(x)),
                [-1, -1, 1])
        })
    })
})