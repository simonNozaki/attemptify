import { AbstractRetryEvent } from './retry-event';
import { RetryEventOnSuccess } from './retry-event-on-success';
export declare class RetryEventOnFailed implements AbstractRetryEvent {
    private attemptCounts;
    private lastError;
    constructor(attemptCounts: number, lastError: Error);
    getAttemptCounts(): number;
    isSuccess(): this is RetryEventOnSuccess;
    isFailure(): this is RetryEventOnFailed;
    getLastError(): Error;
}
