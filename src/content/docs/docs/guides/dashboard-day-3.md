---
title: "Day 3 — Catching Mistakes"
description: "Maya's agent flags a contrast violation, catches a hardcoded color, and learns from every fix. The knowledge compound effect begins."
---

It's Wednesday. Maya has been building components for two days — cards, charts, navigation, filters. Her agent has been quietly useful, answering questions and remembering her decisions. But today it does something she didn't expect: it pushes back.

## The Contrast Problem

Maya is building a status badge component. She picks a light green background with white text for "Active" status. It looks fine on her retina display. She mentions it to her agent while working on the code:

> **Maya:** "I've got a status badge — green background #22c55e with white text for the 'Active' state. Does this work?"
> **Agent:** *Searches vault... Found: "WCAG contrast ratios for text and UI controls" (critical)*
>
> That combination has a contrast ratio of **2.8:1** — it fails WCAG AA, which requires **4.5:1** for normal text.
>
> Options:
> - Darken the green to `#15803d` (ratio: 4.6:1) — passes AA
> - Use dark text `#14532d` on your light green (ratio: 5.2:1) — passes AA
> - Keep your green but use it as a border/dot indicator instead of a background, with dark text on a neutral surface
>
> The third option is common in dashboards — it reduces visual noise when you have many badges visible at once.

Maya didn't ask for a review. But the agent recognized a contrast problem because it has WCAG baselines in its starter knowledge, marked as `critical` severity. Critical patterns always surface.

She goes with option 3 — a subtle green dot next to dark text. Cleaner, accessible, and better for data density.

## Hardcoded Colors

Later that afternoon, Maya is styling a data table. She's moving fast and writes:

```css
.table-header {
  background: #1e293b;
  color: #f8fafc;
}
```

She mentions the table to her agent:

> **Maya:** "Just styled the data table headers. Slate background, light text."
> **Agent:** *Searches vault... Found: "Dashboard Color Palette — Trust & Clarity variant" (critical)*
>
> Quick note — your captured palette uses semantic names: `slate-900` for text, `slate-50` for light backgrounds. If you're writing CSS directly, consider using CSS custom properties that map to your palette:
>
> ```css
> .table-header {
>   background: var(--color-slate-900);
>   color: var(--color-slate-50);
> }
> ```
>
> This way, when your palette evolves (and it will), you change one file instead of finding every hex value across the codebase. Want me to capture this as a rule?
> **Maya:** "Yes, capture it."
> **Agent:** *Captured anti-pattern: "Never use hardcoded hex values — always reference design tokens"*
>
> Severity: `warning`. Domain: `design`. Tags: `tokens`, `css`, `consistency`.

The agent just created a rule from Maya's own experience. Next time someone on her team writes a hardcoded color, the agent will flag it.

## Learning from Fixes

The status badge fix gave Maya an idea. She realizes she should have a general rule about interactive element sizes on mobile — not just for badges, but for everything.

> **Maya:** "Capture this pattern: all interactive elements — buttons, links, toggles, badges — must have a minimum touch target of 44x44px on mobile. This includes adequate padding even if the visual element is smaller."
> **Agent:** *Captured pattern: "Minimum Touch Target — 44px for all interactive elements"*
>
> Severity: `critical`. Domain: `frontend`. Tags: `accessibility`, `mobile`, `touch-target`.
>
> This aligns with the WCAG 2.5.8 Target Size guideline already in the vault. I've linked them as related patterns.

The agent didn't just store it — it connected Maya's rule to the industry standard already in its knowledge base. When it surfaces this pattern in the future, it'll reference both: Maya's team rule *and* the WCAG guideline.

## The Playbook

By end of day, Maya has fixed three components. She notices a pattern in her own workflow: every time she builds a new component, she should check the same things. She asks her agent to formalize it:

> **Maya:** "Create a playbook called 'Component Design Review' with these steps:
> 1. Check all colors against our captured palette (validate: no hardcoded hex values)
> 2. Verify contrast ratios meet WCAG AA (validate: ratio ≥ 4.5:1 for text)
> 3. Confirm touch targets are ≥ 44px on mobile (validate: measured in dev tools)
> 4. Check spacing uses our 8px grid (validate: all values are multiples of 4 or 8)"
> **Agent:** *Created playbook: "Component Design Review" — 4 steps, all with validation criteria.*
>
> You can run this anytime with: "Run the Component Design Review playbook"

Now Maya has a repeatable quality gate. Not a checklist buried in Notion — a living procedure her agent can execute and validate.

## End of Day 3

Maya's agent vault has grown:

| Day | Patterns | What Changed |
|-----|----------|-------------|
| Day 1 | 3 | Color palette, typography, spacing |
| Day 3 | 8 | + contrast rule, token usage, touch targets, component review playbook, status badge pattern |

Five new entries in two days, each one born from real work — not theoretical best practices, but decisions Maya actually made while building real components. The agent is starting to reflect *her* design system, not a generic one.

More importantly, it's catching things she'd otherwise miss. The contrast violation would have shipped. The hardcoded hex values would have multiplied. The touch target issue would have surfaced in QA a week later. Instead, her agent caught all three while she was still in flow.

---

*Next: [Day 20 — The Compound Effect](/docs/guides/dashboard-day-20/) — Maya's agent knows her design system cold, and a new team member gets up to speed in minutes instead of weeks.*
