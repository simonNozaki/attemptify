import { RetryEventLister } from './listener/retry-event-lister';
import { RetryPolicy } from './policy/retry-policy';
export declare class Attempt {
    private retryPolicy;
    private readonly retryContext;
    constructor(retryPolicy: RetryPolicy);
    private requireDebugLogging;
    private retryEventListeners;
    addListener(retryEventListener: RetryEventLister): Attempt;
    addListeners(retryEventListeners: RetryEventLister[]): Attempt;
    hasListener(): boolean;
    enableDebugLogging(): Attempt;
    executeAsync<T>(producer: () => Promise<T>): Promise<T>;
    executeAsyncOrElse<T>(producer: () => Promise<T>, another: () => Promise<T>): Promise<T>;
    executeAsyncOrDefault<T>(producer: () => Promise<T>, defaultValue: T): Promise<T>;
    private doOnRetryAsync;
    private logDebugIfRequire;
    execute<T>(producer: () => T): T;
    executeOrElse<T>(producer: () => T, another?: () => T): T;
    executeOrDefault<T>(producer: () => T, defaultValue: T): T;
    private doOnRetry;
    private notifyRetryEventOnSuccess;
    private notifyRetryEventOnFailed;
    private wait;
}
