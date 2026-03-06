---
title: "Day 20 — The Compound Effect"
description: "Maya's agent knows her design system cold. A new team member joins and gets up to speed in minutes. Knowledge compounds."
---

Three weeks in. Maya's dashboard is taking shape — twelve screens, a component library, dark mode support, responsive layouts. Her agent has been there for every decision.

## What the Agent Knows Now

Maya checks her agent's vault:

> **Maya:** "Show me vault stats"
> **Agent:**
>
> | Category | Count |
> |----------|-------|
> | Patterns | 34 |
> | Anti-patterns | 8 |
> | Principles | 3 |
> | Playbooks | 2 |
> | **Total** | **47** |
>
> Strongest patterns (used in 10+ sessions):
> - Dashboard Color Palette — Trust & Clarity variant
> - Typography System — Inter + JetBrains Mono
> - Minimum Touch Target — 44px
> - Never use hardcoded hex values
>
> Top domains: `design` (28 entries), `frontend` (19 entries)

47 entries. Every one of them earned through real work. The strongest patterns — the ones Maya referenced most often — have risen to the top automatically. The brain tracks what gets used and what gets ignored.

## It Knows Before She Asks

Maya starts building a new settings page. Before she's even asked a question:

> **Agent:** *Based on your current context (settings page), here are relevant patterns from your vault:*
>
> - Form inputs should use `var(--color-slate-900)` text on `var(--color-slate-50)` background
> - Spacing between form groups: 24px (your captured grid system)
> - All toggles and checkboxes: 44px touch target minimum
> - Consider: your "Form Validation Patterns" playbook covers error state styling
>
> 3 anti-patterns to avoid:
> - Don't use red for error text without an icon (captured Day 12 — colorblind users miss it)
> - Don't put destructive actions next to save buttons without visual separation (captured Day 15)
> - Don't use placeholder text as labels (captured Day 8)

Maya didn't ask for any of this. The agent's brain recognized the context — a settings page with forms — and proactively surfaced everything relevant from her vault. The anti-patterns are especially valuable: these are mistakes she already made and fixed once. The agent makes sure she never makes them again.

## A New Team Member Joins

Alex joins the team. He's a frontend developer, good with React but unfamiliar with Maya's design system. In the old world, Maya would spend half a day walking him through the Figma files, the style guide, the component library conventions.

Instead, Alex scaffolds his own agent and links it to Maya's project:

```bash
npm create soleri alex-agent
```

Then in his first session:

> **Alex:** "Link this project to Maya's dashboard project"
> **Agent:** *Linked to /projects/dashboard as related. 47 knowledge entries now accessible via cross-project search.*

Now Alex asks a question:

> **Alex:** "I need to build a notification banner. What are the design conventions for this project?"
> **Agent:** *Cross-project search... Found 6 relevant patterns from the linked dashboard project:*
>
> **Colors:** This project uses a Trust & Clarity palette — slate-900 for text, teal-600 for interactive elements, amber-500 for warnings. Always use CSS custom properties, never hardcoded hex values.
>
> **Spacing:** 8px base grid. Card padding is 16px, section spacing is 24px.
>
> **Accessibility:** All interactive elements ≥ 44px touch target. Contrast must meet WCAG AA (4.5:1 for text). Don't use color alone to convey meaning — always pair with icons.
>
> **Typography:** Inter for UI text (14px body, 12px minimum), JetBrains Mono for data values.
>
> For a notification banner specifically, I'd suggest running the "Component Design Review" playbook after you build it.

Alex just got a personalized onboarding in 30 seconds. Not a generic design system doc — Maya's actual decisions, her actual rules, her actual anti-patterns. If Maya captured "don't put destructive actions next to save buttons," Alex's agent knows that too.

## Knowledge Flows Both Ways

A week later, Alex discovers something while building the notification system:

> **Alex:** "Capture this pattern: notification banners should auto-dismiss after 8 seconds for success messages, but persist until manually closed for errors and warnings. Users miss transient error messages."
> **Agent:** *Captured pattern: "Notification Auto-Dismiss Rules"*

Because the projects are linked, Maya's agent can find this pattern too:

> **Maya:** "Search across all projects for notification patterns"
> **Agent:** *Cross-project search... Found: "Notification Auto-Dismiss Rules" from Alex's project.*
>
> Success: auto-dismiss after 8s. Errors and warnings: persist until closed. Rationale: users miss transient error messages.

Knowledge flows both ways. Maya captured the visual foundations, Alex added interaction behavior. Together, their agents build a design system that's richer than either could create alone.

## The Compound Effect

Here's what happened over 20 days:

| Milestone | What Changed |
|-----------|-------------|
| **Day 1** | Agent starts with starter knowledge. Maya captures 3 foundational decisions. |
| **Day 3** | Agent catches its first mistake — a contrast violation. Maya adds accessibility rules and a review playbook. 8 entries. |
| **Day 10** | Agent knows Maya's component patterns. Starts making proactive suggestions instead of just answering questions. 22 entries. |
| **Day 15** | Anti-patterns accumulate — agent warns about past mistakes before they happen again. 35 entries. |
| **Day 20** | New team member gets onboarded in seconds. Knowledge flows across team members. 50+ entries across 2 linked projects. |

This is the compound effect. Each session makes the agent slightly smarter. Each captured pattern prevents a future mistake. Each team member who links their project adds to the collective knowledge.

Maya's agent isn't a generic AI assistant anymore. It's a design system guardian that knows *her* system — not because someone wrote a 200-page style guide, but because it was there for every decision, every fix, every "never do this again" moment.

The knowledge doesn't evaporate between sessions. It compounds.

---

*Ready to build your own? Start with [Getting Started](/docs/getting-started/) — scaffold your agent in under 5 minutes.*
