/**
 * Classified error types with typed retry presets.
 *
 * Every error is classified as retryable, fixable, or permanent.
 * This lets callers decide strategy without inspecting codes.
 */

// ─── Error Codes ───────────────────────────────────────────────────────

export enum SoleriErrorCode {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  TIMEOUT = 'TIMEOUT',
  RATE_LIMIT = 'RATE_LIMIT',
  INTERNAL = 'INTERNAL',
  LLM_OVERLOAD = 'LLM_OVERLOAD',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  CONFIG_ERROR = 'CONFIG_ERROR',
  VAULT_UNREACHABLE = 'VAULT_UNREACHABLE',
}

// ─── Classification ────────────────────────────────────────────────────

export type ErrorClassification = 'retryable' | 'fixable' | 'permanent';

const CLASSIFICATION_MAP: Record<SoleriErrorCode, ErrorClassification> = {
  [SoleriErrorCode.NETWORK]: 'retryable',
  [SoleriErrorCode.TIMEOUT]: 'retryable',
  [SoleriErrorCode.RATE_LIMIT]: 'retryable',
  [SoleriErrorCode.LLM_OVERLOAD]: 'retryable',
  [SoleriErrorCode.VAULT_UNREACHABLE]: 'retryable',
  [SoleriErrorCode.INTERNAL]: 'retryable',
  [SoleriErrorCode.VALIDATION]: 'fixable',
  [SoleriErrorCode.AUTH]: 'permanent',
  [SoleriErrorCode.RESOURCE_NOT_FOUND]: 'permanent',
  [SoleriErrorCode.CONFIG_ERROR]: 'permanent',
};

// ─── SoleriError ───────────────────────────────────────────────────────

export interface SoleriErrorOptions {
  cause?: Error;
  context?: Record<string, unknown>;
}

export class SoleriError extends Error {
  readonly code: SoleriErrorCode;
  readonly classification: ErrorClassification;
  readonly retryable: boolean;
  readonly context?: Record<string, unknown>;

  constructor(message: string, code: SoleriErrorCode, options?: SoleriErrorOptions) {
    super(message, options?.cause ? { cause: options.cause } : undefined);
    this.name = 'SoleriError';
    this.code = code;
    this.classification = CLASSIFICATION_MAP[code];
    this.retryable = this.classification === 'retryable';
    this.context = options?.context;
  }
}

// ─── Result Type ───────────────────────────────────────────────────────

export type Result<T, E = SoleriError> = { ok: true; value: T } | { ok: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<T = never>(error: SoleriError): Result<T> {
  return { ok: false, error };
}

export function isOk<T, E>(result: Result<T, E>): result is { ok: true; value: T } {
  return result.ok === true;
}

export function isErr<T, E>(result: Result<T, E>): result is { ok: false; error: E } {
  return result.ok === false;
}
