# Codex build brief for unlimited ocean trivia with friend challenges

Prepared 7 October 2026. Reference site: https://krillion.io/

## Purpose and how to use this brief

Build a complete, playable browser game inspired by Krillion’s open-answer trivia and ocean descent. The owner wants unlimited free play and a link they can send to a friend so the friend can play and compare results. Deliver working gameplay, real answer validation, persistent friend challenges, responsive visuals, and a deployment-ready application. A visual mockup alone does not satisfy this request.

Submit this entire file to Codex with the instruction: “Implement the game described in this brief. Use the available project and hosting environment, complete the core features, and verify the acceptance criteria. Make routine implementation decisions yourself. Document any external service or deployment step that you cannot complete.”

The research section records what was observed on the reference. All subsequent sections define the proposed product; they are implementation decisions, not claims about Krillion’s internal code. Working name: **Deep Trivia**. Use original branding, artwork, copy, and question content.

## Reference analysis

### What was directly observed

The home page presents a daily dive of seven prompts with 25 seconds per answer. Its expanded instructions say the daily set is the same for everyone, rare answers earn more, every point represents 10 metres of descent, 700 points reaches the trench, and the daily dive permits one attempt.

The central mechanic is naming one valid example of a category. This is open-answer trivia rather than a multiple-choice quiz or a hidden-word puzzle. The challenge is deciding on an unusual answer quickly, while still satisfying the category.

The official Unlimited route is https://krillion.io/unlimited/classic. It displays “The Endless Dive” and “dive after dive”. Starting it produced a seven-prompt run. I tested a noodle-dish prompt with “ramen”; the result accepted “Ramen”, awarded the Plankton tier and 10 points, and increased depth by 100 metres. A Descend button advanced the experience. The test confirms this score and transition, but does not establish every tier or invalid-answer rule.

The scene is the main interface. The start screen has pale blue sky, blocky clouds, a sun, a small boat, a waterline, and a tiny animated marine character. Underwater scenes use progressively dark blue water, fish silhouettes, bubbles, a vertical depth ruler, environmental annotations, and a character travelling deeper. Typography is narrow and pixel-like; borders and sprites have a retro game appearance; cyan and pink accents sit against navy panels; subtle horizontal scanlines cover the scene.

During play, depth appears at the top left, score at the top right, and prompt progress between them. The question/input or result is central, with the next action near the bottom. The rarity reveal, score increase, and descent tie a trivia response to an immediate visual reward. The layout feels like a small arcade game rather than a conventional quiz website.

The navigation exposes Daily Dive, Unlimited, Archive, Themed Packs, My Krillion, Friends, Settings, and FAQ. Sound and wardrobe controls are visible. Desktop ad placements flank the game. These secondary features are not necessary for the requested independent version.

The Friends page at https://krillion.io/friends asks for Google sign-in to add friends and compare daily scores and answers, with a leaderboard restricted to the player and their friends. I did not sign in or inspect the authenticated experience.

The FAQ at https://krillion.io/faq explains that answer sets are assembled from relevant datasets, merged, and cleaned. Rarity can use familiarity data or LLM assistance plus manual review. A top “Krillion” answer is selected partly for how satisfying it is, rather than purely for maximum obscurity. The FAQ also acknowledges that valid answers can be missing. Its multiplayer section describes multiplayer and a party game as future plans; this is different from the existing daily-score Friends feature.

### Research limits

Inspection covered the public landing page, expanded instructions, one official Unlimited answer/result, public navigation, Friends sign-in page, and FAQ. It did not inspect paid content, private accounts, full end-of-run behaviour, typo handling, hint rules, the complete score taxonomy, or proprietary answer data. Search surfaced many similarly named independent websites with conflicting rules; this brief does not treat them as evidence about krillion.io.

Do not claim to reproduce the original rarity algorithm. The proposed scoring below is explicit and deterministic. Do not assume “unlimited” means infinitely many unique questions: unlimited access and replay are achievable with a finite expandable bank; infinite unique curated content is not.

### What to preserve in the new product

- Open prompts with many valid answers, so knowledge breadth and unusual recall matter.
- A short timer and one committed submission per prompt.
- Predictable feedback that connects points to visual descent.
- A coherent ocean scene that becomes darker as the run develops.
- A compact result worth sharing and a quick path to another game.

