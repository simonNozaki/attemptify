import {Attempt} from '../lib/attempt';
import {ExhaustedRetryException} from '../lib/exception';
import {msecs} from '../lib/duration';
import {SimpleRetryPolicy} from '../lib/policy/simple-retry-policy';

describe('attempt spec', () => {
  // eslint-disable-next-line require-jsdoc
  class App {
    // eslint-disable-next-line require-jsdoc
    execute(): string {
      throw new Error('Thrown on unit tests');
    }
    // eslint-disable-next-line require-jsdoc
    executeAsync(): Promise<string> {
      throw new Error('Thrown on unit tests');
    }
  }

  const app = new App();

  it('can retry 3 times', async () => {
    const policy = new SimpleRetryPolicy(msecs(50), 3);
    const spy = jest.spyOn(App.prototype, 'execute')
        .mockImplementation(() => {
          throw new Error('Error occured on App');
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
});
