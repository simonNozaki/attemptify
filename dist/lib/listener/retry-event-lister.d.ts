import { RetryEvent } from 'lib/event/retry-event';
import { RetryEventOnFailed } from 'lib/event/retry-event-on-failed';
import { RetryEventOnSuccess } from 'lib/event/retry-event-on-success';
export interface RetryEventLister {
    onSuccess(retryEvent: RetryEventOnSuccess): void;
    onFailed(retryEvent: RetryEventOnFailed): void;
    onExhausted(retryEvent: RetryEvent): void;
}
