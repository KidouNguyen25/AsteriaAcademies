import * as THREE from 'three';
import { InteractionSystem } from './InteractionSystem';
import { PlayerController } from './PlayerController';
import { sceneManager } from './SceneManager';
import { puzzlePanel } from '../ui/PuzzlePanel';
import { puzzleManager } from '../puzzles/PuzzleManager';
import { hud } from '../ui/HUD';
import { saveManager } from '../save/SaveManager';

export class FractionReservoirLevel {
  private player: PlayerController;
  private interaction: InteractionSystem;
  
  private gate: THREE.Mesh;
  
  constructor(player: PlayerController, interaction: InteractionSystem) {
    this.player = player;
    this.interaction = interaction;
    this.gate = new THREE.Mesh();
  }
  
  public load() {
    this.buildMap();
    
    // Set spawn point
    const saved = saveManager.getCurrentProgress();
    if (saved.lastCheckpoint) {
      this.player.setPosition(saved.lastCheckpoint.x, saved.lastCheckpoint.y, saved.lastCheckpoint.z);
    } else {
      this.player.setPosition(0, 0, 10);
    }
    
    // Count already solved puzzles
    saved.solvedPuzzles.forEach(_p => {
      // In a real app we'd map back, here we just count roughly or assume it was solved
    });
    
    // Check if gate should be open
    if (saved.openedGates.includes('exit_gate')) {
      this.openGate();
    }
  }

  public unload() {
    // Unloading handled by LevelManager clearing the scene
  }
  
  private buildMap() {
    const scene = sceneManager.scene;
    
    // Ground
    const groundMat = new THREE.MeshStandardMaterial({ color: '#1e293b' });
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Maze Walls
    const wallMat = new THREE.MeshStandardMaterial({ color: '#94a3b8' });
    const wallGeo = new THREE.BoxGeometry(10, 4, 1);
    
    const w1 = new THREE.Mesh(wallGeo, wallMat);
    w1.position.set(-5, 2, 5);
    w1.castShadow = true;
    w1.receiveShadow = true;
    scene.add(w1);
    
    // Reservoir A (4/6)
    this.createReservoir(scene, -8, 0, -5, 'A', 6, 4);
    
    // Reservoir B (5/8)
    this.createReservoir(scene, 0, 0, -10, 'B', 8, 5);
    
    // Reservoir C (3/5)
    this.createReservoir(scene, 8, 0, -5, 'C', 5, 3);
    
    // Observation Platform
    const platMat = new THREE.MeshStandardMaterial({ color: '#fef08a' });
    const platGeo = new THREE.BoxGeometry(4, 10, 4);
    const plat = new THREE.Mesh(platGeo, platMat);
    plat.position.set(0, 5, 5);
    plat.castShadow = true;
    scene.add(plat);
    
    // Stairs to platform (simple ramp)
    const rampGeo = new THREE.BoxGeometry(2, 12, 10);
    const ramp = new THREE.Mesh(rampGeo, wallMat);
    ramp.position.set(0, 4, 12);
    ramp.rotation.x = -Math.PI/6;
    scene.add(ramp);
    
    // Puzzle Valves
    this.createValve(scene, -8, 1, 0, 'valve_recognize');
    this.createValve(scene, 8, 1, 0, 'valve_equivalent');
    this.createValve(scene, 0, 11, 5, 'valve_compare'); // Valve on top of observation platform
    
    // Exit Gate
    const gateGeo = new THREE.BoxGeometry(6, 6, 1);
    const gateMat = new THREE.MeshStandardMaterial({ color: '#ef4444' });
    this.gate = new THREE.Mesh(gateGeo, gateMat);
    this.gate.position.set(0, 3, -18);
    this.gate.castShadow = true;
    scene.add(this.gate);
    
    // Finish Trigger
    const finishGeo = new THREE.BoxGeometry(4, 1, 4);
    const finishMat = new THREE.MeshStandardMaterial({ color: '#10b981' });
    const finish = new THREE.Mesh(finishGeo, finishMat);
    finish.position.set(0, 0, -25);
    scene.add(finish);
    
    this.interaction.addInteractable({
      id: 'Exit',
      object: finish,
      onInteract: () => {
        if (saveManager.getCurrentProgress().openedGates.includes('exit_gate')) {
          hud.showMessage('Level Complete!', 5000);
          saveManager.setCheckpoint(0,0,10);
        } else {
          hud.showMessage('The gate is locked.', 2000);
        }
      }
    });
  }
  
  private createReservoir(scene: THREE.Scene, x: number, y: number, z: number, _id: string, parts: number, filled: number) {
    const resGeo = new THREE.CylinderGeometry(2, 2, 1, 16);
    const resMat = new THREE.MeshStandardMaterial({ color: '#cbd5e1' });
    const res = new THREE.Mesh(resGeo, resMat);
    res.position.set(x, y + 0.5, z);
    
    // Visualize fraction
    for (let i=0; i<parts; i++) {
      const sliceMat = new THREE.MeshStandardMaterial({ 
        color: i < filled ? '#3b82f6' : '#1e293b',
        emissive: i < filled ? '#3b82f6' : '#000000',
        emissiveIntensity: 0.5
      });
      const sliceGeo = new THREE.BoxGeometry(0.8, 0.1, 0.8);
      const slice = new THREE.Mesh(sliceGeo, sliceMat);
      
      const angle = (i / parts) * Math.PI * 2;
      slice.position.set(x + Math.cos(angle)*1.2, y + 1.1, z + Math.sin(angle)*1.2);
      scene.add(slice);
    }
    scene.add(res);
  }
  
  private createValve(scene: THREE.Scene, x: number, y: number, z: number, objectId: string) {
    const vGeo = new THREE.TorusGeometry(0.5, 0.1, 8, 20);
    const vMat = new THREE.MeshStandardMaterial({ color: '#f59e0b' });
    const valve = new THREE.Mesh(vGeo, vMat);
    valve.position.set(x, y, z);
    scene.add(valve);
    
    this.interaction.addInteractable({
      id: objectId,
      object: valve,
      onInteract: () => {
        const problem = puzzleManager.getProblemForObject(objectId);
        if (problem) {
          puzzlePanel.onSolveSuccess = () => this.checkGate();
          puzzlePanel.onClose = () => {}; // clear ref
          puzzlePanel.show(problem);
        }
      }
    });
  }
  
  private checkGate() {
    const saved = saveManager.getCurrentProgress();
    // Assuming we need 3 puzzles solved
    if (saved.solvedPuzzles.length >= 3) {
      this.openGate();
      saveManager.markGateOpened('exit_gate');
      hud.showMessage('Exit Gate Unlocked!', 4000);
    }
  }
  
  private openGate() {
    this.gate.position.y = -10; // Simple hide mechanism
  }
}
