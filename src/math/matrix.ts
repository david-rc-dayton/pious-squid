/** Class representing a matrix. */
export class Matrix {
  /**
   * Create a new object using the values from an array.
   *
   * @param values matrix elements
   */
  public static fromArray(values: number[][]) {
    return new Matrix(...values);
  }

  /** Matrix state elements. */
  public readonly state: number[][];

  /**
   * Create a new Matrix object.
   *
   * An error will be thrown if the element array is empty.
   *
   * @param elements vector elements
   */
  constructor(...elements: number[][]) {
    if (elements.length === 0 || elements[0].length === 0) {
      throw new Error("Matrix state cannot be empty.");
    }
    this.state = elements;
  }
}
