import * as operations from '../operations'
import * as assert from 'assert'

describe('operations', function () {
    describe('#factorial()', function () {
        it("should return the factorial of the input", function () {
            assert.equal(operations.factorial(10), 3628800)
        })
    })

    describe('#evalPoly()', function () {
        it("should evaluate a polynomial", function () {
            assert.equal(operations.evalPoly(3, [1, 2, 3]), 34)
        })
    })

    describe('#sign()', function () {
        it("should return the sign of the input", function () {
            assert.equal(operations.sign(1), 1)
            assert.equal(operations.sign(-1), -1)
            assert.equal(operations.sign(0), 0)
        })
    })
})