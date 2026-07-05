export class MobileControls {
  private container: HTMLDivElement;
  private joystickBase: HTMLDivElement;
  private joystickThumb: HTMLDivElement;
  private interactBtn: HTMLButtonElement;
  
  public joystickDir = { x: 0, y: 0 };
  public interactPressed = false;
  
  private isDragging = false;
  private center = { x: 0, y: 0 };
  private maxRadius = 60;
  
  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'mobile-controls';
    
    // Joystick
    this.joystickBase = document.createElement('div');
    this.joystickBase.id = 'joystick-base';
    this.joystickThumb = document.createElement('div');
    this.joystickThumb.id = 'joystick-thumb';
    this.joystickBase.appendChild(this.joystickThumb);
    
    // Interact
    this.interactBtn = document.createElement('button');
    this.interactBtn.id = 'interact-btn';
    this.interactBtn.innerText = 'Interact';
    
    this.container.appendChild(this.joystickBase);
    this.container.appendChild(this.interactBtn);
    
    document.body.appendChild(this.container);
    
    this.setupEvents();
  }
  
  public showInteract(visible: boolean) {
    this.interactBtn.style.display = visible ? 'block' : 'none';
  }
  
  private setupEvents() {
    // We only need to support pointer events for modern mobile browsers
    this.joystickBase.addEventListener('pointerdown', this.onDragStart.bind(this));
    document.addEventListener('pointermove', this.onDrag.bind(this));
    document.addEventListener('pointerup', this.onDragEnd.bind(this));
    
    this.interactBtn.addEventListener('pointerdown', () => { this.interactPressed = true; });
    this.interactBtn.addEventListener('pointerup', () => { this.interactPressed = false; });
  }
  
  private onDragStart(e: PointerEvent) {
    this.isDragging = true;
    const rect = this.joystickBase.getBoundingClientRect();
    this.center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    this.updateThumb(e.clientX, e.clientY);
  }
  
  private onDrag(e: PointerEvent) {
    if (!this.isDragging) return;
    this.updateThumb(e.clientX, e.clientY);
  }
  
  private onDragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.joystickDir = { x: 0, y: 0 };
    this.joystickThumb.style.transform = `translate(-50%, -50%)`;
  }
  
  private updateThumb(clientX: number, clientY: number) {
    const dx = clientX - this.center.x;
    const dy = clientY - this.center.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    let moveX = dx;
    let moveY = dy;
    
    if (distance > this.maxRadius) {
      moveX = (dx / distance) * this.maxRadius;
      moveY = (dy / distance) * this.maxRadius;
    }
    
    this.joystickDir = {
      x: moveX / this.maxRadius,
      y: moveY / this.maxRadius
    };
    
    this.joystickThumb.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
  }
}

export const mobileControls = new MobileControls();
