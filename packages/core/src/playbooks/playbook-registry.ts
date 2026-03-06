/**
 * Playbook Registry
 *
 * Matches playbooks to plan context (intent + keywords) and merges
 * generic + domain tiers into a single MergedPlaybook.
 *
 * Resolution order: vault first (user overrides), built-in fallback.
 */

import type {
  PlaybookDefinition,
  PlaybookMatchResult,
  MergedPlaybook,
  PlaybookGate,
  PlaybookTaskTemplate,
  PlaybookIntent,
} from './playbook-types.js';

// Built-in generic playbook definitions
import { tddPlaybook } from './generic/tdd.js';
import { brainstormingPlaybook } from './generic/brainstorming.js';
import { codeReviewPlaybook } from './generic/code-review.js';
import { subagentExecutionPlaybook } from './generic/subagent-execution.js';
import { systematicDebuggingPlaybook } from './generic/systematic-debugging.js';
import { verificationPlaybook } from './generic/verification.js';

// =============================================================================
// SCORING WEIGHTS
// =============================================================================

const INTENT_MATCH_SCORE = 10;
const KEYWORD_MATCH_SCORE = 5;
const MIN_MATCH_SCORE = 5;

// =============================================================================
// BUILT-IN REGISTRY
// =============================================================================

const BUILTIN_PLAYBOOKS: PlaybookDefinition[] = [
  tddPlaybook,
  brainstormingPlaybook,
  codeReviewPlaybook,
  subagentExecutionPlaybook,
  systematicDebuggingPlaybook,
  verificationPlaybook,
];

/**
 * Get a built-in playbook by ID.
 */
export function getBuiltinPlaybook(id: string): PlaybookDefinition | undefined {
  return BUILTIN_PLAYBOOKS.find((p) => p.id === id);
}

/**
 * Get all built-in playbooks.
 */
export function getAllBuiltinPlaybooks(): readonly PlaybookDefinition[] {
  return BUILTIN_PLAYBOOKS;
}

// =============================================================================
// SCORING
// =============================================================================

/**
 * Score a playbook against the given intent and text.
 * Returns 0 if no match, positive score if matched.
 */
export function scorePlaybook(
  playbook: PlaybookDefinition,
  intent: PlaybookIntent | undefined,
  text: string,
): number {
  let score = 0;
  const lowerText = text.toLowerCase();

  if (intent && playbook.matchIntents.includes(intent)) {
    score += INTENT_MATCH_SCORE;
  }

  for (const keyword of playbook.matchKeywords) {
    if (lowerText.includes(keyword.toLowerCase())) {
      score += KEYWORD_MATCH_SCORE;
    }
  }

  return score;
}

function findBestMatch(
  playbooks: PlaybookDefinition[],
  intent: PlaybookIntent | undefined,
  text: string,
): { playbook: PlaybookDefinition; score: number } | undefined {
  let best: { playbook: PlaybookDefinition; score: number } | undefined;

  for (const playbook of playbooks) {
    const score = scorePlaybook(playbook, intent, text);
    if (score >= MIN_MATCH_SCORE && (!best || score > best.score)) {
      best = { playbook, score };
    }
  }

  return best;
}

// =============================================================================
// MERGING
// =============================================================================

/**
 * Create a MergedPlaybook from a generic and/or domain match.
 */
export function mergePlaybooks(
  generic?: PlaybookDefinition,
  domain?: PlaybookDefinition,
): MergedPlaybook {
  // Gates: generic first, then domain
  const mergedGates: PlaybookGate[] = [];
  if (generic) mergedGates.push(...generic.gates);
  if (domain) mergedGates.push(...domain.gates);

  // Tasks: domain overrides generic at same order+taskType
  const genericTemplates = generic?.taskTemplates ?? [];
  const domainTemplates = domain?.taskTemplates ?? [];
  const mergedTasks: PlaybookTaskTemplate[] = [...genericTemplates];
  for (const dt of domainTemplates) {
    const idx = mergedTasks.findIndex((g) => g.order === dt.order && g.taskType === dt.taskType);
    if (idx >= 0) {
      mergedTasks[idx] = dt;
    } else {
      mergedTasks.push(dt);
    }
  }

  // Tools: deduplicated union
  const toolSet = new Set<string>();
  if (generic) for (const t of generic.toolInjections) toolSet.add(t);
  if (domain) for (const t of domain.toolInjections) toolSet.add(t);
  const mergedTools = Array.from(toolSet);

  // Verification: deduplicated union
  const verSet = new Set<string>();
  if (generic) for (const v of generic.verificationCriteria) verSet.add(v);
  if (domain) for (const v of domain.verificationCriteria) verSet.add(v);
  const mergedVerification = Array.from(verSet);

  // Label
  let label: string;
  if (generic && domain) label = `${domain.title} (extends ${generic.title})`;
  else if (domain) label = domain.title;
  else if (generic) label = generic.title;
  else label = 'Unknown';

  return { generic, domain, mergedGates, mergedTasks, mergedTools, mergedVerification, label };
}

// =============================================================================
// MAIN API
// =============================================================================

/**
 * Match playbooks for a plan based on intent and objective/scope text.
 *
 * Resolution:
 * 1. Combine vault + built-in playbooks
 * 2. Find best domain match (more specific)
 * 3. Find best generic match
 * 4. If domain has `extends`, resolve the generic it extends
 * 5. Merge into MergedPlaybook
 */
export function matchPlaybooks(
  intent: PlaybookIntent | undefined,
  text: string,
  vaultPlaybooks?: PlaybookDefinition[],
): PlaybookMatchResult {
  const allPlaybooks = [...(vaultPlaybooks ?? []), ...BUILTIN_PLAYBOOKS];

  const generics = allPlaybooks.filter((p) => p.tier === 'generic');
  const domains = allPlaybooks.filter((p) => p.tier === 'domain');

  // Domain match first (more specific)
  const domainMatch = findBestMatch(domains, intent, text);

  // Generic match
  let genericMatch = findBestMatch(generics, intent, text);

  // If domain extends a specific generic, prefer that one
  if (domainMatch?.playbook.extends) {
    const extendedGeneric = allPlaybooks.find((p) => p.id === domainMatch.playbook.extends);
    if (extendedGeneric) {
      genericMatch = { playbook: extendedGeneric, score: domainMatch.score };
    }
  }

  if (!genericMatch && !domainMatch) {
    return { playbook: null };
  }

  const merged = mergePlaybooks(genericMatch?.playbook, domainMatch?.playbook);

  return {
    playbook: merged,
    genericMatch: genericMatch
      ? { id: genericMatch.playbook.id, source: 'builtin', score: genericMatch.score }
      : undefined,
    domainMatch: domainMatch
      ? { id: domainMatch.playbook.id, source: 'builtin', score: domainMatch.score }
      : undefined,
  };
}
