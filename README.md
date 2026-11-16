# Lumen Drift

[![make.fun](https://make.fun/badge/best-game-01.svg)](https://make.fun/c/best-game-01)
[![Rank](https://make.fun/badge/best-game-01/kriptmwan/lumen-drift-best-game/rank.svg)](https://make.fun/c/best-game-01)
[![Reward](https://make.fun/badge/best-game-01/kriptmwan/lumen-drift-best-game/reward.svg)](https://make.fun/c/best-game-01)

An original offline orbital salvage game. Gather four artifacts in each of two fields, then return to the green dock. Dodge coral mines and preserve your hull. After the first haul, return to repair or press 1 to enter a denser field for double salvage pay without repairs.

## Play

Run `node serve.ts --port 8793`, then visit http://127.0.0.1:8793. The game has no external assets, packages, fonts, or requests. All artwork is drawn with Canvas2D and sound is synthesized with Web Audio.

- WASD / arrow keys: steer
- Shift: boost while thrust reserve remains
- E: dock (requires four artifacts and proximity to the dock)
- 1: accept double-pay risk after first cargo bay fills
- R: restart
- Click: begin, restart, or interact with the dock / route choice

## Submission

`MAKEFUN_OUTPUT_DIR=out node main.ts` copies the game and three genuine browser screenshots, then builds the deterministic dossier with the unchanged competition vendor library. Node 22.18+; no installation or build step.

## Verification

Chrome keyboard-event playtest completed two fields, four artifacts each, and docked with 1,190 credits and 80 hull. Restart returned score and cargo to zero. Two independent dossier builds matched SHA-256. Screenshot capture uses Chrome's actual renderer at 1200×800, JPEG quality 85, without editing or compositing.

The screenshot vision-review service returned HTTP 403; automated gameplay and screenshot capture succeeded, but no claim of visual human review is made.

MIT licensed.
