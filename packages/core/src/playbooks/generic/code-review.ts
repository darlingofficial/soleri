/**
 * Generic Playbook: Code Review
 *
 * Structured PR review discipline — 7-category grading.
 * Ported from Salvador's code-review playbook.
 */

import type { PlaybookDefinition } from '../playbook-types.js';

export const codeReviewPlaybook: PlaybookDefinition = {
  id: 'generic-code-review',
  tier: 'generic',
  title: 'Structured Code Review',
  trigger:
    'Use when reviewing a pull request, code diff, or any code submission. Activates for REVIEW intent.',
  description:
    'Systematic code review using 7 independent grading categories (A-F). Each category is evaluated separately so no area hides behind others. Produces a structured verdict with prioritized action items.',
  steps: `1. UNDERSTAND THE CHANGE
   - Read the PR description, linked issues, and acceptance criteria
   - Understand the WHY before judging the HOW
   - Identify the blast radius — what areas of the codebase are touched?

2. AUTOMATED SMELL SCAN
   - Deep nesting: 3+ levels
   - Else after return: guard clause opportunities
   - Long functions: >35 LOC critical, 25-35 warning
   - Long parameter lists: >5 params
   - Magic numbers, duplication, dead code

3. GRADE 7 CATEGORIES (A-F each)
   A. NAMING — intent-revealing, consistent convention
   B. FUNCTION DESIGN — single responsibility, reasonable length/params
   C. COMMENTS & DOCUMENTATION — explain WHY not WHAT, no dead code
   D. STRUCTURE & LAYOUT — SRP at file level, organized imports
   E. ERROR HANDLING — proper level, actionable messages, edge cases
   F. CODE SMELLS — DRY, guard clauses, early returns
   G. SOLID & DESIGN PRINCIPLES — OCP, DIP, ISP, LSkov

4. SECURITY & PERFORMANCE QUICK-CHECK
   - No secrets/credentials, no injection vectors
   - No N+1 queries, no unbounded loops, no memory leaks

5. DELIVER VERDICT
   - Overall grade (A-F) based on category grades
   - Top 3 prioritized action items with line references
   - Classify: APPROVE, REQUEST CHANGES, or COMMENT`,
  expectedOutcome:
    'Every PR receives a structured, fair review. Each category graded independently. Specific, actionable feedback with line references.',
  category: 'methodology',
  tags: ['code-review', 'pr-review', 'quality', 'grading', 'generic'],
  matchIntents: ['REVIEW'],
  matchKeywords: [
    'review',
    'code review',
    'pr review',
    'pull request',
    'diff',
    'check code',
    'critique',
    'feedback',
    'approve',
    'merge',
  ],
  gates: [
    {
      phase: 'pre-execution',
      requirement: 'PR description and linked issues must be read before reviewing code',
      checkType: 'review-context',
    },
    {
      phase: 'post-task',
      requirement: 'All 7 categories must have an explicit grade (A-F)',
      checkType: 'review-grading-complete',
    },
    {
      phase: 'completion',
      requirement: 'Verdict must include prioritized action items with line references',
      checkType: 'review-verdict',
    },
  ],
  taskTemplates: [
    {
      taskType: 'verification',
      titleTemplate: 'Automated smell scan for: {objective}',
      acceptanceCriteria: [
        'Scanned for deep nesting (3+ levels)',
        'Scanned for long functions (>35 LOC)',
        'Scanned for long parameter lists (>5 params)',
        'Scanned for dead/commented-out code',
        'Scanned for duplication',
      ],
      tools: [],
      order: 'before-implementation',
    },
    {
      taskType: 'verification',
      titleTemplate: 'Grade 7 categories for: {objective}',
      acceptanceCriteria: [
        'Naming graded A-F',
        'Function Design graded A-F',
        'Comments graded A-F',
        'Structure graded A-F',
        'Error Handling graded A-F',
        'Smells graded A-F',
        'SOLID graded A-F',
      ],
      tools: [],
      order: 'after-implementation',
    },
  ],
  toolInjections: [],
  verificationCriteria: [
    'All 7 categories have explicit A-F grades',
    'At least 3 prioritized action items with line references',
    'Security quick-check completed',
    'Automated smell scan results documented',
    'Overall verdict delivered: APPROVE, REQUEST CHANGES, or COMMENT',
  ],
};
