/**
 * Error classifier — converts any thrown value into a typed SoleriError.
 *
 * Maps HTTP status codes, network error codes, and message patterns
 * to the appropriate SoleriErrorCode.
 */

import { SoleriError, SoleriErrorCode } from './types.js';

interface ErrorLike {
  message?: string;
  status?: number;
  statusCode?: number;
  code?: string;
  cause?: unknown;
}

function toErrorLike(error: unknown): ErrorLike {
  if (error instanceof SoleriError) return error;
  if (error instanceof Error) return error as unknown as ErrorLike;
  if (typeof error === 'object' && error !== null) return error as ErrorLike;
  return { message: String(error) };
}

function getHttpStatus(e: ErrorLike): number | undefined {
  return e.status ?? e.statusCode;
}

function classifyByHttpStatus(status: number): SoleriErrorCode | undefined {
  if (status === 401 || status === 403) return SoleriErrorCode.AUTH;
  if (status === 404) return SoleriErrorCode.RESOURCE_NOT_FOUND;
  if (status === 408) return SoleriErrorCode.TIMEOUT;
  if (status === 429) return SoleriErrorCode.RATE_LIMIT;
  if (status === 422) return SoleriErrorCode.VALIDATION;
  if (status >= 500 && status < 600) return SoleriErrorCode.INTERNAL;
  return undefined;
}

const NETWORK_CODES = new Set(['ECONNREFUSED', 'ENOTFOUND', 'ECONNRESET', 'EPIPE', 'EHOSTUNREACH']);
const TIMEOUT_CODES = new Set(['ETIMEDOUT', 'ESOCKETTIMEDOUT', 'UND_ERR_CONNECT_TIMEOUT']);

function classifyByErrorCode(code: string | undefined): SoleriErrorCode | undefined {
  if (!code) return undefined;
  if (NETWORK_CODES.has(code)) return SoleriErrorCode.NETWORK;
  if (TIMEOUT_CODES.has(code)) return SoleriErrorCode.TIMEOUT;
  return undefined;
}

const MESSAGE_PATTERNS: Array<[RegExp, SoleriErrorCode]> = [
  [/overloaded|capacity|model.*busy/i, SoleriErrorCode.LLM_OVERLOAD],
  [/timeout|timed?\s*out/i, SoleriErrorCode.TIMEOUT],
  [/vault|database|sqlite/i, SoleriErrorCode.VAULT_UNREACHABLE],
  [/invalid|validation|schema/i, SoleriErrorCode.VALIDATION],
  [/config(uration)?|missing.*key|env/i, SoleriErrorCode.CONFIG_ERROR],
  [/auth(entication|orization)?|forbidden|denied|unauthorized/i, SoleriErrorCode.AUTH],
  [/not\s*found|404|no\s+such/i, SoleriErrorCode.RESOURCE_NOT_FOUND],
  [/rate\s*limit|too\s+many\s+requests|throttl/i, SoleriErrorCode.RATE_LIMIT],
  [/network|connect|socket|dns/i, SoleriErrorCode.NETWORK],
];

function classifyByMessage(message: string | undefined): SoleriErrorCode | undefined {
  if (!message) return undefined;
  for (const [pattern, code] of MESSAGE_PATTERNS) {
    if (pattern.test(message)) return code;
  }
  return undefined;
}

/**
 * Classify any thrown value into a SoleriError.
 * If the value is already a SoleriError, returns it as-is.
 */
export function classifyError(error: unknown): SoleriError {
  if (error instanceof SoleriError) return error;

  const e = toErrorLike(error);
  const originalError = error instanceof Error ? error : undefined;
  const message = e.message ?? 'Unknown error';

  // 1. HTTP status code
  const httpStatus = getHttpStatus(e);
  if (httpStatus !== undefined) {
    const code = classifyByHttpStatus(httpStatus);
    if (code)
      return new SoleriError(message, code, { cause: originalError, context: { httpStatus } });
  }

  // 2. Node.js error code
  const errCode = classifyByErrorCode(e.code);
  if (errCode)
    return new SoleriError(message, errCode, {
      cause: originalError,
      context: { errorCode: e.code },
    });

  // 3. Message pattern matching
  const msgCode = classifyByMessage(message);
  if (msgCode) return new SoleriError(message, msgCode, { cause: originalError });

  // 4. Default: permanent INTERNAL
  return new SoleriError(message, SoleriErrorCode.INTERNAL, { cause: originalError });
}
