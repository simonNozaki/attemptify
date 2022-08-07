import { AbstractRetryEvent } from './retry-event';
import { RetryEventOnFailed } from './retry-event-on-failed';
export declare class RetryEventOnSuccess implements AbstractRetryEvent {
    private attemptCounts;
    constructor(attemptCounts: number);
    getAttemptCounts(): number;
    isSuccess(): this is RetryEventOnSuccess;
    isFailure(): this is RetryEventOnFailed;
}
