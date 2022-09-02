import {Attempt} from '../lib/attempt';
import {msecs} from '../lib/duration';
import {ExhaustedRetryException} from '../lib/exception';
import {SimpleRetryPolicy} from '../lib/policy/simple-retry-policy';
import {App, app} from './app';
import {SpecRetryException} from './spec-retry-exception';

describe('Policy Specs', () => {
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
});
