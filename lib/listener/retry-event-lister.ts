import {RetryEvent} from 'lib/event/retry-event';

/**
 * Base interface of listener for retry event.
 * Client can implement this interface so that it can
 * receive an instance of {@link RetryEvent}.
 */
export interface RetryEventLister {
  onSuccess(retryEvent: RetryEvent): void;
  onFailed(retryEvent: RetryEvent): void;
  onExhausted(retryEvent: RetryEvent): void;
}
