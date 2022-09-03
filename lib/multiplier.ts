import {AttemptObjectException} from './exception/attempt-object-exception';

/**
 * Method alias of constructor call:
 * ```typescript
 * new Multiplier(2)
 * ```
 * @param {number} multiplier
 * @return {Multiplier}
 */
export const multiplierOf = (multiplier: number): Multiplier => {
  return new Multiplier(multiplier);
};

/**
 * Domain object representing multiplier for backoff policy.
 * Multiplier is to be integer, so this class round a parameter.
 */
export class Multiplier {
  readonly value: number;
  /**
   * @param {number} intValue
   */
  constructor(intValue: number) {
    if (intValue < 0) {
      throw new AttemptObjectException('Multiplier shuold be positive.');
    }
    this.value = Math.round(intValue);
  }
}
