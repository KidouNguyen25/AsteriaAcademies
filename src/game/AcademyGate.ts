import * as THREE from 'three';
import { InteractionSystem } from './InteractionSystem';
import { PlayerController } from './PlayerController';
import { sceneManager } from './SceneManager';
import { hud } from '../ui/HUD';
// import { levelManager } from './LevelManager'; // Will be created/updated

export class AcademyGate {
  private player: PlayerController;
  private interaction: InteractionSystem;
  private onSelectAcademy: (levelId: string) => void;

  constructor(player: PlayerController, interaction: InteractionSystem, onSelectAcademy: (levelId: string) => void) {
    this.player = player;
    this.interaction = interaction;
    this.onSelectAcademy = onSelectAcademy;
  }
  
  public load() {
    this.buildMap();
    this.player.setPosition(0, 0, 10);
    hud.showMessage('Select an Academy: Foundation (Fraction or Number)', 5000);
  }

  public unload() {
    // Basic unload logic handled by caller if necessary
  }
  
  private buildMap() {
    const scene = sceneManager.scene;
    
    // Hub Ground
    const groundMat = new THREE.MeshStandardMaterial({ color: '#f3f4f6' });
    const groundGeo = new THREE.PlaneGeometry(50, 50);
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Central Monument
    const monumentGeo = new THREE.OctahedronGeometry(2);
    const monumentMat = new THREE.MeshStandardMaterial({ color: '#8b5cf6', wireframe: true });
    const monument = new THREE.Mesh(monumentGeo, monumentMat);
    monument.position.set(0, 4, -5);
    scene.add(monument);

    // Fraction Reservoir Portal
    this.createPortal(scene, -5, 2, -5, 'g6_fraction_reservoir_01', 'Fraction Reservoir', '#3b82f6');
    
    // Number Gate Portal
    this.createPortal(scene, 5, 2, -5, 'g6_number_gate_01', 'Number Gate', '#eab308');
  }

  private createPortal(scene: THREE.Scene, x: number, y: number, z: number, levelId: string, label: string, color: string) {
    const portalGeo = new THREE.TorusGeometry(1.5, 0.2, 16, 100);
    const portalMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.5 });
    const portal = new THREE.Mesh(portalGeo, portalMat);
    portal.position.set(x, y, z);
    scene.add(portal);

    // Add invisible interaction box
    const boxGeo = new THREE.BoxGeometry(3, 4, 1);
    const boxMat = new THREE.MeshBasicMaterial({ visible: false });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.set(x, y, z);
    scene.add(box);

    this.interaction.addInteractable({
      id: `portal_${levelId}`,
      object: box,
      onInteract: () => {
        hud.showMessage(`Entering ${label}...`, 2000);
        setTimeout(() => {
          this.onSelectAcademy(levelId);
        }, 1000);
      }
    });
  }
}
