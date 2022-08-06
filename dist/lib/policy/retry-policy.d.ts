import { Duration } from '../duration';
import { RetryContext } from '../retry-context';
export declare type ErrorConstructor = new (message?: string) => Error;
export interface RetryPolicy {
    canRetry(retryContext: RetryContext): boolean;
    getNextDelay(): Duration;
    notRetryOn(e: ErrorConstructor): void;
    shouldNotRetry(e: Error): boolean;
    equals(retryPolicy: RetryPolicy): boolean;
    toString(): string;
}
