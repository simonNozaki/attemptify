import {Duration} from '@/duration';
import {RetryContext} from '@/retry-context';

export type ErrorConstructor = new (message?: string) => Error;

/**
 * Base retry policy
 */
export interface RetryPolicy {
  canRetry(retryContext: RetryContext): boolean;
  getNextDelay(): Duration;
  notRetryOn(e: ErrorConstructor): void;
  // TODO abstract class and method to implement default
  shouldNotRetry(e: Error): boolean;
  equals(retryPolicy: RetryPolicy): boolean;
  toString(): string;
}
