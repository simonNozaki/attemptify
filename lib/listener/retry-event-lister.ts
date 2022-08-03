import {RetryEvent} from 'lib/event/retry-event';

/**
 * Base interface of listener for retry event.
 */
export interface RetryEventLister {
  onSuccess(retryEvent: RetryEvent): void;
  onFailed(retryEvent: RetryEvent): void;
  onExhausted(retryEvent: RetryEvent): void;
}
