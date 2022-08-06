export declare const msecs: (milliseconds: number) => Duration;
export declare const seconds: (seconds: number) => Duration;
export declare const minutes: (minutes: number) => Duration;
export declare class Duration {
    private _value;
    private durationUnit;
    private constructor();
    get value(): number;
    static of(milliseconds: number): Duration;
    static ofSeconds(seconds: number): Duration;
    static ofMinutes(minutes: number): Duration;
    toMilliSecconds(): number;
    multiply(multiplier: number): Duration;
    equals(duration: Duration): boolean;
    toString(): string;
}
