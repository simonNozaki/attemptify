import { RetryEventOnFailed } from './retry-event-on-failed';
import { RetryEventOnSuccess } from './retry-event-on-success';
export declare abstract class AbstractRetryEvent {
    abstract getAttemptCounts(): number;
    abstract isSuccess(): boolean;
    abstract isFailure(): boolean;
}
export declare type RetryEvent = RetryEventOnSuccess | RetryEventOnFailed;
