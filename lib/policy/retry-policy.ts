import {Duration} from '../duration';
import {RetryContext} from '../retry-context';

/**
 * Base retry policy
 */
export interface RetryPolicy {
  canRetry(retryContext: RetryContext): boolean;
  getNextDelay(): Duration;
  equals(retryPolicy: RetryPolicy): boolean;
  toString(): string;
}
