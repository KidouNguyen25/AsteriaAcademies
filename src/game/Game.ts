import { sceneManager } from './SceneManager';
import { PlayerController } from './PlayerController';
import { InteractionSystem } from './InteractionSystem';
import { LevelManager } from './LevelManager';

export class Game {
  private player: PlayerController;
  private interaction: InteractionSystem;
  public levelManager: LevelManager;
  
  private lastTime = 0;
  private isRunning = false;
  
  constructor() {
    this.player = new PlayerController();
    this.interaction = new InteractionSystem(this.player);
    this.levelManager = new LevelManager(this.player, this.interaction);
  }
  
  public init() {
    this.levelManager.loadLevel('hub');
    
    document.addEventListener('ReturnToHub', () => {
      this.levelManager.loadLevel('hub');
    });
  }
  
  public start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }
  
  public pause() {
    this.isRunning = false;
  }
  
  private loop(time: number) {
    if (!this.isRunning) return;
    
    const dt = (time - this.lastTime) / 1000;
    this.lastTime = time;
    
    // Cap dt for lag spikes
    const safeDt = Math.min(dt, 0.1);
    
    this.player.update(safeDt);
    this.interaction.update();
    
    sceneManager.render();
    
    requestAnimationFrame(this.loop.bind(this));
  }
}
