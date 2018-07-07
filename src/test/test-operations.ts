import { assert } from "chai";
import * as operations from "../operations";

describe("operations", () => {
  describe("#factorial()", () => {
    it("should return the factorial of the input", () => {
      assert.equal(operations.factorial(10), 3628800);
    });
  });

  describe("#evalPoly()", () => {
    it("should evaluate a polynomial", () => {
      assert.equal(operations.evalPoly(3, [1, 2, 3]), 34);
    });
  });

  describe("#sign()", () => {
    it("should return the sign of the input", () => {
      assert.equal(operations.sign(1), 1);
      assert.equal(operations.sign(-1), -1);
      assert.equal(operations.sign(0), 0);
    });
  });
});
