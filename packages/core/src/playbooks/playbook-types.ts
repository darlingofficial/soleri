/**
 * Playbook Type System
 *
 * Two-tier playbook architecture ported from Salvador:
 * - Generic playbooks: process discipline (TDD, brainstorming, debugging, etc.)
 * - Domain playbooks: agent-specific workflows that extend generics
 *
 * Playbooks compose at plan creation time via the `extends` relationship.
 * Generic provides the rhythm, domain fills in domain-specific beats.
 */

// =============================================================================
// TIERS & INTENTS
// =============================================================================

export type PlaybookTier = 'generic' | 'domain';
export type PlaybookIntent = 'BUILD' | 'FIX' | 'REVIEW' | 'PLAN' | 'IMPROVE' | 'DELIVER';

// =============================================================================
// BRAINSTORM SECTIONS
// =============================================================================

/**
 * A structured brainstorming section returned by the brainstorm op.
 * The LLM uses these to guide design conversation with the user.
 */
export interface BrainstormSection {
  title: string;
  description: string;
  questions: string[];
}

// =============================================================================
// GATES
// =============================================================================

/**
 * A gate that must be satisfied at a given lifecycle phase.
 * Gates inject checkId requirements into the planning lifecycle.
 */
export interface PlaybookGate {
  phase: 'brainstorming' | 'pre-execution' | 'post-task' | 'completion';
  requirement: string;
  checkType: string;
}

// =============================================================================
// TASK TEMPLATES
// =============================================================================

/**
 * A task template that the playbook injects into generated plans.
 * These become PlanTask entries during task splitting.
 */
export interface PlaybookTaskTemplate {
  taskType: 'implementation' | 'test' | 'story' | 'documentation' | 'verification';
  /** Title template — may contain {objective} placeholder */
  titleTemplate: string;
  acceptanceCriteria: string[];
  tools: string[];
  order: 'before-implementation' | 'after-implementation' | 'parallel';
}

// =============================================================================
// PLAYBOOK DEFINITION
// =============================================================================

/**
 * Complete playbook definition — the core data type.
 * Playbooks are pure data objects with no logic.
 */
export interface PlaybookDefinition {
  id: string;
  tier: PlaybookTier;
  title: string;
  /** When to activate — maps to vault entry 'context' field */
  trigger: string;
  /** Overview — maps to vault 'description' field */
  description: string;
  /** Step-by-step process — maps to vault 'example' field */
  steps: string;
  /** What success looks like — maps to vault 'why' field */
  expectedOutcome: string;
  /** ID of generic playbook this extends (domain playbooks only) */
  extends?: string;
  /** Free string category (agents define their own domains) */
  category: string;
  tags: string[];
  matchIntents: PlaybookIntent[];
  matchKeywords: string[];
  brainstormSections?: BrainstormSection[];
  gates: PlaybookGate[];
  taskTemplates: PlaybookTaskTemplate[];
  /** Generic op names (not agent-prefixed) */
  toolInjections: string[];
  verificationCriteria: string[];
}

// =============================================================================
// MERGED PLAYBOOK
// =============================================================================

/**
 * Result of matching and merging a generic + domain playbook pair.
 */
export interface MergedPlaybook {
  generic?: PlaybookDefinition;
  domain?: PlaybookDefinition;
  mergedGates: PlaybookGate[];
  mergedTasks: PlaybookTaskTemplate[];
  mergedTools: string[];
  mergedVerification: string[];
  label: string;
}

// =============================================================================
// MATCH RESULT
// =============================================================================

/**
 * Result of playbook matching — includes the source of each match.
 */
export interface PlaybookMatchResult {
  playbook: MergedPlaybook | null;
  genericMatch?: { id: string; source: 'vault' | 'builtin'; score: number };
  domainMatch?: { id: string; source: 'vault' | 'builtin'; score: number };
}
