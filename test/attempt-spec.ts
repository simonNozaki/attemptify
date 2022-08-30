import {Attempt} from 'lib/attempt';
import {msecs} from '../lib/duration';
import {SimpleRetryPolicy} from '../lib/policy/simple-retry-policy';

describe('attempt spec', () => {
  // eslint-disable-next-line require-jsdoc
  class Application {
    // eslint-disable-next-line require-jsdoc
    run(): string {
      throw new Error('Thrown on unit tests');
    }
  }

  it('can retry 3 times', async () => {
    const policy = new SimpleRetryPolicy(msecs(50), 2);
    new Attempt(policy).execute(() => {
      return new Application().run();
    });
  });
});
