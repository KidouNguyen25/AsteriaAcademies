import './styles/main.css';
import { problemBank } from './puzzles/ProblemBank';
import { Game } from './game/Game';
import { academyIntro } from './ui/AcademyIntro';

async function bootstrap() {
  // Load data
  await problemBank.load('./data/problem-bank-grade-6.json');
  
  const mapDataRes = await fetch('./data/level-curriculum-map.json');
  const mapData = await mapDataRes.json();
  
  // Init game
  const game = new Game();
  game.levelManager.setMapData(mapData);
  game.init();
  
  // Show intro
  academyIntro.show(() => {
    game.start();
  });
}

bootstrap().catch(console.error);
