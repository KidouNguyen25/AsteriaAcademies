export interface SaveDataV1 {
  currentAcademy: string;
  currentDistrict: string;
  currentLevel: string;
  solvedPuzzles: string[];
  openedGates: string[];
  stars: number;
  wrongAttempts: Record<string, number>;
  lastCheckpoint: { x: number; y: number; z: number } | null;
  curriculumStats: Record<string, boolean>;
}

export interface DistrictProgress {
  currentLevel: string;
  solvedPuzzles: string[];
  openedGates: string[];
  stars: number;
  wrongAttempts: Record<string, number>;
  lastCheckpoint: { x: number; y: number; z: number } | null;
  curriculumStats: Record<string, boolean>;
}

export interface AcademyData {
  unlockedDistricts: string[];
  districtProgress: Record<string, DistrictProgress>;
}

export interface SaveData {
  version: 2;
  selectedAcademy: string;
  activeDistrict: string;
  academies: {
    foundation: AcademyData;
    wonderland: AcademyData;
  };
}

const createDefaultDistrictProgress = (): DistrictProgress => ({
  currentLevel: '',
  solvedPuzzles: [],
  openedGates: [],
  stars: 0,
  wrongAttempts: {},
  lastCheckpoint: null,
  curriculumStats: {}
});

const DEFAULT_SAVE: SaveData = {
  version: 2,
  selectedAcademy: 'foundation',
  activeDistrict: 'fraction_reservoir',
  academies: {
    foundation: {
      unlockedDistricts: ['fraction_reservoir', 'number_gate'],
      districtProgress: {
        fraction_reservoir: {
          ...createDefaultDistrictProgress(),
          currentLevel: 'g6_fraction_reservoir_01'
        },
        number_gate: {
          ...createDefaultDistrictProgress(),
          currentLevel: 'g6_number_gate_01'
        }
      }
    },
    wonderland: {
      unlockedDistricts: [],
      districtProgress: {}
    }
  }
};

export class SaveManager {
  private static readonly SAVE_KEY_V1 = 'asteria_academies_save_v1';
  private static readonly SAVE_KEY_V2 = 'asteria_academies_save_v2';
  private data: SaveData;

  constructor() {
    this.data = this.load();
  }

  public load(): SaveData {
    try {
      const storedV2 = localStorage.getItem(SaveManager.SAVE_KEY_V2);
      if (storedV2) {
        const parsed = JSON.parse(storedV2);
        // Deep merge to ensure all defaults exist
        return {
          ...DEFAULT_SAVE,
          ...parsed,
          academies: {
            foundation: {
              ...DEFAULT_SAVE.academies.foundation,
              ...(parsed.academies?.foundation || {})
            },
            wonderland: {
              ...DEFAULT_SAVE.academies.wonderland,
              ...(parsed.academies?.wonderland || {})
            }
          }
        };
      }

      const storedV1 = localStorage.getItem(SaveManager.SAVE_KEY_V1);
      if (storedV1) {
        const v1Data: SaveDataV1 = JSON.parse(storedV1);
        return this.migrateV1toV2(v1Data);
      }
    } catch (e) {
      console.error('Failed to load save data:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_SAVE));
  }

  private migrateV1toV2(v1Data: SaveDataV1): SaveData {
    const v2Data = JSON.parse(JSON.stringify(DEFAULT_SAVE)) as SaveData;
    
    // Migrate v1 to foundation's fraction_reservoir
    v2Data.academies.foundation.districtProgress['fraction_reservoir'] = {
      currentLevel: v1Data.currentLevel || 'g6_fraction_reservoir_01',
      solvedPuzzles: v1Data.solvedPuzzles || [],
      openedGates: v1Data.openedGates || [],
      stars: v1Data.stars || 0,
      wrongAttempts: v1Data.wrongAttempts || {},
      lastCheckpoint: v1Data.lastCheckpoint || null,
      curriculumStats: v1Data.curriculumStats || {}
    };

    return v2Data;
  }

  public save(): void {
    try {
      localStorage.setItem(SaveManager.SAVE_KEY_V2, JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to save data:', e);
    }
  }

  public getData(): SaveData {
    return this.data;
  }

  public getCurrentProgress(): DistrictProgress {
    const academy = this.data.selectedAcademy as 'foundation' | 'wonderland';
    const district = this.data.activeDistrict;
    if (!this.data.academies[academy].districtProgress[district]) {
      this.data.academies[academy].districtProgress[district] = createDefaultDistrictProgress();
    }
    return this.data.academies[academy].districtProgress[district];
  }

  public markPuzzleSolved(puzzleId: string): void {
    const progress = this.getCurrentProgress();
    if (!progress.solvedPuzzles.includes(puzzleId)) {
      progress.solvedPuzzles.push(puzzleId);
      this.save();
    }
  }

  public recordWrongAttempt(puzzleId: string): void {
    const progress = this.getCurrentProgress();
    if (!progress.wrongAttempts[puzzleId]) {
      progress.wrongAttempts[puzzleId] = 0;
    }
    progress.wrongAttempts[puzzleId]++;
    this.save();
  }

  public markGateOpened(gateId: string): void {
    const progress = this.getCurrentProgress();
    if (!progress.openedGates.includes(gateId)) {
      progress.openedGates.push(gateId);
      this.save();
    }
  }

  public setCheckpoint(x: number, y: number, z: number): void {
    const progress = this.getCurrentProgress();
    progress.lastCheckpoint = { x, y, z };
    this.save();
  }

  public reset(): void {
    this.data = JSON.parse(JSON.stringify(DEFAULT_SAVE));
    this.save();
  }
}

export const saveManager = new SaveManager();
