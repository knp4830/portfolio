# Project intake

How to add a project to the notebook's Projects spread without writing the copy by hand.

**Use it like this.** Open a Claude session **inside the project's own repo** (so it can read the
code), paste the block below, and replace the two placeholders at the top. Paste whatever comes
back into this repo's session; it gets checked against `src/lib/content/schema.ts`, trimmed to the
page, and saved as `content/projects/<slug>.mdx`.

Why ask the other repo instead of writing it here: the card has to be true. The project's own
session can read its commits, tests and config, so the numbers and the stack are the real ones.

One thing it cannot know: how the card reads next to the others. Expect to trim.

---

```markdown
I need an entry for my portfolio site. Read this project's actual code before answering —
every claim has to be true of this repo. No marketing language, no invented numbers. If you
cannot verify something, say so instead of guessing.

PROJECT: {{what to cover — the whole repo, or one app inside it}}
STATUS: {{shipped / in development / prototype — your words, I'll check them against the code}}

## The site this is for

A portfolio built as a naturalist's field notebook: an open notebook on a dark desk, turned
page by page. Twelve pages — an opening with contents, a timeline of my career as software
releases (v0.1 to v1.1), skills, projects, contact, colophon. Six projects fit on the projects
spread; each gets a card on the left page and a full detail page on the right.

Two readers: a recruiter skimming for 30 seconds (the card), and an engineer or hiring manager
who reads on (the detail page). Plain, concrete sentences, the way you'd explain it to an
engineer who has never seen the repo. Straight apostrophes, not curly. Sentence case.
It is fine to say a project is unfinished — be accurate rather than impressive.

## 1. The entry

Return one fenced block, exactly this shape, filled in (it is YAML frontmatter, so keep the
quoting and indentation):

```
---
order: 5
title: ""
oneLiner: ""
cardLine: ""
stack: []
dates: ""
status: ""
details:
  - label: "Problem"
    text: ""
  - label: "Role"
    text: ""
  - label: "Key decisions"
    text: ""
  - label: "Rejected idea"
    text: ""
  - label: "Result"
    text: ""
lineage:
  - name: ""
    version: "v0.1"
    note: ""
    date: ""
---
```

Field by field:

- **title** — the display name, 20 characters or fewer.
- **cardLine** — one sentence, **110 characters or fewer** (hard limit; longer fails the build).
  What it does, for someone who will read nothing else.
- **oneLiner** — the same thing with room to breathe, up to 140 characters.
- **stack** — 6 to 9 short names, most important first, e.g. "TypeScript", "Postgres". Tools
  only. No versions unless the version is the point (say "Next.js 15" only if it matters).
- **dates** — from real commit dates: "Sep 2026" or "Sep 2026 - present".
- **status** — 40 characters or fewer. "In development", "Shipped (team of 5)",
  "Working build, not released".
- **details** — Problem, Role, Key decisions and Result are required and must keep those exact
  labels. "Rejected idea" is optional but good. You may add at most one more of your own
  (e.g. "Pipeline", "Signature detail") if the project really has one.
    - *Problem* — what I wanted that nothing else gave me. 1-3 sentences. Not "users struggle
      with X": the actual itch.
    - *Role* — what I did, 1 sentence. Say if it was solo or a team, and the team's size.
    - *Key decisions* — the two or three real engineering choices and **why**, written so a
      non-specialist can follow. This is the field people actually read. Name the tradeoff, not
      the technology list.
    - *Rejected idea* — something I deliberately left out, and why.
    - *Result* — what works today, and how I know it is correct: what's verified, against what,
      and what the thing actually produces. Numbers only if you can point at them in the repo
      (tests, commits, benchmarks, data sizes).
  Keep all the detail text together **under about 900 characters** — it has to fit one page.
- **lineage** — only if an earlier project of mine led to this one. Otherwise delete the whole
  key. Each step: name, short note, date.
- **order** — leave as given; I set the position in the spread.

## 2. A picture

The card has an empty image slot, and I'd rather show the real thing than a mockup.

- Pick the **one screen** that shows what the project is in a single glance — the main view with
  real (not placeholder) data in it, not a login screen or an empty state.
- Capture it at **1600x1000 or larger, PNG**, light theme if the project has one.
- Save it in this repo as `portfolio-card.png` at the repo root and tell me the full path.
- If the project can't be screenshotted (CLI, library, no UI), say so and instead describe what
  would work: a terminal session, a chart it outputs, an architecture diagram.
- Add one line of alt text describing what's in the image for someone who can't see it.

## 3. Links, for the launch

- GitHub URL, if the repo is public. If it is local-only or private, say which — I'll decide
  whether to push it.
- Live URL, if it is deployed. If it isn't but could be, say where it would go (Vercel, Pages,
  a release download) and what is stopping it.
- Anything in the repo that should **not** go public: secrets committed, licence issues,
  scraped data, someone else's code.

## 4. Facts to check (outside the copy)

Answer these as plain notes, not as part of the entry:

1. What this project genuinely does differently from the obvious alternative.
2. Anything in my framing above you'd correct, with the evidence from the code.
3. What's half-built or broken, so I don't claim it works.
4. Numbers worth quoting, each with where they come from.
```

---

## When the answer comes back

Paste it into the portfolio session. What happens here:

1. Fields get checked against `src/lib/content/schema.ts` (`pnpm content:check` fails the build
   on a missing or misspelled one) and the copy gets trimmed to the page.
2. `order` is set so the spread reads the way we want; the grid is 2x2 up to four projects and
   three columns after that.
3. The image is sized and saved under `public/`.
4. Links wait: the card has no link or screenshot fields yet (CLAUDE.md → Content keeps the
   slots empty until there's something real). Both get added when the first project has a live
   URL, so a launch is one content change, not a layout change.
