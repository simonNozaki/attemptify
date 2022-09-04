import { Multiplier } from '../multiplier';
import { Duration } from '@/duration';
import { RetryContext } from '@/retry-context';
import { RetryPolicy } from './retry-policy';
import { ErrorConstructor } from './retry-policy';
export declare class ExponentialBackOffRetryPolicy implements RetryPolicy {
    private readonly _initialDelay;
    private readonly _maxAttempts;
    private readonly _multiplier;
    private errorsNotRetryOn;
    constructor(_initialDelay: Duration, _maxAttempts: number, _multiplier: Multiplier);
    private currentDelay;
    get initialDelay(): Duration;
    get maxAttempts(): number;
    get multiplier(): Multiplier;
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
        multiplier(multiplier: Multiplier): Builder;
        notRetryOn(e: ErrorConstructor): Builder;
        notRetrysOn(constructors: ErrorConstructor[]): Builder;
        build(): ExponentialBackOffRetryPolicy;
    }
}
