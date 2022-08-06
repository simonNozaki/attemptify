import { AbstractRetryEvent } from './retry-event';
export declare class RetryEventOnFailed implements AbstractRetryEvent {
    private attemptCounts;
    private lastError;
    constructor(attemptCounts: number, lastError: Error);
    getAttemptCounts(): number;
    isSuccess(): boolean;
    isFailure(): boolean;
    getLastError(): Error;
}
