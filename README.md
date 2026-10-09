# Deep Trivia

A playable British-English ocean trivia game: unlimited seven-question dives, continuous Endless mode, untimed solo practice, and asynchronous two-person challenges. React/TypeScript frontend, Express APIs, and persistent SQLite. All scoring happens on the server. No accounts, ads, paywall, lives or play quotas.

**Play online: [Deep Trivia](https://deep-trivia.axollis.chatgpt.site).** The public site uses the cloud adapter and persistent D1 storage through Sites. No Render service or paid Render plan is needed for this deployment.

## Play locally

Requires **Node.js 24**. To download the project on another computer:

```powershell
git clone https://github.com/axollis1-art/DeepTrivia.git
cd DeepTrivia
```

```powershell
npm.cmd ci
npm.cmd run dev
```

Open **http://localhost:3000**. Use that exact hostname so the same-origin session checks agree. Keep this terminal open while playing. Ctrl+C stops the server. On macOS/Linux, use `npm` instead of `npm.cmd`.

SQLite is created automatically at `data/deep-trivia.sqlite`. Preferences, recent questions and the latest 50 completed dives use browser storage; shared challenge records live in SQLite. The database and browser cookies are intentionally excluded from source control. Do not delete `data/` to reset preferences: use the in-game history control.

For a production-style local build:

```powershell
npm.cmd run build
npm.cmd run start
```

Stop the development server first; both commands use port 3000. The production server serves the built frontend and supports challenge routes directly.

## Verify

```powershell
npm.cmd run content:validate
npm.cmd run build
npm.cmd test
npx.cmd playwright install chromium
npm.cmd run test:e2e
```

Browser tests run their own server on port 3100 and use a separate database, `data/e2e.sqlite`. They use a 50 ms reading period and 3-second answer window to test complete flows quickly. The real local game uses 3 seconds of reading and 25 seconds of answering. `TEST_FAST_TIMERS=1` is rejected by the production server.

Unit/integration tests check scoring, matching, deadline boundaries, persistence, visibility and recovery. The restart test starts two separate production server processes on port 3111 and retrieves actual persisted results. Playwright checks two isolated players, mobile widths, keyboard submission, reduced motion, 57 Endless questions, lost responses, sharing fallback and unavailable storage/backend. Screenshots are written under `test-results/`.

See [ACCEPTANCE.md](ACCEPTANCE.md) for the evidence and verification limits.

GitHub Actions runs content validation, the production build, unit/integration tests and Chromium browser tests on pushes to `main` and pull requests. Check the [latest runs](https://github.com/axollis1-art/DeepTrivia/actions) before deploying changes.

## Send it to friends

### Connected Sites hosting

The cloud adapter in `cloud/` supports Sites hosting with a managed D1 database. It preserves the existing frontend and server-authoritative scores, pinned prompts, guest sessions, challenge privacy and absolute deadlines. Each run or challenge is stored as a versioned document; compare-and-swap updates resolve concurrent requests, and atomic guarded batches reserve the friend slot. Prompt snapshots are compressed losslessly to keep long Endless saves compact, and the adapter still reads older uncompressed saves. SQL migrations are generated from `db/schema.ts` and applied by the host before publication.

`npm.cmd run test:cloud` checks the adapter, concurrent operations and durable state. `npm.cmd run test:e2e:cloud` runs the browser suite against that backend locally. `npm.cmd run build` also emits the Worker at `dist/server/index.js` and public assets at `dist/client/`. Runtime values are managed by Sites; `.openai/hosting.json` contains only the site identity and logical storage binding. The original Node/SQLite local server remains available.

### Alternative: Render

**A localhost link works only on this computer.** A GitHub repository stores the source; GitHub Pages alone cannot run this application’s database and server.

The supplied [render.yaml](render.yaml) describes one straightforward hosting option: a Node web service with a persistent disk. Render persistent disks require a paid service; its free web service filesystem loses SQLite data on restart/redeploy. Check the current plan before buying. Official docs: [persistent disks](https://render.com/docs/disks), [free service limitations](https://render.com/docs/free), [Node deployment](https://render.com/docs/deploy-node-express-app).

1. Use the [DeepTrivia repository](https://github.com/axollis1-art/DeepTrivia) as the deployment source. It includes the lockfile, source, migration, fonts’ licence notices and docs. `node_modules`, `dist`, `data`, `.env` and test output are excluded by `.gitignore`. This repository is public, so its curated answer bank can be read on GitHub; change the repository visibility to private if you want to prevent that.
2. Open [Deploy Deep Trivia on Render](https://render.com/deploy?repo=https://github.com/axollis1-art/DeepTrivia), sign in, and create the Blueprint using `render.yaml`. Review the Starter web service and 1 GB persistent disk shown in the setup. This step requires your Render account and acceptance of its service charges. Alternatively, create a Render **web service** and enter the settings below manually.
3. Use **Node 24**, build command `npm ci --include=dev && npm run build`, and start command `npm run start`. Attach a disk at `/var/data` and set `DATABASE_PATH=/var/data/deep-trivia.sqlite`.
4. Render supplies `RENDER_EXTERNAL_URL` automatically, and the server uses it as the public origin, so the first deployment needs no manual URL entry. Leave `PUBLIC_ORIGIN` unset on Render unless using a custom domain; for that case, set it to the exact HTTPS origin and redeploy. `PORT` is supplied by the host. No API key or external scoring service is needed. See [Render's default environment variables](https://render.com/docs/environment-variables).
5. Open the public site, finish a timed dive, create a challenge, and copy its link. Open that invite in a different browser/device, finish it, and confirm both results. Reload the challenge link and revisit it after restarting the service. This last step is the public-deployment acceptance check and has **not** been run locally.

Other Node hosts or a VPS work if they provide HTTPS, one persistent filesystem and an always-running Node process. Use a single application instance with this SQLite adapter. For multiple instances/serverless hosting, add a shared managed database adapter first. A domain name is optional: the host’s HTTPS address is sufficient.

**For a separate Render deployment:** you need a hosting account/service, its persistent disk and a public two-device verification. The existing public Sites link is already available for playing with friends. A GitHub repository is useful for deployment and updates; it is not needed to play locally.

## Configuration, migrations and backup

`.env.example` contains placeholders/defaults only. Copy it to `.env` if changing local settings. The server loads `.env` automatically.

| Variable | Default | Production |
| --- | --- | --- |
| `PORT` | `3000` | Host’s assigned port |
| `PUBLIC_ORIGIN` | `http://localhost:3000` | Exact public HTTPS origin |
| `DATABASE_PATH` | `./data/deep-trivia.sqlite` | Path on a persistent disk |

Migrations run on startup and are idempotent. To migrate/seed explicitly:

```powershell
npm.cmd run db:migrate
npm.cmd run db:seed
```

Both commands preserve existing runs and challenges. Content snapshots are stored under hash-derived version IDs; each challenge also stores its exact prompt/answer snapshot, scoring points and timer rules. An existing challenge never reads the new bank to score an answer.

Back up the SQLite database using SQLite’s backup facility, or stop the application and copy the database plus any remaining `-wal`/`-shm` files together. Do not copy a live main database file alone. Keep backups private: they contain player answers, guest credentials and reports. Challenge links expire after 30 days; this release does not implement automatic database purging or a web content-admin interface.

## Editing content

There are **334 playable questions and 10,126 canonical answers across 18 topics**, including 216 new playable questions. Easy is the default; Mixed and Hard plus multi-topic choices are available in Dive options and Settings. See [CONTENT_REPORT.md](CONTENT_REPORT.md) for before/after counts, difficulty distribution, topic totals, references and the nine excluded content gaps. Open categories use finite broad lists; smaller closed categories include every answer in their stated scope.

The original content lives in `server/content-*.ts`. The expansion uses `server/content-everyday-*.ts`, with editorial review in `content-expansion.ts` and `content-review.ts`. Original `p()` records use `|` for answers and `^` for aliases; the new `q()` format separates explicit familiarity groups with `;`. Always supply stable IDs, difficulty, coverage notes, sources, review dates and scoring metadata. Rarity is editorial, independent of question difficulty, and has no measured popularity percentages. `gem-notes.ts` supplies original learning notes; new questions carry their own membership and qualification notes.

Bump a question version when changing released content. Mark incomplete categories `coverage: 'flagged'` and `reviewed: false`; they cannot enter new runs. Saved runs and challenges retain their snapshots, original rules and scoring versions. Do not overwrite those snapshots as part of a content update.

Run `npm.cmd run content:validate` after every edit. It checks duplicate questions and answer sets, aliases, metadata, tiers and coverage; it also requires at least 200 new playable questions. Structural validation does not prove factual truth: membership and coverage still require reference-based editorial review. `npx.cmd tsx scripts/review-expanded-sources.ts` checks expansion URLs and writes a source-triage report under `test-results`; automated blocking is recorded separately from successful downloads.

Missing-answer reports are stored in `missing_reports` (or `cloud_reports` on D1) with the authoritative prompt/version and submitted text. An unmatched answer can be reported while its timer continues, and the player can still try another answer. Reports do not change scores or deadlines. There is no public report-browsing endpoint.

## Game and API design

The server never supplies the full answer bank or future questions to the frontend. Only the current question is returned. Completed recap examples are revealed to that player; creator answers and scores remain hidden from an unfinished opponent. A third visitor can see the spoiler-free invitation but cannot retrieve participant answers.

Ownership uses a secure random HttpOnly, SameSite=Lax cookie (Secure in production). Writes require a per-session CSRF token and the configured same origin. Invite IDs have 192 bits of random entropy. Nicknames are limited to 24 characters, answers to 120, and all user text renders as React text. Requests are rate-limited; limits are abuse protection, not a play quota.

Each round has a server start, reading end and absolute deadline. A documented **250 ms transport tolerance** handles delivery jitter; the browser stops accepting typed answers at the displayed deadline. Reloading does not create a new window. Retries preserve the original request ID, and a committed round cannot be edited or scored twice. The first friend slot is claimed inside a SQLite `BEGIN IMMEDIATE` transaction.

Unaccepted answers now return feedback and leave the question open for unlimited revised attempts within that original window. They do not score, complete a round or extend the timer. Accepted answers end the question; timeouts score zero. Untimed practice also permits retries. Delivery retries reuse their request ID; a revised answer gets a new ID.

Matching checks normalised canonical names and curated aliases first; these score immediately. Otherwise it can suggest the unique closest accepted answer using up to one edit for names of four characters or fewer, two for five to seven, or three for longer names, with at least 60% spelling similarity. Insertions, deletions, substitutions and adjacent letter swaps count as edits. Equal nearest matches produce no suggestion. Suggestions require explicit confirmation, can be dismissed, and never pause or extend the deadline. The server recomputes the suggested answer when confirming and scores its pinned canonical tier only if confirmation arrives in time. The original typed spelling is retained in the outcome.

After a network failure, the UI locks the pending submission and offers Retry. If the server saved it, Retry returns that original result. If no request reached the server before expiry, the eventual result is an honest zero-score timeout. Timers continue in background tabs and menus. This is friendly competition, not strong anti-cheat protection.

| Module | Purpose |
| --- | --- |
| `src/shared/core.ts` | Pure matching, normalisation, prompt selection and deadlines |
| `server/game.ts` | Authoritative runs, snapshots, transactional rounds and challenges |
| `server/database.ts`, `migrations/001.sql` | Persistent SQLite schema and transaction adapter |
| `server/app.ts` | Input validation, sessions, CSRF, limits and JSON APIs |
| `src/main.tsx`, `src/Scene.tsx` | Accessible game screens and original ocean scenery |
| `tests/` | Unit, API, persistence, process restart and browser checks |

## Credits

See [CREDITS.md](CREDITS.md). No proprietary Krillion answer data or assets were used.
