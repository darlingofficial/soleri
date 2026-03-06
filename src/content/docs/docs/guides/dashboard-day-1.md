---
title: "Day 1 — Your First Design Session"
description: "Maya scaffolds a Soleri agent and makes her first design decisions for a SaaS analytics dashboard. Every choice is captured, nothing is lost."
---

Meet Maya. She's a UX/UI designer starting a new project — an analytics dashboard for a SaaS product. She's worked on dashboards before, but every time it's the same story: design decisions get buried in Slack threads, Figma comments, and meeting notes. By month three, nobody remembers *why* the team chose that particular shade of blue.

This time, Maya is trying something different. She's going to use a Soleri agent — an AI assistant that remembers everything she teaches it and gets sharper over time.

## Setting Up

Maya opens her terminal and scaffolds an agent:

```bash
npm create soleri design-buddy
```

The wizard asks a few questions. She names it **design-buddy**, gives it the role *"UX/UI design system guardian"*, picks `frontend` and `design` as knowledge domains, and sets the voice to `professional`.

Two minutes later, she has a working agent connected to Claude Code.

## First Conversation

Maya is staring at a blank Figma canvas. She knows the dashboard is for a B2B analytics product, but hasn't settled on a visual direction yet. She opens Claude Code and asks her agent:

> **Maya:** "I'm building an analytics dashboard for a SaaS product. What color palettes work well for this kind of product?"
> **Agent:** *Searches vault... Found 3 relevant entries.*
>
> Based on your SaaS analytics context, here are proven approaches:
>
> **Trust & Clarity** — Navy/slate primary (`#1e293b`), teal accent (`#0d9488`), neutral grays for data. Projects authority and reliability. Best for enterprise-facing products.
>
> **Vibrant Data** — Deep purple primary (`#7c3aed`), gradient accents, warm highlights for alerts. Stands out in crowded markets. Works well when the dashboard IS the product.
>
> **Minimal & Clean** — Near-white backgrounds, single accent color, data speaks through charts not chrome. Reduces cognitive load for power users who live in the dashboard daily.
>
> All three pass WCAG AA contrast ratios for body text. Want me to detail any of these?

Maya didn't expect that. The agent already knows SaaS palette patterns from its starter knowledge — she didn't have to teach it anything.

## Making Decisions

She likes the Trust & Clarity direction but wants to tweak it. After some back-and-forth in Figma, she settles on her palette.

> **Maya:** "We've decided on our color palette. Capture this:
> Primary: slate-900 for text, teal-600 for interactive elements, amber-500 for alerts and warnings. Background: slate-50 in light mode, slate-950 in dark mode."
> **Agent:** *Captured pattern: "Dashboard Color Palette — Trust & Clarity variant"*
>
> Saved to the `design` domain with tags: `color`, `palette`, `dashboard`. Severity: `critical` — this is a foundational decision.

That pattern now lives in the vault. It won't disappear into a Slack thread.

## Building on Knowledge

Maya moves on to typography. She knows she wants something clean and readable for data-heavy screens, but isn't sure about pairings.

> **Maya:** "What font pairings work for data-heavy dashboards? I need something highly readable at small sizes for tables and charts."
> **Agent:** *Searches vault... Found font pairing reference (57 combinations).*
>
> For data-dense dashboards, I'd recommend:
>
> 1. **Inter + JetBrains Mono** — Inter for UI labels and headings, JetBrains Mono for data values and code. Both designed for screens, excellent at 12-14px.
>
> 2. **IBM Plex Sans + IBM Plex Mono** — Unified family, very consistent feel. The mono variant was built for data tables.
>
> 3. **DM Sans + Space Mono** — More personality. DM Sans is geometric and friendly, Space Mono adds character to numbers.
>
> For a B2B analytics product, option 1 (Inter + JetBrains Mono) is the safest — Inter is the most battle-tested UI font, and JetBrains Mono has excellent number alignment for tabular data.

Maya picks option 1 and captures it:

> **Maya:** "Capture this: we're using Inter for UI text and JetBrains Mono for data values. Body size 14px, minimum readable size 12px, heading scale 1.25 ratio."
> **Agent:** *Captured pattern: "Typography System — Inter + JetBrains Mono"*

## Spacing and Layout

Two hours in, Maya has her visual foundation. She asks one more question before wrapping up:

> **Maya:** "What spacing system should I use? I want consistency but don't want to overthink it."
> **Agent:** "For dashboards, an 8px base grid is standard:
>
> - **4px** — tight gaps (icon-to-label, inline elements)
> - **8px** — default inner padding
> - **16px** — card padding, between related elements
> - **24px** — between sections
> - **32px** — major section separators
>
> This gives you 5 values to remember. Stick to multiples of 8, use 4 only when 8 feels too loose."

She captures this too.

## End of Day 1

Maya closes her laptop. She's made three foundational decisions — color palette, typography, and spacing — and all three are captured in her agent's vault. Not in a Google Doc she'll forget about. Not in a Figma comment that'll get buried. In a knowledge system that will actively remind her of these decisions when she needs them.

Her agent has 3 patterns so far. It's not much. But tomorrow, when she opens a new session and starts building components, it will remember everything.

---

*Next: [Day 3 — Catching Mistakes](/docs/guides/dashboard-day-3/) — Maya's agent starts earning its keep by catching design inconsistencies before they ship.*
