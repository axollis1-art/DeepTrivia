# Acceptance verification — 9 October 2026

Built and verified locally in `C:\Users\axoll\work\krillion`, using Node 24.20.0 and Chromium. Published at [Deep Trivia](https://deep-trivia.axollis.chatgpt.site) through Sites, using persistent D1 storage. The original Express/SQLite local server remains available.

## Question-bank expansion

The 9 October update adds 216 new playable questions and expands 14 original answer lists. Easy / Mixed / Hard and All topics / multiple topics are implemented on both backends. Default Easy, persisted choices, topic balance, repeat avoidance and Hard friend challenges pass unit/integration and browser checks. Genuine pre-expansion SQLite data and older cloud documents load without rewriting snapshots or outcomes. Challenges pin difficulty, topics, ordered snapshots and scoring version as well as timers and point values.

Validation found zero duplicate-text, identical-answer-set, alias-collision, metadata, tier or coverage errors. Nine incomplete question records are excluded from new play. Every topic supports a standalone Easy run; some narrow Hard selections require more topics. [CONTENT_REPORT.md](CONTENT_REPORT.md) provides exact topic/difficulty/answer counts, coverage decisions, source methodology and remaining gaps. The browser suites each passed eight tests; the last changes were data-only UK-city completion and plural aliases, followed by a fresh production build, full-bank validation and 20 unit/integration checks.

## Results

- Production build and TypeScript check: **passed**.
- Content validation: **passed** — 334 playable prompts, 10,126 canonical answers, all 18 topics, 191 prompts with at least 30 answers and 143 smaller closed sets, zero schema or alias-collision errors.
- Explicit migration and content seeding commands: **passed**, preserving existing data.
- Unit/API/integration/process-restart suite: **20 passed**.
- Cloud adapter suite: **6 passed**; includes rejected-answer retries, unchanged deadlines, conservative typo acceptance, concurrent submissions/claims, old-save compatibility and lossless compression of 1,200 pinned prompts below the D1 row limit.
- Local and cloud browser suites: **8 passed each**; includes retry feedback and typo acceptance within an unchanged timer, complete two-player comparison, 57 Endless rounds, 360 px layouts, lost-response recovery and the read-only visible-game tool.
- Public browser check: **passed** with real timers — two independent sessions, identical seven-question order, two 700-point results, hidden opponent results before completion, comparison refresh and a 360 px home screen without overflow or page errors.
- New cloud save and reload on the public deployment: **passed**.
- Public persistence across redeployment: **passed** — both browser sessions retrieved their original 700-point comparison after the Worker was redeployed; a new 100-point answer also saved successfully afterward.
- Production dependency audit: zero reported vulnerabilities. Development tooling has four moderate advisories inherited through the migration generator; these packages are not included in the deployed Worker bundle.

These results refer to the shipped implementation, not a mockup. Accelerated browser timers are confined to the test server; ordinary local play uses the brief’s actual 3-second reading and 25-second answer periods.

| # | Requirement | Evidence and status |
| --- | --- | --- |
| 1 | Complete seven questions and play again | **Passed.** Browser test completes a seven-question run and starts another. First-run instructions are displayed and remembered. A separate integration test completes a zero-score run. |
| 2 | At least 50 consecutive Endless prompts | **Passed.** Server test completes 56 and begins question 57; browser test completes 57 and explicitly finishes. Stage depth resets while session totals continue. |
| 3 | Consistent score/depth, perfect 700/7,000 | **Passed.** Actual perfect runs yield 700 and 7,000 m; both browser participants draw at those values. Recap and share text agree. Totals derive from round outcomes. |
| 4 | Normalisation, aliases, spelling suggestions and retries | **Passed with the user-approved rule change of 8 October.** Every canonical name and alias matches exactly. Close spellings can suggest a unique nearest answer with up to three spelling edits, depending on length, and at least 60% similarity. Suggestions require confirmation and can be dismissed. Tied matches are rejected. Both backends verify that suggestions earn no points or completed rounds, preserve deadlines, and cannot be confirmed after expiry. Browser tests cover dismissing, retrying and confirming. Unaccepted answers still allow retries within the original timer. |
| 5 | Timeout, deadline edge, late/double/retry/reload/reconnect | **Passed locally.** Server tests cover just-before-deadline and late/blank timeouts, revised retries and one outcome per round. Browser test discards a response after the server commits, then retries the original request. Challenge reload preserves the prompt/deadline. Timers use absolute server times with a documented 250 ms transport tolerance. |
| 6 | Validated substantial reviewed bank | **Passed for the shipped bank, with the review limits below.** 334 playable prompts, including 216 new playable questions; 191 have 30+ answers and the remainder are scoped closed sets. All have sources, qualifiers, aliases, tier rationales, three or more examples and exactly one gem with an original factual learning note. Validation checks structure and collisions, not every fact’s truth. |
| 7 | Isolated players, persisted comparison, server restart | **Passed locally and on the public host.** Two isolated browser contexts finish identical ordered prompts and compare real results. Two fresh local Node processes retrieve the same saved scores. On the public Sites host, both browsers retrieve their original 700-point results after Worker redeployment. |
| 8 | No hidden bank/creator answers before completion | **Passed.** Actual HTTP responses are checked: fresh guests get no run credential, results or snapshot; unfinished opponents get no creator results; only the current question is returned. Ownership checks reject a different browser’s run. There is no public content endpoint. |
| 9 | Content update cannot alter an active challenge | **Passed.** Test replaces general bank text/answers/versions and changes timer/scoring defaults after creation. The existing challenge retains its original question, version, deadline and 100-point gem score. Snapshots, points and rules are pinned. |
| 10 | Third guest, bad/expired link, unavailable storage/backend | **Passed within the local tests.** Third-player page and bad-link recovery are browser-tested. Expiry is tested against the server clock. Denied browser storage and interrupted API calls show explanatory recovery text; a closed database returns a usable 503 response. Insufficient content gives a widen-categories message. |
| 11 | Copy/share fallback without spoilers | **Passed for fallback and generated text.** Browser test denies clipboard access and verifies selectable sharing text containing totals but no answer spoilers. Native device sharing is implemented with `navigator.share`; an OS share sheet was not exercised on a physical device. |
| 12 | Keyboard, 360 px/mobile keyboard, reduced motion | **Passed for desktop/emulated browser checks; physical-device verification remains.** Enter commits answers through complete runs. Screenshots and DOM width checks cover 360 px. A reduced viewport simulates keyboard space and confirms Submit is reachable by scrolling. Reduced-motion media disables diver animation. A real phone keyboard and screen-reader audio have not been manually tested. |
| 13 | Public URL and public challenge deep-link refresh | **Passed.** The public HTTPS game loads, two isolated browser sessions finish the same challenge and compare actual 700-point results, and the public challenge page retains that comparison after refresh. |

## Review and testing limits

The bank was curated and editorially reviewed during implementation. Its automated validator is not an independent expert fact-check of all 10,126 accepted memberships. Broad categories intentionally have non-exhaustive lists and disclose that in their qualifiers. Some taxonomy/common-name conventions vary, and source websites may move or reject automated clients. The missing-answer workflow records the exact question version for further review. See [CREDITS.md](CREDITS.md).

A browser’s reduced viewport is useful evidence for keyboard reachability, but it does not reproduce every iOS/Android software-keyboard behaviour. Native OS sharing and spoken screen-reader announcements still deserve a short check on actual devices before a wider release.

The anonymous cookie establishes browser ownership. Clearing cookies changes identity and cannot recover the original player slot. An invitation is a bearer link, so the first guest who receives and claims it becomes the friend. The interface explains these limits. Prior exposure and outside research cannot be prevented; there are no strong anti-cheat claims.

## Evidence files and repeatable commands

```powershell
npm.cmd run content:validate
npm.cmd run db:migrate
npm.cmd run db:seed
npm.cmd run build
npm.cmd test
npm.cmd run test:e2e
```

The browser run writes `test-results/desktop-home.png`, `desktop-result.png`, `mobile-home.png` and `mobile-round.png`. These were visually inspected for layout, scene consistency and readable controls. The public verification also writes `test-results/public-comparison.png` and `public-mobile-home.png`. The final cloud browser run passed all eight tests.

## Public deployment

Share [Deep Trivia](https://deep-trivia.axollis.chatgpt.site), or use Challenge a friend and copy its invitation. The connected Sites deployment uses D1 and does not need a paid Render service. Render remains an optional alternative documented in the README.

The source repository is [DeepTrivia on GitHub](https://github.com/axollis1-art/DeepTrivia). Public verification used independent Chromium sessions, not two physical phones; the physical keyboard and native-sharing limits above still apply. `scripts/public-smoke.ts` checks a complete public challenge and waits for an interactive Enter after redeployment to verify retained scores. `scripts/public-save-smoke.ts` checks a fresh save and refresh on the current live backend.