The biggest implementation dependency is content quality. An attractive ocean with a handful of hard-coded answers will feel broken. A trustworthy accepted-answer bank, aliases, clear category boundaries, and defensible rarity tiers must be built alongside the interface.

## Product scope and priorities

### Required first release

1. Free, unlimited seven-question runs with no account, daily gate, lives limit, ads, or paywall.
2. A continuous Endless mode, with no fixed terminal question number.
3. Friend challenges played asynchronously through a public invite link. Both players receive the same ordered prompts and scoring version and compare real persisted results.
4. An original ocean descent interface that works on desktop and phones.
5. A substantial original question bank with tested answer matching.
6. Settings, local history, meaningful error states, and a shareable result.
7. A functioning public deployment when the environment provides hosting; otherwise complete code and exact setup instructions, with the remaining deployment dependency identified.

### Later enhancements

Simultaneous live rooms, persistent friend accounts, global leaderboards, custom avatars, themed paid packs, daily streaks, and an administrative web interface can follow. Do not delay the first release to implement these. The first-release friend flow must genuinely work across separate devices; a button that only copies a homepage link is insufficient.

Interpret “play with a friend” as the ability to play the same challenge and compare asynchronously in the first release. Explain this in the interface. Do not label it live multiplayer. The shared application URL also lets the friend play their own unlimited games.

## Game rules

### Standard unlimited run

- Generate seven distinct prompts from the selected categories, balancing categories where possible.
- Show instructions before the first run, then allow dismissal on later runs.
- Reveal each prompt for a three-second reading period; input is disabled until the answering period starts. This reading period is a proposed rule.
- Give 25 seconds to enter one answer. Enter and the Submit button commit it.
- Lock the round after submission; invalid answers receive zero and end the round. Do not permit guess-spamming. This invalid-answer policy is a proposed rule.
- A blank timeout receives zero. Never auto-submit an unfinished draft at timeout.
- Show the submitted answer, accepted canonical form if applicable, score, tier, a short explanation, and new depth.
- Require an explicit Next prompt action after feedback, so reading speed does not affect a subsequent timer.
- End after seven questions, display a recap, and offer Play again and Challenge a friend.
- No minimum score is required to continue. A score of zero must still produce a complete, usable recap.

### Proposed scoring

Use fixed editorial tiers stored on each answer. The following labels are original working labels, and these values are product choices. Do not describe them as observed Krillion tiers or measured player popularity.

| Tier | Points | Meaning |
|---|---:|---|
| Familiar | 10 | A widely recognised answer |
| Uncommon | 30 | Less immediate but reasonably familiar |
| Rare | 60 | Specialist or less frequently encountered |
| Deep discovery | 85 | Particularly obscure but well evidenced |
| Hidden gem | 100 | One editorially selected satisfying answer per prompt |
| Invalid or timed out | 0 | No listed valid answer was committed in time |

For seven prompts, maximum score = 700. Depth in metres = total score × 10. The deepest scene is 7,000 metres. Assign exactly one Hidden gem per prompt, with an explanation of why it fits. Never give extra points for fast typing; equal totals draw in friend challenges.

Say “editorial rarity” in the explanation of scoring. Do not display invented percentages such as “only 1% of players chose this”. A future system may use real aggregate frequencies, but would need a published method, minimum sample size, and versioning so active challenges remain fair.

### Endless mode

Continue offering prompts until the player selects Finish dive. No cap on rounds or score. Show a session total, number answered, average points, and progress through the current seven-question stage. Every seven questions offer a checkpoint with Continue diving and Finish dive.

Each stage has a local depth from 0 to 7,000 metres, while lifetime session points and cumulative session depth keep increasing. Label stage depth and total descent clearly. Begin a fresh ocean stage after each checkpoint; do not stretch the original 7,000-metre scene into unreadable distances.

Persist the run between prompts. In casual solo play, allow pause between prompts; do not pause an already active 25-second timer by opening a menu or switching tabs. If storage is unavailable, explain that progress will only last for the current session.

### Optional relaxed setting

Offer untimed solo practice for accessibility and learning. Label it clearly and exclude it from timed personal records. First-release friend challenges always use the fixed timed rules, so both players have identical conditions.

## Answer validation and content

### Matching rules

