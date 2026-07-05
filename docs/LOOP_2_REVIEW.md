# Loop 2 Review

## Approved Items
- **Save Migration**: The migration from v1 to v2 in `SaveManager.ts` is solid. It correctly deep merges the default states and handles legacy data gracefully.
- **Mobile UI**: The landscape-first constraint is successfully implemented. A CSS `@media screen and (orientation: portrait)` rule properly displays a warning when not in landscape mode.
- **Project Structure**: Level organization and curriculum data separation look reasonable.

## Rejected Items & Deficiencies
- **Fake/Shallow Implementation (Number Gate)**:
  - `NumberGateLevel.ts` and `FractionReservoirLevel.ts` both check `saved.solvedPuzzles.length >= 3` globally to open the gate, instead of validating whether the *specific* puzzles for that district have been solved. Solving 3 fraction puzzles will wrongly unlock the number gate.
  - `PuzzleManager.ts` does not contain any validation logic for Number Gate nodes (`g6_number_multiples`, `g6_number_common_factors`, `g6_number_divisibility_logic`). It defaults to returning `false`. The new puzzles are therefore unsolvable in the UI.
- **Unused & Missing Validators**: 
  - `NumberValidator.ts` contains helper functions (GCD, multiples, etc.) but is completely unused by `PuzzleManager.ts`.
  - Implementations for `multiple-validator`, `factor-validator`, `gcf-validator`, `divisibility-validator`, and `prime-validator` are entirely missing.
- **Missing Curriculum Mappings**: The `problem-bank-grade-6.json` only contains 6 nodes. It is missing the 3 nodes identified by the audit: `g6_number_natural_numbers`, `g6_number_factors`, and `g6_number_prime_composite`.
- **Memory Leaks**: `LevelManager.clearScene()` iterates over `scene.children` but does not recursively dispose of geometries and materials inside `THREE.Group` objects, leading to inevitable memory leaks during district transitions.

## Required Fixes Before Commit (Main Thread Action Items)
1. **Fix Level Unlocking Logic**: Update `NumberGateLevel.ts` and `FractionReservoirLevel.ts` to check for the specific puzzle IDs mapped to their districts, rather than using a global count.
2. **Implement Number Puzzle Validation**: Update `PuzzleManager.ts` to properly validate answers for the Number Gate curriculum nodes, utilizing `NumberValidator.ts`.
3. **Fix Memory Leak**: Refactor `LevelManager.clearScene()` to use `scene.traverse()` to recursively dispose of all `THREE.Mesh` geometries and materials properly.
4. **Update Puzzle UI**: Ensure `PuzzlePanel.ts` can render inputs or options correctly for the new Number puzzles.

## Known Limitations (Defer to Loop 3)
- **Adding Missing Curriculum Nodes**: Designing and implementing new puzzles and mechanics for the 3 missing Grade 6 math nodes (`g6_number_natural_numbers`, `g6_number_factors`, `g6_number_prime_composite`) will be deferred to Loop 3.
- **Full Validator Suite**: Writing dedicated validator classes for `factor-validator`, `gcf-validator`, `divisibility-validator`, and `prime-validator` will be completed in Loop 3.
