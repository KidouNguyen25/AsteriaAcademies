# Save System

## Mechanism
- Local save using `localStorage` for the MVP.
- Designed to be easily migrated to `IndexedDB` later.
- Uses `asteria_academies_save_v2` storage key.

## Saved Data Schema (Version 2)
- `version`: number (always 2)
- `selectedAcademy`: string (e.g., "foundation")
- `activeDistrict`: string (e.g., "fraction_reservoir")
- `academies`: Object containing academies like `foundation` and `wonderland`.

### Academy Data
- `unlockedDistricts`: string[] (e.g., `["fraction_reservoir", "number_gate"]`)
- `districtProgress`: Record<string, DistrictProgress>

### District Progress
- `currentLevel`: string (e.g., "g6_fraction_reservoir_01")
- `solvedPuzzles`: string[] (array of puzzle IDs solved)
- `openedGates`: string[] (array of opened gate IDs)
- `stars`: number
- `wrongAttempts`: Record<string, number> (puzzle ID -> count)
- `lastCheckpoint`: { x, y, z }
- `curriculumStats`: Record<string, boolean> (node ID -> mastered)

## Implementation Rules
- Do not use cookies.
- Save after each solved puzzle and after level completion.
- When loading, if V2 save isn't found but V1 is, V1 data automatically migrates to the `fraction_reservoir` district progress.
