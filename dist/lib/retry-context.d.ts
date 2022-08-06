export declare class RetryContext {
    private _attemptCount;
    private _lastError?;
    get attemptsCount(): number;
    get lastError(): Error | null;
    updateLastError(e: Error): void;
}
