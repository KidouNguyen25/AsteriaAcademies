import { problemBank } from './ProblemBank';
import { FractionValidator } from './FractionValidator';
import { saveManager } from '../save/SaveManager';
import type { MathProblem } from './MathProblem';
import { NumberValidator } from './NumberValidator';

export class PuzzleManager {
  private activeProblem: MathProblem | null = null;
  private mapObjectMapping: Record<string, string> = {};

  public loadMapMapping(puzzles: { puzzleId: string, mapObjectId: string }[]) {
    puzzles.forEach(p => {
      this.mapObjectMapping[p.mapObjectId] = p.puzzleId;
    });
  }

  public getProblemForObject(mapObjectId: string): MathProblem | undefined {
    const puzzleId = this.mapObjectMapping[mapObjectId];
    if (puzzleId) {
      return problemBank.getProblem(puzzleId);
    }
    return undefined;
  }

  public activateProblem(problem: MathProblem) {
    this.activeProblem = problem;
  }

  public getActiveProblem(): MathProblem | null {
    return this.activeProblem;
  }

  public validateAnswer(answer: string | number[]): boolean {
    if (!this.activeProblem) return false;

    const prob = this.activeProblem;
    let isCorrect = false;

    switch (prob.nodeId) {
      case 'g6_fraction_recognize': {
        const expected = `${prob.data.numerator}/${prob.data.denominator}`;
        isCorrect = FractionValidator.isEquivalent(answer as string, expected);
        break;
      }
      case 'g6_fraction_equivalent': {
        const expected = prob.data.targetFraction;
        isCorrect = FractionValidator.isEquivalent(answer as string, expected);
        break;
      }
      case 'g6_fraction_compare': {
        isCorrect = answer === prob.data.correctOptionId;
        break;
      }
      case 'g6_number_multiples': {
        // answer is number[] from active lamps
        const expected = prob.data.correctSequence as number[];
        const act = answer as number[];
        // Sets must match exactly
        isCorrect = act.length === expected.length && expected.every(e => act.includes(e));
        break;
      }
      case 'g6_number_common_factors': {
        // answer is the chosen key (tower value)
        const chosen = parseInt(answer as string, 10);
        isCorrect = NumberValidator.isCommonFactor(prob.data.numbers, chosen) && prob.data.correctKeys.includes(chosen) && chosen === Math.max(...prob.data.correctKeys);
        // Wait, the correct answer for GCD is exactly one value, but Problem bank has:
        // "correctKeys": [1, 2, 3, 6] for GCD? Wait, "greatest common factor". If it wants greatest:
        const expectedGCD = NumberValidator.gcdMultiple(prob.data.numbers);
        isCorrect = chosen === expectedGCD;
        break;
      }
      case 'g6_number_divisibility_logic': {
        const expected = prob.data.correctPath as number[];
        const act = answer as number[];
        isCorrect = NumberValidator.validateOrderedSequence(act, expected);
        break;
      }
      default:
        console.warn('Unknown node ID:', prob.nodeId);
        return false;
    }

    if (isCorrect) {
      saveManager.markPuzzleSolved(prob.id);
    } else {
      saveManager.recordWrongAttempt(prob.id);
    }

    return isCorrect;
  }
}

export const puzzleManager = new PuzzleManager();
