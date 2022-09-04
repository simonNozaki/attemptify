import { Duration } from '@/duration';
import { RetryContext } from '@/retry-context';
import { RetryPolicy } from '@/policy/retry-policy';
import { ErrorConstructor } from '@/policy/retry-policy';
export declare class SimpleRetryPolicy implements RetryPolicy {
    private _durationMsec;
    private _maxAttempts;
    private errorsNotRetryOn;
    constructor(_durationMsec: Duration, _maxAttempts: number);
    static ofDefaults(): RetryPolicy;
    notRetryOn(e: ErrorConstructor): void;
    shouldNotRetry(e: Error): boolean;
    equals(retryPolicy: SimpleRetryPolicy): boolean;
    toString(): string;
    canRetry(retryContext: RetryContext): boolean;
    getNextDelay(): Duration;
    get maxAttempts(): number;
    get durationMsec(): Duration;
}
export declare namespace SimpleRetryPolicy {
    const newBuilder: () => SimpleRetryPolicy.Builder;
    class Builder {
        private _duration?;
        private _maxAttempts?;
        private errorsNotRetryOn;
        duration(duration: Duration): Builder;
        maxAttempts(attempts: number): Builder;
        notRetryOn(e: ErrorConstructor): Builder;
        notRetrysOn(constructors: ErrorConstructor[]): Builder;
        build(): SimpleRetryPolicy;
    }
}
