import * as THREE from 'three';
import { sceneManager } from './SceneManager';
import { mobileControls } from '../ui/MobileControls';

export class PlayerController {
  public position = new THREE.Vector3(0, 1, 0);
  public object: THREE.Object3D;
  private camera: THREE.Camera;
  
  private velocity = new THREE.Vector3();
  private direction = new THREE.Vector3();
  private speed = 5.0;
  
  // Desktop controls
  private keys = { w: false, a: false, s: false, d: false };
  private isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };
  
  // Camera rotation
  public rotationY = 0;
  public rotationX = 0;
  
  constructor() {
    this.camera = sceneManager.camera;
    this.object = new THREE.Object3D();
    this.object.position.copy(this.position);
    sceneManager.scene.add(this.object);
    
    this.setupDesktopControls();
    this.setupTouchLookControls();
  }
  
  public setPosition(x: number, y: number, z: number) {
    this.position.set(x, y, z);
    this.object.position.copy(this.position);
  }
  
  private setupDesktopControls() {
    document.addEventListener('keydown', (e) => {
      if (this.keys.hasOwnProperty(e.key.toLowerCase())) {
        this.keys[e.key.toLowerCase() as keyof typeof this.keys] = true;
      }
    });
    
    document.addEventListener('keyup', (e) => {
      if (this.keys.hasOwnProperty(e.key.toLowerCase())) {
        this.keys[e.key.toLowerCase() as keyof typeof this.keys] = false;
      }
    });
    
    document.addEventListener('mousedown', (e) => {
      // Don't drag if clicking UI
      if ((e.target as HTMLElement).tagName === 'BUTTON') return;
      this.isDragging = true;
      this.previousMousePosition = { x: e.offsetX, y: e.offsetY };
    });
    
    document.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const deltaMove = {
          x: e.offsetX - this.previousMousePosition.x,
          y: e.offsetY - this.previousMousePosition.y
        };
        
        this.rotationY -= deltaMove.x * 0.005;
        this.rotationX -= deltaMove.y * 0.005;
        this.rotationX = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.rotationX));
        
        this.previousMousePosition = { x: e.offsetX, y: e.offsetY };
      }
    });
    
    document.addEventListener('mouseup', () => {
      this.isDragging = false;
    });
  }
  
  private setupTouchLookControls() {
    // Touch swipe to look around (right side of screen usually, or anywhere not joystick)
    document.addEventListener('touchstart', (e) => {
      if ((e.target as HTMLElement).id === 'joystick-base' || (e.target as HTMLElement).id === 'joystick-thumb') return;
      if ((e.target as HTMLElement).tagName === 'BUTTON') return;
      
      const touch = e.changedTouches[0];
      this.previousMousePosition = { x: touch.clientX, y: touch.clientY };
    });
    
    document.addEventListener('touchmove', (e) => {
      if ((e.target as HTMLElement).id === 'joystick-base' || (e.target as HTMLElement).id === 'joystick-thumb') return;
      
      const touch = e.changedTouches[0];
      const deltaMove = {
        x: touch.clientX - this.previousMousePosition.x,
        y: touch.clientY - this.previousMousePosition.y
      };
      
      this.rotationY -= deltaMove.x * 0.005;
      this.rotationX -= deltaMove.y * 0.005;
      this.rotationX = Math.max(-Math.PI/2.5, Math.min(Math.PI/2.5, this.rotationX));
      
      this.previousMousePosition = { x: touch.clientX, y: touch.clientY };
    }, { passive: true });
  }
  
  public update(dt: number) {
    this.direction.set(0, 0, 0);
    
    // Keyboard mapping
    if (this.keys.w) this.direction.z = -1;
    if (this.keys.s) this.direction.z = 1;
    if (this.keys.a) this.direction.x = -1;
    if (this.keys.d) this.direction.x = 1;
    
    // Mobile joystick mapping (overrides keyboard if active)
    if (mobileControls.joystickDir.x !== 0 || mobileControls.joystickDir.y !== 0) {
      this.direction.x = mobileControls.joystickDir.x;
      this.direction.z = mobileControls.joystickDir.y;
    }
    
    this.direction.normalize();
    
    // Apply camera rotation Y to movement direction
    this.direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotationY);
    
    this.velocity.copy(this.direction).multiplyScalar(this.speed * dt);
    this.position.add(this.velocity);
    
    this.object.position.copy(this.position);
    
    // Update camera to follow player (first person perspective)
    this.camera.position.copy(this.position);
    this.camera.position.y += 1.5; // eye height
    
    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    euler.x = this.rotationX;
    euler.y = this.rotationY;
    this.camera.quaternion.setFromEuler(euler);
  }
}
