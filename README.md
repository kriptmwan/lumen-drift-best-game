# Lumen Drift

[![make.fun](https://make.fun/badge/best-game-01.svg)](https://make.fun/bounty/best-game-01)
[![Rank](https://make.fun/badge/best-game-01/kriptmwan/lumen-drift-best-game/rank.svg)](https://make.fun/bounty/best-game-01)
[![Reward](https://make.fun/badge/best-game-01/kriptmwan/lumen-drift-best-game/reward.svg)](https://make.fun/bounty/best-game-01)

A four-sector orbital salvage expedition. Chain recoveries for score, burst between wrecks without overheating, repel hazards, then dock to bank your cargo and choose a permanent upgrade. Drifters circle the wreck, sentinels telegraph beam attacks, and hunters pursue your ship. Complete the Dawn Engine contract to win.

## Play

Run `node serve.ts --port 8793`, then visit http://127.0.0.1:8793. The game has no external assets, packages, fonts, or requests. All artwork is drawn with Canvas2D and sound is synthesized with Web Audio.

- WASD / arrow keys: steer (diagonal movement is normalized)
- Shift: burst; overheating locks boost until the drive cools
- Space / click the field: repulsor, with a seven-second cooldown
- E / click harbor: dock after meeting the sector quota
- 1 / 2 / 3: choose an upgrade at the dock
- P / Escape: pause; changing window focus also pauses
- M: toggle synthesized sound
- R: restart; Enter / Space: launch from the briefing

## Submission

`MAKEFUN_OUTPUT_DIR=out node main.ts` copies the game and four genuine browser screenshots, then builds the deterministic dossier with the unchanged competition vendor library. Node 22.18+; no installation or build step.

## Verification

Run `node --test tests/*.test.mjs` for mission regression checks. Real Chrome keyboard-event play completed all four sectors, delivered all 24 items, and won with 7,690 credits and 112/130 hull. All three upgrade choices were used during the run. No JavaScript errors were captured. The four 1280×746 JPEG screenshots are unedited Chrome renders of play, briefing, dock upgrades, and victory, all below 256 KiB. Two independent builds matched all 15 output files byte for byte; the competition vendor library remains unchanged.

The screenshot vision-review service returned HTTP 403; automated gameplay and screenshot capture succeeded, but no claim of visual human review is made.

MIT licensed.
