import * as THREE from 'three';
import { sceneManager } from './SceneManager';
import { PlayerController } from './PlayerController';
import { InteractionSystem } from './InteractionSystem';
import { FractionReservoirLevel } from './FractionReservoirLevel';
import { NumberGateLevel } from './NumberGateLevel';
import { AcademyGate } from './AcademyGate';
import { puzzleManager } from '../puzzles/PuzzleManager';

export class LevelManager {
  private player: PlayerController;
  private interaction: InteractionSystem;
  
  public currentLevelId: string = 'hub';
  private currentLevelInstance: any = null;
  private mapData: any = null;

  constructor(player: PlayerController, interaction: InteractionSystem) {
    this.player = player;
    this.interaction = interaction;
  }

  public setMapData(data: any) {
    this.mapData = data;
  }

  public loadLevel(levelId: string) {
    // Unload current
    if (this.currentLevelInstance && this.currentLevelInstance.unload) {
      this.currentLevelInstance.unload();
    }
    
    // Clear scene (keep lights/camera)
    this.clearScene();
    this.interaction.clearInteractables();

    this.currentLevelId = levelId;

    if (levelId === 'hub') {
      this.currentLevelInstance = new AcademyGate(this.player, this.interaction, (selectedLevelId) => {
        this.loadLevel(selectedLevelId);
      });
    } else if (levelId === 'g6_fraction_reservoir_01') {
      this.currentLevelInstance = new FractionReservoirLevel(this.player, this.interaction);
      this.loadLevelMapping(levelId);
    } else if (levelId === 'g6_number_gate_01') {
      this.currentLevelInstance = new NumberGateLevel(this.player, this.interaction);
      this.loadLevelMapping(levelId);
    }

    if (this.currentLevelInstance) {
      this.currentLevelInstance.load();
    }
  }

  private loadLevelMapping(levelId: string) {
    if (this.mapData && this.mapData.levels) {
      const levelData = this.mapData.levels.find((l: any) => l.id === levelId);
      if (levelData && levelData.puzzles) {
        puzzleManager.loadMapMapping(levelData.puzzles);
      }
    }
  }

  private clearScene() {
    // Remove all meshes from scene, keep lights and camera
    const toRemove: THREE.Object3D[] = [];
    sceneManager.scene.children.forEach(child => {
      if (child instanceof THREE.Mesh || child instanceof THREE.Group) {
        toRemove.push(child);
      }
    });
    
    toRemove.forEach(child => {
      sceneManager.scene.remove(child);
      child.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach(m => m.dispose());
            } else {
              obj.material.dispose();
            }
          }
        }
      });
    });
  }
}
