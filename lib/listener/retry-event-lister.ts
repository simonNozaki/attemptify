import {RetryEvent} from 'lib/event/retry-event';
import {RetryEventOnFailed} from 'lib/event/retry-event-on-failed';
import {RetryEventOnSuccess} from 'lib/event/retry-event-on-success';

/**
 * Base interface of listener for retry event.
 * Client can implement this interface so that it can
 * receive an instance of {@link RetryEvent}.
 */
export interface RetryEventLister {
  onSuccess(retryEvent: RetryEventOnSuccess): void;
  onFailed(retryEvent: RetryEventOnFailed): void;
  onExhausted(retryEvent: RetryEvent): void;
}
