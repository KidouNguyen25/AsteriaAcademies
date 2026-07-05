import * as fs from 'fs';
import * as path from 'path';

function runAudit() {
  const rootDir = process.cwd();
  
  const curriculumPath = path.join(rootDir, 'public/data/curriculum-grade-6.json');
  const mapPath = path.join(rootDir, 'public/data/level-curriculum-map.json');
  
  if (!fs.existsSync(curriculumPath) || !fs.existsSync(mapPath)) {
    console.error('Data files missing.');
    return;
  }

  const curriculum = JSON.parse(fs.readFileSync(curriculumPath, 'utf8'));
  const levelMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

  const nodesWithPuzzles = new Set<string>();
  levelMap.levels.forEach((level: any) => {
    level.curriculumNodes.forEach((nodeId: string) => {
      nodesWithPuzzles.add(nodeId);
    });
  });

  const missingNodes: string[] = [];
  const coveredNodes: string[] = [];
  const allValidators = new Set<string>();

  curriculum.forEach((node: any) => {
    if (nodesWithPuzzles.has(node.id)) {
      coveredNodes.push(node.id);
    } else {
      missingNodes.push(node.id);
    }
    
    if (node.validators && Array.isArray(node.validators)) {
      node.validators.forEach((v: string) => allValidators.add(v));
    }
  });

  console.log('--- Curriculum Coverage Audit ---');
  console.log(`Total Grade 6 Nodes: ${curriculum.length}`);
  console.log(`Nodes Covered: ${coveredNodes.length}`);
  console.log(`Nodes Missing Coverage: ${missingNodes.length}`);
  
  console.log('\n--- Missing Nodes ---');
  missingNodes.forEach(node => console.log(`- ${node}`));

  console.log('\n--- Covered Nodes ---');
  coveredNodes.forEach(node => console.log(`- ${node}`));

  // Check for validators
  const validatorFiles = fs.readdirSync(path.join(rootDir, 'src/puzzles'));
  const implementedValidators = validatorFiles.filter(f => f.includes('Validator'));
  
  console.log('\n--- Validator Status ---');
  allValidators.forEach(v => {
    // Basic heuristic: check if any validator file might implement this (e.g. fraction-parser -> FractionValidator)
    const baseName = v.split('-')[0].toLowerCase(); // e.g. fraction
    const isImplemented = implementedValidators.some(f => f.toLowerCase().includes(baseName));
    if (isImplemented) {
      console.log(`- ${v}: implemented`);
    } else {
      console.log(`- ${v}: MISSING IMPLEMENTATION`);
    }
  });
  
  console.log('\nSummary: Grade 6 coverage is NOT full yet.');
}

runAudit();
