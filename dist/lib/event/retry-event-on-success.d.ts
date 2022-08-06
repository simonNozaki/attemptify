import { AbstractRetryEvent } from './retry-event';
export declare class RetryEventOnSuccess implements AbstractRetryEvent {
    private attemptCounts;
    constructor(attemptCounts: number);
    getAttemptCounts(): number;
    isSuccess(): boolean;
    isFailure(): boolean;
}
