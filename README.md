# Deep Trivia

A playable British-English ocean trivia game: unlimited seven-question dives, continuous Endless mode, untimed solo practice, and asynchronous two-person challenges. React/TypeScript frontend, Express APIs, and persistent SQLite. All scoring happens on the server. No accounts, ads, paywall, lives or play quotas.

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

**A localhost link works only on this computer.** A GitHub repository stores the source; GitHub Pages alone cannot run this application’s database and server.

The supplied [render.yaml](render.yaml) describes one straightforward hosting option: a Node web service with a persistent disk. Render persistent disks require a paid service; its free web service filesystem loses SQLite data on restart/redeploy. Check the current plan before buying. Official docs: [persistent disks](https://render.com/docs/disks), [free service limitations](https://render.com/docs/free), [Node deployment](https://render.com/docs/deploy-node-express-app).

1. Use the [DeepTrivia repository](https://github.com/axollis1-art/DeepTrivia) as the deployment source. It includes the lockfile, source, migration, fonts’ licence notices and docs. `node_modules`, `dist`, `data`, `.env` and test output are excluded by `.gitignore`. This repository is public, so its curated answer bank can be read on GitHub; change the repository visibility to private if you want to prevent that.
2. Create a Render **web service**, connect that repository, and choose a plan supporting a persistent disk. You can use `render.yaml` as a Blueprint or enter the settings below manually. This step requires your Render account and acceptance of its service charges.
3. Use **Node 24**, build command `npm ci --include=dev && npm run build`, and start command `npm run start`. Attach a disk at `/var/data` and set `DATABASE_PATH=/var/data/deep-trivia.sqlite`.
4. Once Render assigns the HTTPS address, set `PUBLIC_ORIGIN` to its exact origin, for example `https://deep-trivia-example.onrender.com`, and redeploy. `PORT` is supplied by the host. No API key or external scoring service is needed.
5. Open the public site, finish a timed dive, create a challenge, and copy its link. Open that invite in a different browser/device, finish it, and confirm both results. Reload the challenge link and revisit it after restarting the service. This last step is the public-deployment acceptance check and has **not** been run locally.

Other Node hosts or a VPS work if they provide HTTPS, one persistent filesystem and an always-running Node process. Use a single application instance with this SQLite adapter. For multiple instances/serverless hosting, add a shared managed database adapter first. A domain name is optional: the host’s HTTPS address is sufficient.

**What remains for public sharing:** your hosting account/service, its persistent disk, the public origin configuration and a public two-device verification. A GitHub repository is useful for deployment and updates; it is not needed to play locally.

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

There are 120 original prompts with 4,789 accepted canonical answers; 99 prompts have at least 25 answers. Smaller sets are closed categories such as chess pieces, cloud genera and Austen novels. Sources and qualifiers are stored with each record. These are finite curated lists, not a promise to accept every defensible answer in an open category.

Start with `server/content.ts` and the eight `server/content-*.ts` files. Each `p()` record supplies an ID, category, question, boundaries, factual reference URL, answer string and one gem. `|` separates canonical answers; `^` introduces curated aliases. Ordering assigns four broad editorial familiarity bands; the named gem receives 100 points. There is no popularity percentage or live LLM scoring.

`server/gem-notes.ts` supplies a factual learning note for every gem. Answer records also contain membership explanations, tier rationales and source metadata. `server/content-builder.ts` assembles the editable authoring format into the typed record schema from the brief. Its optional final argument accepts `{version: 2, reviewed: false}`; bump versions when editing a released prompt. Set `reviewed: false` for unfinished content to exclude it from play.

Run `npm.cmd run content:validate` after every edit. `npx.cmd tsx scripts/validate-content.ts --strict-target` also fails if the reviewed bank falls below 120 prompts. Validation checks structural consistency and matching collisions, **not the truth of every fact**. Editorial review remains necessary. `npx.cmd tsx scripts/audit-sources.ts` optionally checks source URLs; some references block automated clients or move over time.

Missing-answer reports are stored in `missing_reports` with the authoritative prompt/version and submitted text. They do not change a scored attempt. There is no public report-browsing endpoint.

## Game and API design

The server never supplies the full answer bank or future questions to the frontend. Only the current question is returned. Completed recap examples are revealed to that player; creator answers and scores remain hidden from an unfinished opponent. A third visitor can see the spoiler-free invitation but cannot retrieve participant answers.

Ownership uses a secure random HttpOnly, SameSite=Lax cookie (Secure in production). Writes require a per-session CSRF token and the configured same origin. Invite IDs have 192 bits of random entropy. Nicknames are limited to 24 characters, answers to 120, and all user text renders as React text. Requests are rate-limited; limits are abuse protection, not a play quota.

Each round has a server start, reading end and absolute deadline. A documented **250 ms transport tolerance** handles delivery jitter; the browser stops accepting typed answers at the displayed deadline. Reloading does not create a new window. Retries preserve the original request ID, and a committed round cannot be edited or scored twice. The first friend slot is claimed inside a SQLite `BEGIN IMMEDIATE` transaction.

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

See [CREDITS.md](CREDITS.md). No proprietary Krillion answer data or assets were used. No public deployment has been claimed or performed.
