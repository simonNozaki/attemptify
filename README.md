# attemptify
TypeScript retry library.

## Objective
The aim of this module is to simplify the setup and execution of retries. 
When setting up a retry, there are a number of considerations, such as how long to wait, how many attempts to make, and whether to fail.
This module provides a unified procedure for setting up and executing these complicated retries.

# Usage
## About retry policies
This module provides some retry policies - the policy is the strategy for retry.

## Getting started
Try to start from `SimpleRetryPolicy` to call `ofDefaults` and boot `Attempt` with that policy.

```typescript
const simpleRetry = SimpleRetryPolicy.ofDefaults();

new Attempt(simpleRetry).execute(() => (new Application().run()));
```
This retry policy has settings that wait for 1 seconds in interval and max attempt count is 5 times. `Attempt` can execute synchronous or asynchronous, and when asynchronously want to attempt, it is possible to call `executeAsync` like below:

```typescript
new Attempt(simpleRetry).executeAsync(() => (new Application().run()));
```
