import { Duration } from '../duration';
import { RetryContext } from '../retry-context';
import { RetryPolicy } from './retry-policy';
import { ErrorConstructor } from './retry-policy';
export declare class ExponentialBackOffRetryPolicy implements RetryPolicy {
    private _initialDelay;
    private _maxAttempts;
    private _multiplier;
    private errorsNotRetryOn;
    constructor(_initialDelay: Duration, _maxAttempts: number, _multiplier: number);
    private currentDelay;
    get initialDelay(): Duration;
    get maxAttempts(): number;
    get multiplier(): number;
    static ofDefaults(): RetryPolicy;
    notRetryOn(e: ErrorConstructor): void;
    shouldNotRetry(e: Error): boolean;
    equals(retryPolicy: ExponentialBackOffRetryPolicy): boolean;
    toString(): string;
    canRetry(retryContext: RetryContext): boolean;
    getNextDelay(): Duration;
}
export declare namespace ExponentialBackOffRetryPolicy {
    const newBuilder: () => ExponentialBackOffRetryPolicy.Builder;
    class Builder {
        private _initialDelay?;
        private _maxAttempts?;
        private _multiplier?;
        private errorsNotRetryOn;
        initialDelay(delay: Duration): Builder;
        maxAttempts(attempts: number): Builder;
        multiplier(multiplier: number): Builder;
        notRetryOn(e: ErrorConstructor): Builder;
        notRetrysOn(constructors: ErrorConstructor[]): Builder;
        build(): ExponentialBackOffRetryPolicy;
    }
}
