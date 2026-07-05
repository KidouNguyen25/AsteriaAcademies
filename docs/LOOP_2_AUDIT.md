# Project Audit (Loop 2 Readiness)

## Current Status
- The project successfully builds (`npm run build`), though Vite triggers a chunk size warning (>500kB).
- Custom validator test `tools/validator-tests/fraction-validator.test.ts` passes, ensuring the fraction parsing, equivalency, and comparison logic works.
- Source code is well-structured into `src/game`, `src/puzzles`, `src/save`, `src/ui`, and `src/styles`.
- Real curriculum data lives correctly in `public/data/` so it can be fetched at runtime.
- Git repository contains untracked directories (`src/game`, `src/puzzles`, etc.) and uncommitted changes (`src/main.ts`, `vite.config.ts`, `index.html`) from Loop 1 implementation.

## Risks
- **High Risk (Testing):** The primary `tests/` directory only contains a dummy test. Crucial systems like `SaveManager`, `PlayerController`, and `PuzzleManager` are completely untested.
- **Moderate Risk (Performance):** The Vite build warns about large chunks. This might lead to slow initial load times for the browser-based game.
- **Low Risk (Clutter):** There is a redundant `data/curriculum.json` file outside of `public/` that may cause confusion.

## Regression Points
- **Integration Points:** The data handoff between `PuzzleManager` (fetching `public/data/` JSON) and `Game` is brittle. Any change to the JSON structure without integration tests could silently break the game at runtime.
- **Save System:** `SaveManager` relies on `localStorage`. A lack of corruption handling or schema versioning could break user progress across updates.

## Refactor Targets
- **Testing Migration:** Migrate `tools/validator-tests/fraction-validator.test.ts` to `tests/fraction-validator.test.ts` and run it via Vitest. Add unit tests for `SaveManager` and `PuzzleManager`.
- **Build Optimization:** Add `build.rollupOptions.output.manualChunks` to `vite.config.ts` to separate vendor libraries and resolve chunk size warnings.
- **Cleanup:** Remove `data/curriculum.json` if it's unused.

## Safe Implementation Plan
1. **Commit Loop 1 State:** Add and commit all untracked files and modifications to Git to establish a clean baseline.
2. **Clean up & Optimize:** Remove redundant data files and optimize Vite bundle chunking.
3. **Establish Testing:** Integrate the fraction validator tests into Vitest. Write baseline tests for `SaveManager` and `PuzzleManager`.
4. **Begin Loop 2 Features:** Once the foundation is tested and committed, proceed to implement the next major features or gameplay loops.
