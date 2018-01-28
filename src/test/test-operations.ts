import { evalPoly, factorial, sign } from '../operations'
import * as assert from 'assert'

describe('operations', function () {
    describe('#factorial()', function () {
        it("should return the factorial of the input", function () {
            assert.equal(factorial(10), 3628800)
        })
    })

    describe('#evalPoly()', function () {
        it("should evaluate a polynomial", function () {
            assert.equal(evalPoly(3, [1, 2, 3]), 34)
        })
    })

    describe('#sign()', function () {
        it("should return the sign of the input", function () {
            assert.equal(sign(1), 1)
            assert.equal(sign(-1), -1)
            assert.equal(sign(0), 0)
        })
    })
})