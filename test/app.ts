import {Attempt} from '../lib/attempt';
import {seconds} from '../lib/duration';
import {SimpleRetryPolicy} from '../lib/policy/simple-retry-policy';

class Applicaiton {
  execute(): Promise<String> {
    throw new Error();
  }
}

const main = async () => {
  const policy = SimpleRetryPolicy.newBuilder()
      .duration(seconds(1))
      .maxAttempts(2).build();
  return await new Attempt(policy)
      .enableDebugLogging()
      .executeAsync(async () => {
        return new Applicaiton().execute();
      });
};

main()
    .then((v) => console.log(v))
    .catch((e) => console.log(e));
