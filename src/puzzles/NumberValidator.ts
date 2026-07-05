export class NumberValidator {
  /**
   * Filters an array of numbers to only those that are multiples of the given factor.
   */
  public static getMultiples(numbers: number[], factor: number): number[] {
    return numbers.filter(n => n % factor === 0);
  }

  /**
   * Returns the greatest common divisor of two numbers.
   */
  public static gcd(a: number, b: number): number {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  /**
   * Returns the greatest common divisor of an array of numbers.
   */
  public static gcdMultiple(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((acc, curr) => this.gcd(acc, curr));
  }

  /**
   * Checks if a given factor is a common factor of an array of numbers.
   */
  public static isCommonFactor(numbers: number[], factor: number): boolean {
    if (numbers.length === 0) return false;
    if (factor === 0) return false; // 0 cannot be a factor
    return numbers.every(n => n % factor === 0);
  }

  /**
   * Validates if the actual ordered path matches the expected sequence.
   */
  public static validateOrderedSequence(actual: number[], expected: number[]): boolean {
    if (actual.length !== expected.length) return false;
    return actual.every((val, index) => val === expected[index]);
  }
}