Build a pure, independently testable matching function. Trim outer whitespace, normalise case and Unicode, collapse repeated spaces, and handle harmless punctuation consistently. Treat diacritics as equivalent for lookup, but display the correctly accented canonical form. Use curated aliases for abbreviations, regional spellings, alternate titles, articles, and singular/plural forms. Do not blindly remove a trailing “s” or articles across every category.

Exact canonical or alias matches are accepted. Ambiguous aliases mapping to multiple different answers must be flagged during content validation and resolved by the editor. Disable automatic fuzzy acceptance in the first release; a one-letter edit can change one valid entity into another. If adding suggestions later, never consume extra timer time unfairly or silently choose a higher-scoring answer.

Limit input to 120 characters. Render user text as text, never HTML. Return a clear distinction between invalid listed answer, timeout, and network failure. A network failure is not an incorrect answer.

An unlisted answer should receive: “We couldn’t match that to this question’s answer list.” Offer a Report missing answer action that stores the prompt/version and optional explanation. Do not use an LLM in the live scoring path to improvise acceptance or points. Keep outcomes deterministic and identical for friends.

### Initial content target

Ship at least 120 reviewed prompts spanning geography, nature, food, science, language, culture, film/books, and sport. Aim for at least 25 valid canonical answers per prompt and substantial variation in familiarity. Prefer closed, verifiable sets where coverage can be complete; a genuinely small closed category may contain fewer answers, but avoid relying on those for most of the bank.

Do not pad the bank with rewritten duplicates. Include clear qualifiers where geography, dates, national definitions, or ambiguous membership matter. Prefer stable factual categories. Every prompt needs sources, aliases, tier rationales, at least three example answers, and a short answer explanation. Keep an editable content file and validation script so the bank can grow without changing gameplay code.

Use independently created prompts and reputable sources with suitable reuse terms. Do not copy Krillion’s proprietary bank, sprites, sounds, logos, or authored descriptions. If a source imposes attribution, preserve it in the content credits. Keep unknown or unreviewed content out of competitive challenges.

Suggested record shape:

```ts
type Tier = 'familiar' | 'uncommon' | 'rare' | 'deep' | 'gem';
interface PromptRecord {
  id: string;
  version: number;
  category: string;
  text: string;
  qualificationNotes: string;
  reviewed: boolean;
  sources: { title: string; url: string; checkedOn: string }[];
  answers: {
    id: string;
    canonical: string;
    aliases: string[];
    tier: Tier;
    explanation: string;
    rarityRationale: string;
  }[];
}
```

These are original prompt directions, not extracted game data: name a present-day sovereign country that borders the Mediterranean; name a chemical element whose symbol has two letters; name a recognised species of penguin. Codex must verify boundaries, accepted names, and completeness before adding them. Do not manufacture rarity evidence.

### Repeat handling

Choose prompts without replacement within a run. Keep a local recently seen list and exhaust the eligible bank before recycling in casual play where possible. If a category filter leaves fewer than seven prompts, ask the player to widen the filter or offer a clearly labelled shorter practice run; standard friend challenges require seven.

When the bank cycles, say that questions may repeat. Do not promise endless unique questions. Friend challenges may reuse a previously seen prompt, because their essential requirement is an immutable shared set; show prior exposure as a casual fairness limitation rather than pretending to have an examination-grade system.

## Friend challenge flow

### Required behaviour

1. The player chooses Challenge a friend from the home page or a finished seven-question run.
2. Before-play creation produces a new seven-prompt challenge. After-play creation pins the exact completed run and associates the creator’s verified result.
3. Ask for a display nickname, with a guest default. No email, social sign-in, or account is required.
4. Store the ordered prompt versions, scoring version, timer rules, challenge identifier, creation time, and expiry on the server. Return a hard-to-guess invite URL.
5. Offer native device sharing when supported, Copy link otherwise, and a selectable text fallback if clipboard permission fails.
6. The friend opens the link in a different browser, sees a spoiler-free landing page with the creator’s nickname, seven questions, the rules, and Play challenge.
7. The friend plays the same ordered questions at their own pace. Never send the answer bank or creator’s answer text before completion.
8. Save the friend’s result server-side and show the comparison: each player’s total, depth, per-round score, tier, and winner/draw.
9. Reveal the creator’s actual answers only after the friend finishes. Before then show completion status without spoilers.
10. The creator can revisit the original challenge link and see the friend’s result. Polling or a Refresh results button is sufficient; realtime sockets are optional.
11. Offer Rematch, generating a fresh seven-question challenge, and Play unlimited.

