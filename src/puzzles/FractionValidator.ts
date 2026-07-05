export interface Fraction {
  numerator: number;
  denominator: number;
}

export class FractionValidator {
  /**
   * Parses a fraction string. Supports formats like "1/2", "0.5", "0,5"
   */
  public static parse(input: string): Fraction | null {
    const cleanInput = input.trim().replace(',', '.');

    // Handle decimal format (e.g., "0.5")
    if (!cleanInput.includes('/') && !isNaN(Number(cleanInput))) {
      const decimal = parseFloat(cleanInput);
      const precision = 10000; // supports up to 4 decimal places roughly
      return this.simplify({
        numerator: Math.round(decimal * precision),
        denominator: precision
      });
    }

    // Handle string fraction format (e.g., "1/2")
    const parts = cleanInput.split('/');
    if (parts.length === 2) {
      const num = parseInt(parts[0], 10);
      const den = parseInt(parts[1], 10);
      if (!isNaN(num) && !isNaN(den) && den !== 0) {
        return this.simplify({ numerator: num, denominator: den });
      }
    }

    return null;
  }

  /**
   * Simplifies a fraction by dividing by the greatest common divisor.
   */
  public static simplify(f: Fraction): Fraction {
    const gcd = this.getGCD(Math.abs(f.numerator), Math.abs(f.denominator));
    return {
      numerator: f.numerator / gcd,
      denominator: f.denominator / gcd
    };
  }

  /**
   * Checks if two fraction objects or strings are mathematically equivalent.
   */
  public static isEquivalent(a: string | Fraction, b: string | Fraction): boolean {
    const fA = typeof a === 'string' ? this.parse(a) : this.simplify(a);
    const fB = typeof b === 'string' ? this.parse(b) : this.simplify(b);

    if (!fA || !fB) return false;

    // Simplified fractions should be equal if they are equivalent
    return fA.numerator * fB.denominator === fB.numerator * fA.denominator;
  }

  /**
   * Returns true if fraction a > fraction b
   */
  public static isGreater(a: string | Fraction, b: string | Fraction): boolean {
    const fA = typeof a === 'string' ? this.parse(a) : a;
    const fB = typeof b === 'string' ? this.parse(b) : b;

    if (!fA || !fB) return false;

    return (fA.numerator / fA.denominator) > (fB.numerator / fB.denominator);
  }

  private static getGCD(a: number, b: number): number {
    if (b === 0) return a;
    return this.getGCD(b, a % b);
  }
}
