import { SaveManager, SaveDataV1, saveManager } from '../../src/save/SaveManager.ts';

// Mock localStorage
const store: Record<string, string> = {};
(global as any).localStorage = {
  getItem: (key: string) => store[key] || null,
  setItem: (key: string, val: string) => { store[key] = val; },
  removeItem: (key: string) => { delete store[key]; }
};

// Test V2 save creation
console.log('Testing fresh save creation...');
let sm = new SaveManager();
let data = sm.getData();
if (data.version === 2 && data.academies.foundation.unlockedDistricts.includes('number_gate')) {
  console.log('✔ V2 defaults created successfully');
} else {
  console.error('❌ V2 defaults failed');
}

// Test V1 migration
console.log('Testing V1 migration...');
store['asteria_academies_save_v1'] = JSON.stringify({
  currentAcademy: 'Foundation Academy',
  currentDistrict: 'Fraction Reservoir',
  currentLevel: 'g6_fraction_reservoir_01',
  solvedPuzzles: ['p1', 'p2'],
  openedGates: ['exit_gate'],
  stars: 3,
  wrongAttempts: { p3: 2 },
  lastCheckpoint: { x: 1, y: 2, z: 3 },
  curriculumStats: {}
} as SaveDataV1);
delete store['asteria_academies_save_v2']; // ensure v2 doesn't exist

sm = new SaveManager(); // should trigger migration
data = sm.getData();
const prog = sm.getCurrentProgress(); // defaults to foundation / fraction_reservoir

if (
  data.version === 2 &&
  prog.solvedPuzzles.includes('p1') &&
  prog.openedGates.includes('exit_gate') &&
  prog.lastCheckpoint?.x === 1
) {
  console.log('✔ Migration successful');
} else {
  console.error('❌ Migration failed', data);
}

// Test Save/Load
sm.markPuzzleSolved('p3');
sm.save();
const sm3 = new SaveManager();
if (sm3.getCurrentProgress().solvedPuzzles.includes('p3')) {
  console.log('✔ Save/Load successful');
} else {
  console.error('❌ Save/Load failed');
}
