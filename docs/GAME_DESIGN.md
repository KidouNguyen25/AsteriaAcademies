# Game Design Document

## Core Concept
Asteria Academies is a mobile-first 3D math puzzle game. The game currently focuses on "Foundation Academy", featuring the "Fraction Reservoir" district and the new "Number Gate" district. The game also includes an entry screen showing "Wonderland Academy" as a locked placeholder (theme: purple, broken glass).

The core gameplay loop involves:
Ground exploration -> Climb observation point -> Observe map -> Solve math puzzle -> Open gate -> Exit level -> Save.

## Implementation Rules
1. Math must be embedded into the world (no detached quiz popups). Map objects carry math meaning.
2. Spatial reasoning is required (observation platform must matter for gaining perspective to solve puzzles).
3. The game must be mobile-first (touch controls, UI scale).
4. No combat, enemies, or multiplayer.
5. Player actions must be directly tied to puzzles (e.g., interacting with objects that logically affect the environment).

## Acceptance Criteria
- Player can move via on-screen joystick and touch look.
- Player can enter the observation platform for a top-down view.
- Puzzles exist in the world, mapped to curriculum nodes.
- Correct answers open gates or activate objects.
- Wrong answers provide short textual feedback.
- Progress saves to `localStorage`.
