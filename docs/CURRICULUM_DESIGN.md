# Curriculum Design

## Structure
The game maps educational content to specific curriculum nodes. A node defines:
- `grade`: Target grade level.
- `strand`: Mathematical strand (e.g., Number Sense).
- `topic`: Broad topic (e.g., Fractions).
- `skill`: Specific skill (e.g., Equivalent Fractions).
- `academy`: The in-game location (e.g., Foundation Academy).
- `district`: The specific sub-area (e.g., Fraction Reservoir).
- `coverageStatus`: Honest assessment of curriculum coverage (e.g., introduced, practiced, appliedInMap, assessed, challengeAvailable).
- `validators`: The code checks used to validate answers.

## Implementation Rules
- Puzzles must reference a specific curriculum node ID.
- Validators must do semantic math validation (e.g., `1/2` == `2/4`), not just string matching.
- A node's coverage status must reflect its actual implementation state in the game.
