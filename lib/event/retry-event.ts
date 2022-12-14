import {RetryEventOnFailed} from './retry-event-on-failed';
import {RetryEventOnSuccess} from './retry-event-on-success';

/**
 * Base class of retry event
 */
export abstract class AbstractRetryEvent {
  abstract getAttemptCounts(): number;
  abstract isSuccess(): boolean;
  abstract isFailure(): boolean;
}

/**
 * Sealed type definition of retry event.
 */
export type RetryEvent = RetryEventOnSuccess | RetryEventOnFailed;
