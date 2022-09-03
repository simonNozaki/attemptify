import {
  ExponentialBackOffRetryPolicy,
} from '../lib/policy/exponential-backoff-retry-policy';
import {Attempt} from '../lib/attempt';
import {Duration, msecs} from '../lib/duration';
import {
  ExhaustedRetryException,
} from '../lib/exception/exhausted-retey-exception';
import {SimpleRetryPolicy} from '../lib/policy/simple-retry-policy';
import {App, app} from './app';
import {SpecRetryException} from './spec-retry-exception';
import {multiplierOf} from '../lib/multiplier';

describe('Policy Specs', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('SimpleRetryPolicy specs', () => {
    it('should not retry on SpecRetryException', () => {
      const policy = new SimpleRetryPolicy(msecs(50), 3);
      policy.notRetryOn(SpecRetryException);
      const spy = jest.spyOn(App.prototype, 'execute')
          .mockImplementation(() => {
            throw new SpecRetryException('Error occured on App');
          });
      try {
        new Attempt(policy).execute(() => {
          return app.execute();
        });
      } catch (e) {
        expect(e).toBeInstanceOf(ExhaustedRetryException);
      }
      // Not retrying, so attemt counts should be 1
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('can customize policy with builder', () => {
      const p = SimpleRetryPolicy.newBuilder()
          .duration(Duration.of(50))
          .maxAttempts(2)
          .build();
      const spy = jest.spyOn(App.prototype, 'execute')
          .mockImplementation(() => {
            throw new SpecRetryException('Error occured on App');
          });
      try {
        new Attempt(p)
            .enableDebugLogging()
            .execute(() => {
              return app.execute();
            });
      } catch (e) {
        expect(e).toBeInstanceOf(ExhaustedRetryException);
      }
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  describe('ExponentialBackOffRetryPolicy specs', () => {
    it('should not retry on SpecRetryException', () => {
      const policy = new ExponentialBackOffRetryPolicy(
          msecs(10),
          3,
          multiplierOf(2),
      );
      policy.notRetryOn(SpecRetryException);
      const spy = jest.spyOn(App.prototype, 'execute')
          .mockImplementation(() => {
            throw new SpecRetryException('Error occured on App');
          });
      try {
        new Attempt(policy)
            .enableDebugLogging()
            .execute(() => {
              return app.execute();
            });
      } catch (e) {
        expect(e).toBeInstanceOf(ExhaustedRetryException);
      }
      // Not retrying, so attemt counts should be 1
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('can customize policy with builder', () => {
      const p = ExponentialBackOffRetryPolicy.newBuilder()
          .initialDelay(msecs(10))
          .maxAttempts(4)
          .multiplier(multiplierOf(2))
          .build();
      const spy = jest.spyOn(App.prototype, 'execute')
          .mockImplementation(() => {
            throw new SpecRetryException('Error occured on App');
          });
      try {
        new Attempt(p)
            .enableDebugLogging()
            .execute(() => {
              return app.execute();
            });
      } catch (e) {
        expect(e).toBeInstanceOf(ExhaustedRetryException);
      }
      expect(spy).toHaveBeenCalledTimes(4);
    });
  });
});
