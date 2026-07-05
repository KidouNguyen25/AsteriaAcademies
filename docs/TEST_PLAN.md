# Test Plan

> [!NOTE]
> Loop 2 QA test results and criteria checklist have been documented in `docs/LOOP_2_QA.md`.
## Automated Tests
- Validator Tests: `npm run test` or `npx tsx tools/validator-tests/fraction-validator.test.ts` and `npx tsx tools/validator-tests/number-validator.test.ts`
- Curriculum Audit: `npm run audit:curriculum`
- Tests must verify:
  - `1/2` equals `2/4`
  - `1/2` equals `0.5`
  - `0,5` equals `1/2`
  - `4/6` is greater than `5/8`
  - `5/8` is greater than `3/5`
  - Puzzle 3 correct world object is Reservoir A.

## Manual Testing & Smoke Tests
- Build test: `npm install` and `npm run build` must succeed.
- Browser test: Game loads.
- Input test: Mobile controls appear; player can move; desktop WASD works.
- Interaction test: Interact button works near valves.
- Spatial test: Observation platform allows a view from above.
- Core loop test: Solving correct puzzles opens the gate. Wrong answer gives feedback. Exit completes level.
- Persistence test: Refreshing page restores progress.

## UI & Mobile UX Testing
- Device orientation test: Mobile devices must show a "portrait warning" and prompt landscape orientation.
- HUD test: Verify that Academy, District, Level, and Save Indicator are displayed.
- HUD interaction test: Clicking "Hint" shows a hint. Clicking "Return to Gate" triggers the hub return event.
- Mobile controls test: Ensure the virtual joystick (120x120) and interact button (100x100) are large enough and do not overlap with HUD elements.
- Selection UI test: On starting the game, "Select Academy" UI overlays the 3D hub, displaying an active "Foundation Academy" card and a locked "Wonderland Academy" card.
