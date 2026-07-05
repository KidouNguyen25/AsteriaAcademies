import type { MathProblem } from './MathProblem';

export class ProblemBank {
  private problems: MathProblem[] = [];

  public async load(url: string): Promise<void> {
    try {
      const response = await fetch(url);
      this.problems = await response.json();
    } catch (e) {
      console.error('Failed to load problem bank:', e);
    }
  }

  public getProblem(id: string): MathProblem | undefined {
    return this.problems.find(p => p.id === id);
  }

  public getProblemsByNode(nodeId: string): MathProblem[] {
    return this.problems.filter(p => p.nodeId === nodeId);
  }
}

export const problemBank = new ProblemBank();