The first release targets two players. The creator has one slot; the first friend to claim the invite has the second. Claim it atomically to prevent two guests occupying it. After it is claimed, another guest sees a clear “This challenge already has two players” page and can start a separate game. The same guest session can return and resume. Links are bearer invitations, so anyone receiving one can claim the guest slot; explain this near sharing.

### Fairness and persistence

- Store anonymous ownership/session credentials in an HttpOnly session cookie where supported. A challenge ID identifies the invitation, but is not an owner credential.
- Lock one completed attempt per player for the comparison. Replays can be labelled practice and must not overwrite the submitted result.
- Pin the answer and scoring versions for the challenge lifetime. Content edits must not change a friend’s outcome mid-challenge.
- Keep the challenge available for 30 days and show its expiry date. Expired or unknown links return a friendly page and a new-game action.
- Give the second player no score or answer hints from the first during play. No cross-player answer browsing before completion.
- Persist accepted submissions transactionally; idempotent retries must not duplicate points or advance twice.
- Server-side matching and scoring are authoritative in challenges. Never trust points, tiers, correctness, timestamps, or a claimed canonical answer supplied by the client.
- Each timed challenge round must have a server-recorded start and deadline. Return only the current prompt, do not preload future prompts. A small documented transport tolerance may handle network jitter; it must not grant a new answer window on reload.
- Submission retries reuse the same request ID. Keep the original receive timestamp and do not accept a revised answer after the deadline. Network disruption must produce a pending/retry state or an honest timeout, not a silently fabricated score.
- On reconnect, return authoritative round state, remaining time, and committed result. If the deadline passed, record a zero-score timeout and let the player continue.

Keep this a friendly competition. These measures avoid obvious tampering; they cannot prevent outside research, repeated identities, or a player who has seen a prompt before. Do not claim strong anti-cheat guarantees.

## Screens and interaction design

### Home

Use a full-viewport ocean scene with an original wordmark, a short one-sentence rule explanation, and obvious Play unlimited, Endless dive, and Challenge a friend actions. Keep Settings and How to play secondary. Avoid marketing sections that push the game below the fold.

### Active round

Depth on the left, question count in the centre, score on the right. A large readable prompt sits above the text input. Show a numeric timer and a shrinking bar. Submit must remain reachable when the mobile keyboard opens. No autocomplete that exposes the accepted answers. Focus the input after the reading period on desktop; on mobile, preserve browser keyboard rules and offer a tap-to-focus action if needed.

### Round result

Show the canonical answer or unrecognised submitted text, points, tier, explanation, and depth gained. Animate the character and camera descending in proportion to score. Keep the next button stable and reachable. Offer a short result explanation; put the full answer examples in the final recap so they cannot distract from the next round.

### Final recap

Show total points out of 700, depth, seven per-round indicators, and a compact table of prompt, submitted answer, outcome, tier, and points. Include selected valid alternatives and factual explanations as learning material. Primary actions: Play again, Challenge a friend, Share result. A small graph can show cumulative depth across seven rounds; its data must match the recap.

### Challenge landing and comparison

Landing: creator name, format, expiry, privacy explanation, nickname field, and Play challenge. Never put future prompt text or answers into page metadata. Comparison: both players’ totals and corresponding rounds, a clear draw/winner message, and rematch. Indicate “Waiting for your friend” honestly when only one result exists.

### Settings and history

Sound, reduced motion, relaxed solo mode, category filter, How to play, content credits, and local history. Save preferences and casual history locally. Explain that local history follows this browser, while challenge results live on the shared link. Provide an explicit way to clear local history without deleting shared challenge records.

## Visual specification

Create a recognisable retro ocean atmosphere with original assets. Use layered sky/water, blocky clouds and boat, subtle bubbles, occasional fish, an original diver or marine character, and deeper silhouettes. Use CSS/SVG/canvas or locally created sprites as appropriate; keep gameplay controls as accessible HTML. The scene is decoration and feedback, not a reason to rasterise text or inputs.

Suggested starting colours, inferred from visual inspection rather than extracted from source:

| Role | Proposed colour |
|---|---|
| Sky | `#ADD7E8` |
| Upper ocean | `#1B6088` |
| Deep water | `#071521` |
| Panel | `#101D33` |
| Cyan accent | `#59E1F4` |
| Pink accent | `#F15C91` |
| Main text | `#EFF8FC` |

