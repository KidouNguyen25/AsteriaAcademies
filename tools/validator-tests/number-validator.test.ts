import { NumberValidator } from '../../src/puzzles/NumberValidator';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function arrayEquals(a: any[], b: any[]): boolean {
  return a.length === b.length && a.every((val, idx) => val === b[idx]);
}

console.log('Running Number Validator Tests...');

try {
  // multiples of 3 from [3,4,6,8,9,12] are [3,6,9,12]
  const multiples = NumberValidator.getMultiples([3, 4, 6, 8, 9, 12], 3);
  assert(arrayEquals(multiples, [3, 6, 9, 12]), 'multiples of 3 from [3,4,6,8,9,12] are [3,6,9,12]');

  // gcd of 18 and 24 is 6
  assert(NumberValidator.gcd(18, 24) === 6, 'gcd of 18 and 24 is 6');

  // 6 is a common factor of 18 and 24
  assert(NumberValidator.isCommonFactor([18, 24], 6), '6 is a common factor of 18 and 24');

  // 8 is not a common factor of 18 and 24
  assert(!NumberValidator.isCommonFactor([18, 24], 8), '8 is not a common factor of 18 and 24');

  // ordered path accepts correct sequence
  assert(NumberValidator.validateOrderedSequence([1, 2, 3], [1, 2, 3]), 'ordered path accepts correct sequence');

  // ordered path rejects wrong sequence
  assert(!NumberValidator.validateOrderedSequence([1, 3, 2], [1, 2, 3]), 'ordered path rejects wrong sequence');

  console.log('All number validator tests passed successfully!');
} catch (e) {
  console.error(e);
  process.exit(1);
}
