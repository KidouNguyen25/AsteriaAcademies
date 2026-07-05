import type { MathProblem } from '../puzzles/MathProblem';
import { puzzleManager } from '../puzzles/PuzzleManager';
import { hud } from './HUD';

export class PuzzlePanel {
  private container: HTMLDivElement;
  private questionEl: HTMLDivElement;
  private optionsContainer: HTMLDivElement;
  private inputEl: HTMLInputElement;
  private submitBtn: HTMLButtonElement;
  private closeBtn: HTMLButtonElement;
  
  public onSolveSuccess?: () => void;
  public onClose?: () => void;
  
  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'puzzle-panel';
    this.container.style.display = 'none';
    
    const content = document.createElement('div');
    content.className = 'puzzle-content';
    this.container.appendChild(content);
    
    this.questionEl = document.createElement('div');
    this.questionEl.className = 'puzzle-question';
    content.appendChild(this.questionEl);
    
    this.optionsContainer = document.createElement('div');
    this.optionsContainer.className = 'puzzle-options';
    content.appendChild(this.optionsContainer);
    
    this.inputEl = document.createElement('input');
    this.inputEl.type = 'text';
    this.inputEl.placeholder = 'Enter answer (e.g. 1/2)';
    this.inputEl.className = 'puzzle-input';
    content.appendChild(this.inputEl);
    
    this.submitBtn = document.createElement('button');
    this.submitBtn.innerText = 'Submit';
    this.submitBtn.className = 'puzzle-btn submit-btn';
    this.submitBtn.onclick = () => this.handleSubmit();
    content.appendChild(this.submitBtn);
    
    this.closeBtn = document.createElement('button');
    this.closeBtn.innerText = 'Close';
    this.closeBtn.className = 'puzzle-btn close-btn';
    this.closeBtn.onclick = () => this.hide();
    content.appendChild(this.closeBtn);
    
    document.body.appendChild(this.container);
  }
  
  public show(problem: MathProblem) {
    puzzleManager.activateProblem(problem);
    this.container.style.display = 'flex';
    this.optionsContainer.innerHTML = '';
    this.inputEl.value = '';
    
    if (problem.nodeId === 'g6_fraction_recognize') {
      this.questionEl.innerText = 'Identify the fraction of the glowing reservoir:';
      this.inputEl.style.display = 'none';
      
      problem.data.options.forEach((opt: string) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => this.submitAnswer(opt);
        this.optionsContainer.appendChild(btn);
      });
    } else if (problem.nodeId === 'g6_fraction_equivalent') {
      this.questionEl.innerText = `Which fraction is equivalent to ${problem.data.baseFraction}?`;
      this.inputEl.style.display = 'none';
      
      problem.data.options.forEach((opt: string) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => this.submitAnswer(opt);
        this.optionsContainer.appendChild(btn);
      });
    } else if (problem.nodeId === 'g6_fraction_compare') {
      this.questionEl.innerText = problem.data.question;
      this.inputEl.style.display = 'none';
      
      problem.data.reservoirs.forEach((r: any) => {
        const btn = document.createElement('button');
        btn.innerText = `Reservoir ${r.id}`;
        btn.onclick = () => this.submitAnswer(r.id);
        this.optionsContainer.appendChild(btn);
      });
    } else {
      this.questionEl.innerText = 'Solve the problem:';
      this.inputEl.style.display = 'block';
    }
  }
  
  public hide() {
    this.container.style.display = 'none';
    if (this.onClose) this.onClose();
  }
  
  private handleSubmit() {
    this.submitAnswer(this.inputEl.value);
  }
  
  private submitAnswer(answer: string) {
    const isCorrect = puzzleManager.validateAnswer(answer);
    if (isCorrect) {
      hud.showMessage('Correct! Energy restored.', 3000);
      this.hide();
      if (this.onSolveSuccess) this.onSolveSuccess();
    } else {
      hud.showMessage('Incorrect ratio. Try again.', 3000);
    }
  }
}

export const puzzlePanel = new PuzzlePanel();
