import { Duration } from '@/duration';
import { RetryContext } from '@/retry-context';
import { ErrorConstructor, RetryPolicy } from './retry-policy';
export declare class InfiniteRetryPolicy implements RetryPolicy {
    private _duration;
    private errorsNotRetryOn;
    constructor(_duration: Duration);
    canRetry(retryContext: RetryContext): boolean;
    getNextDelay(): Duration;
    notRetryOn(e: ErrorConstructor): void;
    shouldNotRetry(e: Error): boolean;
    equals(retryPolicy: InfiniteRetryPolicy): boolean;
    toString(): string;
    get duration(): Duration;
}
