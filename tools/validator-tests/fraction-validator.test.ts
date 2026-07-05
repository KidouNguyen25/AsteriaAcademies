import { FractionValidator } from '../../src/puzzles/FractionValidator';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('Running Fraction Validator Tests...');

try {
  // Parsing tests
  assert(FractionValidator.parse('1/2')?.numerator === 1, 'Parse 1/2 numerator');
  assert(FractionValidator.parse('1/2')?.denominator === 2, 'Parse 1/2 denominator');
  assert(FractionValidator.parse('0.5')?.numerator === 1, 'Parse 0.5 numerator');
  assert(FractionValidator.parse('0.5')?.denominator === 2, 'Parse 0.5 denominator');
  assert(FractionValidator.parse('0,5')?.numerator === 1, 'Parse 0,5 numerator');

  // Equivalency tests
  assert(FractionValidator.isEquivalent('1/2', '2/4'), '1/2 equals 2/4');
  assert(FractionValidator.isEquivalent('1/2', '0.5'), '1/2 equals 0.5');
  assert(FractionValidator.isEquivalent('0,5', '1/2'), '0,5 equals 1/2');
  assert(FractionValidator.isEquivalent('3/6', '4/8'), '3/6 equals 4/8');
  assert(!FractionValidator.isEquivalent('1/3', '1/2'), '1/3 not equal to 1/2');

  // Comparison tests
  assert(FractionValidator.isGreater('4/6', '5/8'), '4/6 is greater than 5/8');
  assert(FractionValidator.isGreater('5/8', '3/5'), '5/8 is greater than 3/5');
  assert(!FractionValidator.isGreater('1/2', '3/4'), '1/2 is not greater than 3/4');
  assert(!FractionValidator.isGreater('1/2', '1/2'), '1/2 is not greater than 1/2');

  // Puzzle 3 Correct World Object Validation
  // Reservoir A: 4/6, Reservoir B: 5/8, Reservoir C: 3/5
  const resA = '4/6';
  const resB = '5/8';
  const resC = '3/5';
  
  assert(FractionValidator.isGreater(resA, resB), 'Reservoir A is greater than B');
  assert(FractionValidator.isGreater(resB, resC), 'Reservoir B is greater than C');
  assert(FractionValidator.isGreater(resA, resC), 'Reservoir A is greater than C');

  console.log('All validator tests passed successfully!');
} catch (e) {
  console.error(e);
  process.exit(1);
}
