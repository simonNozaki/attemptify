/* eslint-disable require-jsdoc */
import {Attempt} from '@/attempt';
import {
  ExhaustedRetryException,
} from '@/exception/exhausted-retey-exception';
import {msecs} from '@/duration';
import {SimpleRetryPolicy} from '@/policy/simple-retry-policy';
import {RetryEventLister} from 'lib/listener/retry-event-lister';
import {RetryEvent} from 'lib/event/retry-event';
import {App, app} from './app';
import {RetryEventOnFailed} from 'lib/event/retry-event-on-failed';
import {RetryEventOnSuccess} from 'lib/event/retry-event-on-success';
import {SpecRetryException} from './spec-retry-exception';
import {get} from '@/functions/operator';

describe('attempt spec', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('can retry 3 times', () => {
    const policy = new SimpleRetryPolicy(msecs(50), 3);
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
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('can retry 3 times asynchronously', async () => {
    const policy = new SimpleRetryPolicy(msecs(50), 3);
    const spy = jest.spyOn(App.prototype, 'executeAsync')
        .mockImplementation(() => {
          throw new Error('Error occured on App');
        });
    try {
      await new Attempt(policy)
          .enableDebugLogging()
          .executeAsync(() => {
            return app.executeAsync();
          });
    } catch (e) {
      expect(e).toBeInstanceOf(ExhaustedRetryException);
    }
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('can handle retry events in EventListener', () => {
    const policy = new SimpleRetryPolicy(msecs(50), 3);
    jest.spyOn(App.prototype, 'execute')
        .mockImplementation(() => {
          throw new SpecRetryException('Error occured on App');
        });
    class SpecRetryEventListener implements RetryEventLister {
      attemptCounts: number;
      lastError: Error;
      onSuccess(retryEvent: RetryEventOnSuccess): void {
        throw new Error('Should not be as Success');
      }
      onFailed(retryEvent: RetryEventOnFailed): void {
        this.attemptCounts = retryEvent.getAttemptCounts();
        this.lastError = retryEvent.getLastError();
      }
      onExhausted(retryEvent: RetryEvent): void {
        retryEvent;
      }
    }
    const listener = new SpecRetryEventListener();

    try {
      new Attempt(policy)
          .addListener(listener)
          .enableDebugLogging()
          .execute(() => {
            return app.execute();
          });
    } catch (e) {
      // no expectations for catch clause
    }
    expect(listener.attemptCounts).toBe(3);
    expect(listener.lastError).toBeInstanceOf(SpecRetryException);
  });

  it('can handle retry events in EventListener asynchronously', async () => {
    const policy = new SimpleRetryPolicy(msecs(50), 3);
    jest.spyOn(App.prototype, 'executeAsync')
        .mockImplementation(() => {
          throw new SpecRetryException('Error occured on App');
        });
    class SpecRetryEventListener implements RetryEventLister {
      attemptCounts: number;
      lastError: Error;
      onSuccess(retryEvent: RetryEventOnSuccess): void {
        throw new Error('Should not be as Success');
      }
      onFailed(retryEvent: RetryEventOnFailed): void {
        this.attemptCounts = retryEvent.getAttemptCounts();
        this.lastError = retryEvent.getLastError();
      }
      onExhausted(retryEvent: RetryEvent): void {
        retryEvent;
      }
    }
    const listener = new SpecRetryEventListener();

    try {
      await new Attempt(policy)
          .addListener(listener)
          .enableDebugLogging()
          .executeAsync(() => {
            return app.executeAsync();
          });
    } catch (e) {
      // no expectations for catch clause
    }
    expect(listener.attemptCounts).toBe(3);
    expect(listener.lastError).toBeInstanceOf(SpecRetryException);
  });

  it('get default on exhausted', () => {
    const policy = new SimpleRetryPolicy(msecs(50), 3);
    const spy = jest.spyOn(App.prototype, 'execute')
        .mockImplementation(() => {
          throw new SpecRetryException('Error occured on App');
        });
    const result = new Attempt(policy)
        .enableDebugLogging()
        .executeOrDefault(
            () => {
              return app.execute();
            },
            'EXHAUSTED',
        );
    expect(spy).toHaveBeenCalledTimes(3);
    expect(result).toBe('EXHAUSTED');
  });

  it('get default on exhausted asynchronously', async () => {
    const policy = new SimpleRetryPolicy(msecs(50), 3);
    const spy = jest.spyOn(App.prototype, 'executeAsync')
        .mockImplementation(() => {
          throw new SpecRetryException('Error occured on App');
        });
    const result = await new Attempt(policy)
        .enableDebugLogging()
        .executeAsyncOrDefault(
            () => {
              return app.executeAsync();
            },
            'EXHAUSTED',
        );
    expect(spy).toHaveBeenCalledTimes(3);
    expect(result).toBe('EXHAUSTED');
  });

  it('should execute another on exhausted asynchronously', async () => {
    const policy = new SimpleRetryPolicy(msecs(50), 3);
    const spy = jest.spyOn(App.prototype, 'executeAsync')
        .mockImplementation(() => {
          throw new SpecRetryException('Error occured on App');
        });
    const result = await new Attempt(policy)
        .enableDebugLogging()
        .executeAsyncOrElse(
            () => {
              return app.executeAsync();
            },
            () => {
              return new Promise((resolve) => resolve('EXHAUSTED'));
            },
        );
    expect(spy).toHaveBeenCalledTimes(3);
    expect(result).toBe('EXHAUSTED');
  });

  it('should execute another on exhausted', () => {
    const policy = new SimpleRetryPolicy(msecs(50), 3);
    const spy = jest.spyOn(App.prototype, 'execute')
        .mockImplementation(() => {
          throw new SpecRetryException('Error occured on App');
        });
    const result = new Attempt(policy)
        .enableDebugLogging()
        .executeOrElse(
            () => {
              return app.execute();
            },
            () => {
              return 'EXHAUSTED';
            },
        );
    expect(spy).toHaveBeenCalledTimes(3);
    expect(result).toBe('EXHAUSTED');
  });

  it('should retry only once and can success', () => {
    const policy = new SimpleRetryPolicy(msecs(50), 3);
    // Mock throws error once and return string next.
    const spy = jest.spyOn(App.prototype, 'execute')
        .mockImplementationOnce(() => {
          throw new SpecRetryException('Error occured on App');
        })
        .mockImplementationOnce(() => {
          return 'test';
        });
    let result: string;
    try {
      result = new Attempt(policy)
          .enableDebugLogging()
          .execute(() => {
            return app.execute();
          });
    } catch (e) {
      // An error souhld not be thrown
    }
    expect(spy).toHaveBeenCalledTimes(2);
    expect(result).toBe('test');
  });

  it('should success normally and handle retry event', () => {
    jest.spyOn(App.prototype, 'execute').mockImplementationOnce(() => 'test');
    class AttemptSuccessEventListener implements RetryEventLister {
      isSuccess: boolean;
      attemptCounts: number;
      onSuccess(retryEvent: RetryEventOnSuccess): void {
        this.isSuccess = retryEvent.isSuccess();
        this.attemptCounts = retryEvent.getAttemptCounts();
      }
      onFailed(retryEvent: RetryEventOnFailed): void {
        throw new Error('Method not implemented.');
      }
      onExhausted(retryEvent: RetryEvent): void {
        throw new Error('Method not implemented.');
      }
    }
    const p = SimpleRetryPolicy.ofDefaults();
    const listener = new AttemptSuccessEventListener();
    const r = new Attempt(p)
        .addListener(listener)
        .execute(get(app.execute()));
    expect(r).toBe('test');
    expect(listener.isSuccess).toBeTruthy();
    expect(listener.attemptCounts).toBe(0);
  });
});