Use a licensed pixel font sparingly for branding, numerical counters, and buttons. Use a highly readable font for prompts, explanations, and tables. Borders should feel crisp and geometric. Scanlines must be subtle, optional, and never reduce text contrast. Make depth movement a translation of layered scenery rather than a full-page browser scroll.

Map 0–7,000 metres onto a sequence of surface, twilight, midnight, abyss, and trench scenes. Treat these as stylised scene bands; do not claim the game’s score scale is a scientifically precise ocean-zone model. Environmental facts must be sourced or omitted. Fish and bubbles should become sparser at depth, and colour/lighting should signal progression.

Desktop: keep the central play area roughly 640–760 pixels wide, with scenery filling the rest. Phone: use the available width with 16–20 pixel side padding; simplify the ruler and decoration. Support at least 360-pixel portrait width and phone landscape. No horizontal overflow. Account for mobile safe areas and dynamic viewport height.

Respect reduced-motion preferences. Provide a still-scene fallback with immediate numerical depth updates. Sound begins only after a user gesture, defaults to off, and has a persistent visible toggle. Use original or appropriately licensed sounds. Do not make animation completion a dependency for saving an answer.

## Implementation requirements

### Architecture

Use TypeScript with a component-based frontend, a persistent database, and server-side API routes for friend challenges. Use the existing project conventions and supported host rather than forcing an unnecessary framework migration. A standalone build may use React with either a full-stack framework or Vite plus a small server. The exact database provider is an environment choice, but separate-device persistence is mandatory.

Do not ship a static-only application as complete if challenge comparisons require a backend. Never use localStorage as the shared database. Do not put secret credentials in frontend bundles. If using a managed database, enforce access through server routes or strict equivalent access policies. Provide schema migrations and seed tooling.

Separate modules for content, answer matching, prompt selection, score calculation, timers, run state, challenge persistence, and visual scene rendering. Model a run as explicit states: idle, reading, answering, submitting, result, complete, and recoverable error. Round transitions should be predictable, and a double click must not create a second submission.

Use an absolute deadline for active timers instead of decrementing a counter that drifts in background tabs. Persist solo state between rounds, and reconcile challenge state with the server. Keep the rendering loop independent of game rules.

### Minimum persistent records

| Record | Required contents |
|---|---|
| Content version | Version ID and immutable prompt/answer records or equivalent snapshot |
| Challenge | Random ID, ordered prompt versions, scoring version, rules, creator, created/expiry timestamps |
| Participant | Challenge, role, guest session identity, nickname, join/completion timestamps |
| Round attempt | Participant, round index, server start/deadline, raw input, canonical result, tier, points, status, submission ID |
| Missing-answer report | Prompt/version, submitted text, optional explanation, created timestamp |

Persist totals by deriving them from accepted round records or using a transactional aggregate; never let independent counters diverge. Index lookups used for invite retrieval, participant ownership, and round state. Version migrations must preserve active challenge snapshots.

### API behaviour

Equivalent endpoints should create a challenge, retrieve its spoiler-free summary, claim a participant slot, begin the next round, submit an answer, retrieve round/run state, retrieve permitted results, and create a rematch. Validate all input, apply reasonable rate limits, use secure random invite identifiers, and keep error messages useful without exposing secrets.

Challenge APIs return only what the requesting player is entitled to see. Avoid putting hidden answer sets in public static JSON or exposing them through an unrestricted content endpoint. Same-origin cookie requests need appropriate cross-site request protection. Logs should not include session credentials.

Keep provider-specific code in an adapter where practical. Use the host’s supported persistence facilities if available. Do not add sockets or an LLM service just to satisfy asynchronous friend play.

### Deployment and public sharing

Use an HTTPS public URL with stable challenge routes and deep-link handling. Generate invite links from the configured public origin, not localhost or a development preview address. The link must work when opened directly in a fresh browser and after a page reload.

Publish through the available authorised hosting workflow. Where deployment needs a missing credential, account, or service configuration, complete the application and tests first, then identify the exact missing item. A temporary local preview is not proof that a friend can access the game.

Include installation, development, content seeding, migration, test, and production instructions. Supply a sample environment-variable file with placeholder values only. Keep real secrets out of the repository.

## Accessibility and reliability

