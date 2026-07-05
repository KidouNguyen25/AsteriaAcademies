import * as THREE from 'three';
import { PlayerController } from './PlayerController';
import { sceneManager } from './SceneManager';
import { mobileControls } from '../ui/MobileControls';
import { puzzlePanel } from '../ui/PuzzlePanel';
import { hud } from '../ui/HUD';

export interface Interactable {
  object: THREE.Object3D;
  onInteract: () => void;
  id: string;
}

export class InteractionSystem {
  private raycaster = new THREE.Raycaster();
  private interactables: Interactable[] = [];
  
  private currentTarget: Interactable | null = null;
  private interactionDistance = 3.0;
  private wasInteractPressed = false;

  constructor(_player: PlayerController) {
    
    // Desktop interaction (E key)
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'e' && this.currentTarget) {
        if (puzzlePanel.onClose) return; // Prevent if puzzle is open
        this.currentTarget.onInteract();
      }
    });
  }
  
  public addInteractable(item: Interactable) {
    this.interactables.push(item);
  }
  
  public clearInteractables() {
    this.interactables = [];
    this.currentTarget = null;
    mobileControls.showInteract(false);
  }
  
  public update() {
    // Raycast from camera center
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), sceneManager.camera);
    
    const objectsToIntersect = this.interactables.map(i => i.object);
    const intersects = this.raycaster.intersectObjects(objectsToIntersect, true);
    
    let foundInteractable: Interactable | null = null;
    
    if (intersects.length > 0 && intersects[0].distance < this.interactionDistance) {
      // Find the root interactable
      let obj: THREE.Object3D | null = intersects[0].object;
      while (obj && !this.interactables.find(i => i.object === obj)) {
        obj = obj.parent;
      }
      if (obj) {
        foundInteractable = this.interactables.find(i => i.object === obj) || null;
      }
    }
    
    if (foundInteractable !== this.currentTarget) {
      this.currentTarget = foundInteractable;
      if (this.currentTarget) {
        mobileControls.showInteract(true);
        hud.showMessage(`Press Interact near ${this.currentTarget.id}`, 2000);
      } else {
        mobileControls.showInteract(false);
      }
    }
    
    // Check mobile button
    if (mobileControls.interactPressed && !this.wasInteractPressed && this.currentTarget) {
      if (!puzzlePanel.onClose) { // check if not currently showing
        this.currentTarget.onInteract();
      }
    }
    
    this.wasInteractPressed = mobileControls.interactPressed;
  }
}
