# Acceptance verification — 7 October 2026

Built and verified locally in `C:\Users\axoll\work\krillion`, using Node 24.20.0, Chromium and a production Express/SQLite server. No public deployment was requested for this stage or performed.

## Results

- Production build and TypeScript check: **passed**.
- Content validation: **passed** — 120 reviewed/curated prompts, 4,789 canonical answers, all eight categories, 99 prompts with at least 25 answers, zero schema or alias-collision errors.
- Explicit migration and content seeding commands: **passed**, preserving existing data.
- Unit/API/integration/process-restart suite: **13 passed**.
- Browser suite: **4 passed**; includes complete two-player comparison, 57 Endless rounds, 360 px layouts and recovery from a saved answer’s lost response.
- Dependency audit at installation: zero reported vulnerabilities.

These results refer to the shipped implementation, not a mockup. Accelerated browser timers are confined to the test server; ordinary local play uses the brief’s actual 3-second reading and 25-second answer periods.

| # | Requirement | Evidence and status |
| --- | --- | --- |
| 1 | Complete seven questions and play again | **Passed.** Browser test completes a seven-question run and starts another. First-run instructions are displayed and remembered. A separate integration test completes a zero-score run. |
| 2 | At least 50 consecutive Endless prompts | **Passed.** Server test completes 56 and begins question 57; browser test completes 57 and explicitly finishes. Stage depth resets while session totals continue. |
| 3 | Consistent score/depth, perfect 700/7,000 | **Passed.** Actual perfect runs yield 700 and 7,000 m; both browser participants draw at those values. Recap and share text agree. Totals derive from round outcomes. |
| 4 | Normalisation, aliases, invalid/ambiguous cases | **Passed.** Every shipped canonical name and alias is matched in tests. Explicit cases cover whitespace, Unicode width, diacritics, curated alternate names, rejected typos and ambiguous aliases. Fuzzy matching is disabled. |
| 5 | Timeout, deadline edge, late/double/retry/reload/reconnect | **Passed locally.** Server tests cover just-before-deadline and late/blank timeouts, revised retries and one outcome per round. Browser test discards a response after the server commits, then retries the original request. Challenge reload preserves the prompt/deadline. Timers use absolute server times with a documented 250 ms transport tolerance. |
| 6 | Validated substantial reviewed bank | **Passed for the shipped bank, with the review limits below.** 120 original prompts; 99/120 have 25+ answers. All have sources, qualifiers, aliases, tier rationales, three or more examples and exactly one gem with an original factual learning note. Validation checks structure and collisions, not every fact’s truth. |
| 7 | Isolated players, persisted comparison, server restart | **Passed locally.** Two isolated browser contexts receive identical ordered prompt texts, finish separate perfect runs and compare real results. A separate test launches two fresh production Node processes in succession and retrieves both saved 700-point results from the same SQLite file. |
| 8 | No hidden bank/creator answers before completion | **Passed.** Actual HTTP responses are checked: fresh guests get no run credential, results or snapshot; unfinished opponents get no creator results; only the current question is returned. Ownership checks reject a different browser’s run. There is no public content endpoint. |
| 9 | Content update cannot alter an active challenge | **Passed.** Test replaces general bank text/answers/versions and changes timer/scoring defaults after creation. The existing challenge retains its original question, version, deadline and 100-point gem score. Snapshots, points and rules are pinned. |
| 10 | Third guest, bad/expired link, unavailable storage/backend | **Passed within the local tests.** Third-player page and bad-link recovery are browser-tested. Expiry is tested against the server clock. Denied browser storage and interrupted API calls show explanatory recovery text; a closed database returns a usable 503 response. Insufficient content gives a widen-categories message. |
| 11 | Copy/share fallback without spoilers | **Passed for fallback and generated text.** Browser test denies clipboard access and verifies selectable sharing text containing totals but no answer spoilers. Native device sharing is implemented with `navigator.share`; an OS share sheet was not exercised on a physical device. |
| 12 | Keyboard, 360 px/mobile keyboard, reduced motion | **Passed for desktop/emulated browser checks; physical-device verification remains.** Enter commits answers through complete runs. Screenshots and DOM width checks cover 360 px. A reduced viewport simulates keyboard space and confirms Submit is reachable by scrolling. Reduced-motion media disables diver animation. A real phone keyboard and screen-reader audio have not been manually tested. |
| 13 | Public URL and public challenge deep-link refresh | **Not passed: hosting has not been configured.** Local browser deep links survive refresh, and the production server serves deep links correctly. This is not evidence of a publicly reachable game. |

## Review and testing limits

The bank was curated and editorially reviewed during implementation. Its automated validator is not an independent expert fact-check of all 4,789 accepted answers. Broad categories intentionally have non-exhaustive lists and disclose that in their qualifiers. Some taxonomy/common-name conventions vary, and source websites may move or reject automated clients. The missing-answer workflow records the exact question version for further review. See [CREDITS.md](CREDITS.md).

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

The browser run writes `test-results/desktop-home.png`, `desktop-result.png`, `mobile-home.png` and `mobile-round.png`. These were visually inspected for layout, scene consistency and readable controls. Failed exploratory test runs were corrected; the final four-test browser run passed.

## Remaining public-sharing dependency

Follow [README.md — Send it to friends](README.md#send-it-to-friends). The supplied Render configuration needs a connected source repository, a Node web service, a persistent disk and the actual HTTPS `PUBLIC_ORIGIN`. You must create/authorise the hosting account and choose its service plan. After deployment, complete one public challenge on two devices and refresh it after a service restart to close criterion 13.

The source repository is [DeepTrivia on GitHub](https://github.com/axollis1-art/DeepTrivia). No paid hosting service was created, and no successful public deployment or public friend comparison is claimed.
