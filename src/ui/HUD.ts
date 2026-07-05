export class HUD {
  private container: HTMLDivElement;
  private messageEl: HTMLDivElement;
  private infoEl: HTMLDivElement;
  private saveIndicator: HTMLDivElement;
  private hintBtn: HTMLButtonElement;
  private puzzlePrompt: HTMLDivElement;
  
  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'hud-container';
    
    // Top-left info (Academy, District, Level)
    this.infoEl = document.createElement('div');
    this.infoEl.id = 'hud-info';
    this.infoEl.innerHTML = `<strong>Academy:</strong> Foundation<br><strong>District:</strong> Fraction Reservoir<br><strong>Level:</strong> 1`;
    this.container.appendChild(this.infoEl);

    // Save Indicator
    this.saveIndicator = document.createElement('div');
    this.saveIndicator.id = 'hud-save';
    this.saveIndicator.innerText = '💾 Saving...';
    this.container.appendChild(this.saveIndicator);

    // Message centered
    this.messageEl = document.createElement('div');
    this.messageEl.id = 'hud-message';
    this.container.appendChild(this.messageEl);
    
    // Hint button top-right
    this.hintBtn = document.createElement('button');
    this.hintBtn.id = 'hud-hint-btn';
    this.hintBtn.innerText = '💡 Hint';
    this.hintBtn.onclick = () => this.showMessage('Try looking at the glowing reservoirs!', 4000);
    this.container.appendChild(this.hintBtn);

    // Return to Hub button
    const hubBtn = document.createElement('button');
    hubBtn.id = 'hud-hub-btn';
    hubBtn.innerText = '🏠 Return to Gate';
    hubBtn.onclick = () => {
      // Use CustomEvent so Game/LevelManager can listen
      document.dispatchEvent(new CustomEvent('ReturnToHub'));
    };
    this.container.appendChild(hubBtn);

    // Puzzle Prompt (near interactable object)
    this.puzzlePrompt = document.createElement('div');
    this.puzzlePrompt.id = 'hud-puzzle-prompt';
    this.puzzlePrompt.innerText = 'Press Interact to solve puzzle';
    this.container.appendChild(this.puzzlePrompt);

    document.body.appendChild(this.container);
  }
  
  public showMessage(msg: string, durationMs: number = 3000) {
    this.messageEl.innerText = msg;
    this.messageEl.style.opacity = '1';
    
    setTimeout(() => {
      this.messageEl.style.opacity = '0';
    }, durationMs);
  }

  public updateInfo(academy: string, district: string, level: number) {
    this.infoEl.innerHTML = `<strong>Academy:</strong> ${academy}<br><strong>District:</strong> ${district}<br><strong>Level:</strong> ${level}`;
  }

  public showSaveIndicator() {
    this.saveIndicator.style.opacity = '1';
    setTimeout(() => {
      this.saveIndicator.style.opacity = '0';
    }, 2000);
  }

  public showPuzzlePrompt(visible: boolean) {
    this.puzzlePrompt.style.display = visible ? 'block' : 'none';
  }
}

export const hud = new HUD();
