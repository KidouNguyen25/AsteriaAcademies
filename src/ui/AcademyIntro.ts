export class AcademyIntro {
  private container: HTMLDivElement;
  private onStart?: () => void;
  
  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'academy-intro';
    
    const title = document.createElement('h1');
    title.innerText = 'Select Academy';
    this.container.appendChild(title);

    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'academy-cards';
    
    // Foundation Academy Card
    const foundationCard = document.createElement('div');
    foundationCard.className = 'academy-card active';
    foundationCard.innerHTML = `
      <h3>Foundation Academy</h3>
      <p>District: Fraction Reservoir</p>
      <p class="academy-desc">Lumi: "Foundation Academy detected unstable reservoir ratios. Restore the correct valves to unlock the exit."</p>
      <button class="intro-start-btn">Start Exploration</button>
    `;
    const startBtn = foundationCard.querySelector('.intro-start-btn') as HTMLButtonElement;
    startBtn.onclick = () => {
      this.hide();
      if (this.onStart) this.onStart();
    };

    // Wonderland Academy Card (Locked)
    const wonderlandCard = document.createElement('div');
    wonderlandCard.className = 'academy-card locked';
    wonderlandCard.innerHTML = `
      <h3>Wonderland Academy</h3>
      <p>Status: Locked</p>
      <p class="academy-desc">Coming soon in future updates. Complete Foundation Academy to unlock.</p>
      <button class="intro-start-btn" disabled>Locked</button>
    `;

    cardsContainer.appendChild(foundationCard);
    cardsContainer.appendChild(wonderlandCard);
    
    this.container.appendChild(cardsContainer);
    
    document.body.appendChild(this.container);
  }
  
  public show(onStartCallback: () => void) {
    this.onStart = onStartCallback;
    this.container.style.display = 'flex';
  }
  
  public hide() {
    this.container.style.display = 'none';
  }
}

export const academyIntro = new AcademyIntro();
