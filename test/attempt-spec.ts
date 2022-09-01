/* eslint-disable require-jsdoc */
import {Attempt} from '../lib/attempt';
import {ExhaustedRetryException} from '../lib/exception';
import {msecs} from '../lib/duration';
import {SimpleRetryPolicy} from '../lib/policy/simple-retry-policy';
import {RetryEventLister} from 'lib/listener/retry-event-lister';
import {RetryEvent} from 'lib/event/retry-event';
import {App, app} from './app';
import {RetryEventOnFailed} from 'lib/event/retry-event-on-failed';
import {RetryEventOnSuccess} from 'lib/event/retry-event-on-success';
import {SpecRetryException} from './spec-retry-exception';

describe('attempt spec', () => {
  afterEach(() => {
    jest.clearAllMocks();
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

  it('get default on Exhausted', () => {
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
});
