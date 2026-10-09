# Content expansion — 9 October 2026

Counts refer to playable questions and canonical accepted answers. Alternate spellings, abbreviations and singular/plural aliases are additional matching forms, not separate scoring entries. An answer can appear in several different questions, so these are question–answer memberships, not globally unique entities.

| Measure | Before | After |
| --- | ---: | ---: |
| Playable questions | 120 | 334 |
| Canonical answers | 4,789 | 10,126 |
| Topics | 8 | 18 |

223 new question records were authored: **216 are playable**, seven remain excluded drafts. Fourteen original questions received additional canonical answers, alongside further aliases. Two original questions were excluded for incomplete coverage. Their IDs and content remain available to existing saved snapshots.

**Difficulty:** Easy 205 (61.4%), Medium 100 (29.9%), Hard 29 (8.7%). Difficulty describes how familiar the question category is. Editorial answer rarity separately awards 10, 30, 60, 85 or 100 points. These are judgements of expected familiarity to a general UK audience, never measured response frequencies.

| Topic | Questions | Answers | Easy | Medium | Hard |
| --- | ---: | ---: | ---: | ---: | ---: |
| Animals | 16 | 377 | 12 | 2 | 2 |
| Books | 13 | 327 | 8 | 4 | 1 |
| Culture | 17 | 705 | 7 | 6 | 4 |
| Films | 17 | 473 | 12 | 5 | 0 |
| Food | 39 | 1,579 | 28 | 10 | 1 |
| General knowledge | 13 | 297 | 10 | 3 | 0 |
| Geography | 38 | 1,323 | 21 | 17 | 0 |
| Hobbies | 13 | 222 | 12 | 1 | 0 |
| Household | 10 | 405 | 10 | 0 | 0 |
| Language | 16 | 526 | 8 | 5 | 3 |
| Music | 20 | 436 | 13 | 4 | 3 |
| Nature | 23 | 875 | 8 | 11 | 4 |
| Pets | 9 | 275 | 7 | 2 | 0 |
| Science | 33 | 894 | 12 | 13 | 8 |
| Sport | 23 | 542 | 10 | 12 | 1 |
| TV | 10 | 84 | 9 | 1 | 0 |
| Technology | 12 | 412 | 8 | 2 | 2 |
| Transport | 12 | 374 | 10 | 2 | 0 |
| **Total** | **334** | **10,126** | **205** | **100** | **29** |

191 playable questions have at least 30 answers. The other 143 are explicitly scoped closed sets: for example, four seasons, eight ABO/Rh blood groups, named band members, film series and board-game pieces. Small sets contain the full scoped membership; umbrella terms and relevant alternate names are curated where needed. Open categories remain finite broad lists, rather than exhaustive inventories of every possible valid example. Missing-answer reports preserve the question version for review.

## Controls and compatibility

Easy is the default. Mixed includes all three difficulties; Hard filters strictly to Hard. All topics and multiple topic choices apply to solo, Endless and newly created challenges. Every topic has at least seven Easy questions and can support a standalone Easy run. Some Hard selections have fewer than seven questions; the game asks players to widen their topics or change difficulty. The table makes those gaps explicit.

Selection uses unseen questions first, balances topic counts wherever the remaining pool supports it, and never duplicates a question within a seven-question run. Mixed selection favours four Easy, two Medium and one Hard question when compatible with topic balance and unseen availability. It falls back within the selected topics and allowed difficulty pool when that combination is unavailable. Once the eligible pool is exhausted, recycling is disclosed.

New challenges pin ordered question/answer snapshots, topics, difficulty, points and `editorial-v2` scoring metadata. Claims use those snapshots even after a bank update. Earlier cloud documents and genuine pre-expansion SQLite saves continue to load; absent historical metadata is labelled Mixed / `editorial-v1`. The migration does not rewrite their content or outcomes.

## References and review

Each record includes references, review date and category boundaries. Membership checks use official catalogues and rules where available, supplemented by established reference works and dictionaries. Examples include [Royal Kennel Club breeds](https://www.royalkennelclub.com/search/breeds-a-to-z/), [Cat Fanciers’ Association](https://cfa.org/breeds/), [Disney Animation’s film catalogue](https://www.disneyanimation.com/films/), [NASA’s atmospheric layers](https://science.nasa.gov/earth/earth-atmosphere/earths-atmosphere-a-multi-layered-cake/), [NHS blood groups](https://www.nhs.uk/tests-and-treatments/blood-groups/), [official UK city status](https://www.gov.uk/government/publications/list-of-cities/list-of-cities-html), [MCC laws](https://www.lords.org/mcc/the-laws-of-cricket), [Hasbro instructions](https://instructions.hasbro.com/en-us/instruction/Clue-Game-Classic) and [MDN HTTP methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods).

Review corrected invalid city labels, duplicate alternative names, missing familiar film/book titles, several moved reference URLs and an ambiguous blood-group punctuation match. Aliases never create an extra score entry for the same accepted answer. New wording and exact answer-set fingerprints are checked against the entire bank; overlapping categories such as a particular film studio and one of its franchises are deliberately distinct questions, not paraphrases of the same set.

The source URL audit checked 140 distinct expansion references: 91 returned readable pages; the other 49 were blocked, rate-limited, unavailable or unreadable. The sole remaining 404 is the excluded goldfish draft’s old reference. The [audit record](docs/content-source-audit.json) preserves statuses and affected question IDs. This is a triage aid. A successful download or visible answer name does not independently prove membership or complete coverage; blocked/dynamic sites can hide valid records. The implementation’s editorial review is not an independent expert audit of all 10,126 memberships. Open lists and source conventions may still need correction through reports. See [CREDITS.md](CREDITS.md).

## Excluded content gaps

| Question ID | Remaining issue |
| --- | --- |
| `citrus` | Original open list has fewer than 30 answers. |
| `romance-languages` | Original open list has fewer than 30 answers; regional-language boundaries require review. |
| `goldfish-varieties` | Variety names differ between registries; coverage incomplete. |
| `guinea-pig-breeds` | Breed and coat standards differ; coverage incomplete. |
| `origami-bases` | Traditional bases are not a fixed closed set. |
| `water-cycle-processes` | Different diagrams include different processes; needs a fixed scope. |
| `nautical-directions` | Open vocabulary needs more answers. |
| `rail-gauges` | Historic local gauges missing. |
| `pooh-animals` | Real and imagined animals need a full story index and clearer boundary. |

These nine records are never selected for new games. Existing challenges that contain them remain playable with their original snapshots.

## Repeatable validation

`npm.cmd run content:validate` prints the current counts, gaps and validation errors, and fails if fewer than 200 new playable questions remain. It checks duplicate IDs/text/answer sets, alias collisions, answer metadata, scoring tiers, exactly one gem, source metadata and coverage gates. Canonical and alias matching is exercised across the whole bank.

The unit and integration suites test filters, topic balance, fresh-before-repeat selection, aliases, blood-group punctuation, SQLite migration, old cloud documents and frozen challenges. Browser tests additionally exercise default settings, multi-topic persistence, an eight-topic reload, two successive distinct runs, Hard friend challenges, insufficient-content recovery, the existing timed suggestion/retry flow, two-player comparison and 57 Endless rounds. See [ACCEPTANCE.md](ACCEPTANCE.md) for the completed run results.
