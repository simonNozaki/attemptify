import {eq, then, when} from './when';

/**
 * Duration unit
 */
type DurationUnit = 'milliseconds' | 'seconds' | 'minutes';

/**
 * Get new duration with unit milliseconds
 * @param {number} milliseconds
 * @return {Duration}
 */
export const msecs = (milliseconds: number): Duration => {
  return Duration.of(milliseconds);
};

/**
 * Get new duration with unit seconds
 * @param {number} seconds
 * @return {Duration}
 */
export const seconds = (seconds: number): Duration => {
  return Duration.ofSeconds(seconds);
};

/**
 * * Get new duration with unit minutes
 * @param {number} minutes
 * @return {Duration}
 */
export const minutes = (minutes: number): Duration => {
  return Duration.ofMinutes(minutes);
};

/**
 * Duration object, representing time like milliseconds, seconds...
 */
export class Duration {
  /**
   * @param {number} _value
   * @param {DurationUnit} durationUnit
   */
  private constructor(
    private _value: number,
    private durationUnit: DurationUnit,
  ) {}

  // eslint-disable-next-line require-jsdoc
  get value(): number {
    return this._value;
  }

  /**
   *
   * @param {number} milliseconds
   * @return {Duration}
   */
  static of(milliseconds: number): Duration {
    return new Duration(milliseconds, 'milliseconds');
  }

  /**
   *
   * @param {number} seconds
   * @return {Duration}
   */
  static ofSeconds(seconds: number): Duration {
    return new Duration(seconds, 'seconds');
  }

  /**
   *
   * @param {number} minutes
   * @return {Duration}
   */
  static ofMinutes(minutes: number): Duration {
    return new Duration(minutes, 'minutes');
  }

  /**
   * Convert value to milliseconds.
   * @return {number}
   */
  toMilliSecconds(): number {
    return when(this.durationUnit)
        .is(eq('seconds'), () => this._value * 1000)
        .is(eq('minutes'), () => this._value * 60000)
        .default(then(this._value));
  }

  /**
   * Multiply duration and return new `Duration` instance.
   * @param {number} multiplier
   * @return {Duration}
   */
  multiply(multiplier: number): Duration {
    return new Duration(this._value * multiplier, this.durationUnit);
  }

  /**
   * @param {Duration} duration
   * @return {boolean}
   */
  equals(duration: Duration): boolean {
    return this._value === duration.value &&
      this.durationUnit === duration.durationUnit;
  }
}
