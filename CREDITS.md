# Credits and content review

Deep Trivia’s prompt wording, matching aliases, score assignments, learning notes, ocean artwork and synthesised sound are original work for this project. The game is inspired by the mechanic described in the owner’s brief; no Krillion assets, questions, authored explanations or branding were copied.

The boat, clouds, diver, fish, reef, depth ruler and favicon are code-native SVG/CSS artwork. Sounds are short Web Audio tones and need no external audio files. Scene zones are stylised, with no unsourced environmental trivia.

## Fonts

- **Barlow Condensed**, Copyright 2017 The Barlow Project Authors. [Project](https://github.com/jpt/barlow). SIL Open Font License 1.1, supplied in [public/licenses/barlow-condensed.txt](public/licenses/barlow-condensed.txt).
- **Silkscreen**, Copyright 2001 The Silkscreen Project Authors. [Project](https://github.com/googlefonts/silkscreen). SIL Open Font License 1.1, supplied in [public/licenses/silkscreen.txt](public/licenses/silkscreen.txt).

Fonts are locally bundled through Fontsource, so gameplay does not depend on a third-party font request. Body text uses system fonts.

## Factual references

Each prompt includes its factual reference, qualifier and review date in `server/content*.ts`. These references inform membership and boundaries; they do not provide rarity statistics, and no descriptive articles, recipes, photographs or illustrations are redistributed. Basic entity names and membership facts are independently assembled into original trivia lists.

- Geography: United Nations membership and M49, the European Union, NATO, national government resources, legislation and encyclopaedic capital/island references.
- Science: Royal Society of Chemistry/IUPAC conventions, NASA, IAU, BIPM, WMO, Nobel Prize records, PubChem, NCBI, OpenStax and mineral references.
- Nature: RSPB, RHS, Mammal Society, Shark Trust, Whale and Dolphin Conservation, Butterfly Conservation, Plantlife, BirdLife, IUCN Crocodile Specialist Group, Reptile Database, AlgaeBase and Primate Info Net.
- Food: culinary factual references from Good Food, King Arthur Baking, Kew, FAO, Barilla, UC Riverside citrus resources, Le Cordon Bleu and cheese references. Recipe instructions were not copied.
- Language: Cambridge grammar/dictionary references, British Council, NATO, Poetry Foundation and encyclopaedic language-family references.
- Culture: Tate, Royal Ballet and Opera, museum collections, theatre catalogues and art reference works.
- Film/books: official author/studio/Academy references, RSC, Jane Austen’s House, BFI, Dickens Museum and bibliographic resources.
- Sport: official NFL/NBA/MLB/NHL, Formula One, Wimbledon, FA, FIFA, FIDE, World Athletics and Olympic references.

## What “reviewed” means here

The implementation agent curated and reviewed question boundaries, factual membership, aliases and editorial tier assignments during this build. Automated validation additionally checks every canonical/alias match, legal tiers, exactly one gem and source metadata. This is not an independent expert audit of all 4,789 facts, and structural tests cannot certify factual completeness.

Several open categories deliberately use non-exhaustive accepted-answer lists and say so in their qualifiers. Some common-name and taxonomic conventions differ between sources. Reports let these be corrected in a later version while preserving active challenge snapshots. Source links can move; some sites reject automated HTTP clients. These limitations must remain visible in future handoffs rather than treating a green schema validator as proof of factual accuracy.