- Keyboard operation for every control, obvious focus styles, semantic labels, and a logical tab order.
- Minimum 44-pixel touch targets and readable mobile text.
- Tier names/icons alongside colours; colour alone must not convey outcome.
- Screen-reader announcement of round start, submission outcome, and selected timer thresholds; avoid announcements every second.
- Reduced motion, muted sound, and untimed solo practice.
- Clear loading, saving, offline, invalid-link, expired-link, unavailable-service, and insufficient-content states.
- Reload during a timed challenge cannot reset the deadline or duplicate a score.
- A slow API cannot lose a committed answer without explanation; submitting state locks input and reconciles the eventual outcome.
- Nicknames are short, escaped text. Collect no email or unnecessary profile data.
- Keep the game responsive and avoid unnecessary heavy scene dependencies. Optimise animation and assets for mid-range phones.

## Acceptance criteria and meaningful tests

The application is ready when all of these are demonstrated:

1. A new visitor can complete seven prompts and immediately start another free run.
2. A test session can complete at least 50 consecutive Endless prompts and continue, with no lives or quota interruption. Use accelerated test timers rather than making a human wait through every timer.
3. Scores and depth agree in active play, recap, and sharing; a seven-question perfect run is exactly 700 points and 7,000 metres.
4. Case, whitespace, diacritics, and curated aliases accept the intended answer. Invalid and ambiguous cases are covered.
5. Blank timeout, just-before-deadline submit, late submit, double click, repeated network request, reload, and reconnect produce one authoritative round outcome.
6. The content validator confirms unique prompt IDs, valid sources/metadata, no unresolved alias collisions, legal point tiers, and exactly one Hidden gem per prompt. Meet the reviewed content target; report any shortfall honestly.
7. Two isolated browser sessions can open the same invite, play identical prompt versions, save separate results, and compare them. A new process/server instance can retrieve those results after restart.
8. Neither a fresh guest nor the unfinished opponent can retrieve hidden answer data or the creator’s actual answers before completion. Test the API responses, not only the visible UI.
9. Updating the general content bank does not change an existing challenge’s prompts or scoring.
10. A third guest, unknown link, expired challenge, storage failure, and unavailable backend each receive a usable explanation and recovery action.
11. Copy/share fallback works, and a result message contains no answer spoilers by default.
12. The complete run is usable by keyboard and on a 360-pixel phone viewport with the software keyboard considered; no controls are obscured or horizontally clipped. Reduced motion works.
13. The deployed URL loads in a separate browser, and challenge deep links survive refresh. If deployment is blocked, do not claim this criterion passed.

Use unit tests for matching, tier scoring, selection, and state/deadline behaviour; integration tests for challenge persistence and visibility; and a small browser end-to-end flow with two isolated contexts. Verify the visual interface at desktop and mobile sizes. Avoid tests that merely duplicate constants without checking a meaningful behaviour.

## Build sequence and final handoff

First establish the content schema, curated sample bank, matching/scoring functions, and state machine. Build a complete seven-question vertical slice, then expand the reviewed bank and add repeat selection. Add Endless persistence. Implement the server-backed friend challenge and test two sessions. Apply the ocean visuals and accessibility behaviour around the working core. Finish error states, deployment, and the acceptance checks.

The Codex handoff should contain the working source, original assets and credits, versioned question bank, migrations/seed script, tests, setup documentation, and a concise report of passed checks and remaining blockers. If hosting was completed, include the playable public URL and demonstrate a real challenge link. Do not invent a successful deployment or comparison result.

The owner’s desired outcome is simple: open the game, play as much as they like, send a friend a link, and have both people enjoy a fair, comparable challenge. Prioritise that complete loop throughout implementation.

## Research sources

- https://krillion.io/ — public home scene and expanded rules, inspected in the browser on 7 October 2026.
- https://krillion.io/unlimited/classic — public Unlimited start, prompt, accepted answer, and round result, inspected on 7 October 2026.
- https://krillion.io/friends — public sign-in explanation, inspected on 7 October 2026; authenticated features not inspected.
- https://krillion.io/faq — primary-source description of answer curation, rarity, and planned multiplayer, retrieved on 7 October 2026.

Screens and rules may change after this inspection. Proposed timing, invalid-answer behaviour, scoring labels, challenge architecture, and content targets are explicitly the requirements of this independent build.
