# Map Design Rules

## Theme & Style
- Foundation Academy is an abandoned academy-city.
- **Fraction Reservoir District:** Blocky reservoir district (low-poly) with water and valves. Colors: blue-gray, chalk-white, pale yellow accents.
- **Number Gate District (Loop 2):** Distinct from the reservoir. Features stone gates, number lamps, and divisibility towers. No water or valves.
- **Wonderland Academy (Placeholder):** Only a locked placeholder entry. Theme: purple, broken glass.
- Simple geometry, mobile-friendly.
- No heavy shadows, no post-processing, no large textures.

## Required Elements
- Player spawn point.
- Puzzle zones (reservoir zones for Fraction Reservoir, stone gates/towers for Number Gate).
- Observation platform/tower.
- Interactive objects for puzzles (valves for fractions, number lamps for Number Gate).
- Locked exit gate.
- Short paths and walls forming a maze.
- Simple signs.
- Finish trigger.

## Loop Support
The map must support the core flow: Start -> explore -> reach observation platform -> inspect puzzle zones -> interact with correct puzzle objects -> open gate -> exit.
