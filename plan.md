Implementation plan for fairness-critical cleanup and JS repair

Goals
1. Restore browser boot by fixing syntax corruption in account.js and duel.js.
2. Remove local pseudo-random/demo result generation from hunt and duel.
3. Shift fairness-critical UI to honest pending/blocked states until chain-backed data exists.
4. Keep existing app navigable and functional without pretending results are final.
5. Align arena/duel entry flow with real challenge/accept/commit/reveal expectations as far as current client/state engine allow.

Implementation prompt for coding subagent
- Project: /root/ai-projects/viz-magic
- Constraints: plain JS ES5/IIFE, no build step, production-first, minimal but real fixes, no fake blockchain outcomes.
- Required changes:
  1. Repair corrupted syntax in app/js/blockchain/account.js and app/js/ui/screens/duel.js so the app can load in browser.
  2. In account.js login(), restore regular authority validation using account.regular_authority.key_auths safely, with fallback to empty array.
  3. In hunt.js remove Date.now/Math.random pseudoHash and any optimistic local XP/loot/result awarding before proof. Hunt should still validate mana from chain account, broadcast the hunt action, and then show an honest pending / submitted state that tells the user result and rewards require chain confirmation / block processing. Do not fabricate combat resolution.
  4. In broadcast.js make solo hunt mana linkage less misleading: require an auditable spend path. Minimal acceptable production fix is to reject solo hunts without npcAccount for award-backed spend, or make hunt screen block unsupported solo resolution instead of pretending mana spend/reward completion happened.
  5. In arena.js stop launching a duel as a fully local simulated fight. Starting a duel without a combatRef should now mean initiating or preparing a real chain challenge only.
  6. In duel.js remove demo/auto/random flow from fairness-critical logic: no Math.random choice selection, no _simulateOpponentReveal, no local pseudoHash round resolution, no local auto-reveal path. If chain events are unavailable, show honest waiting/blocked status.
  7. Keep commit/reveal path operational where possible: allow challenge creation, accept, commit, reveal broadcasts, and waiting for chain-driven duel events. Use duel state / challengeData / combatRef when available rather than simulation.
  8. Keep result rendering only for chain-backed roundResults already present in duel/world state. If unavailable, do not invent them.
  9. Add minimal i18n strings needed for honest pending/unsupported states in both ru.js and en.js.
  10. Update README-ru and/or plan if necessary to reduce mismatch with shipped behavior, but do not overpromise unfinished chain syncing.
- Validation:
  - Run syntax checks with node --check on edited JS files.
  - Search for remaining fairness-critical Math.random / pseudoHash / simulateOpponentReveal in hunt.js and duel.js; only non-gameplay randomness like sound synthesis may remain.
  - Summarize changed files, checks run, and remaining risks.

Execution order
1. Fix account.js syntax.
2. Refactor hunt flow to submit-only honest state.
3. Refactor duel screen to remove fake simulation and support real challenge/accept/reveal waiting states.
4. Update arena entry points to respect honest duel flow.
5. Add i18n strings.
6. Run checks and note residual gaps.
