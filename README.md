# attemptify
TypeScript retry library with no dependencies.

## Objective
The aim of this module is to simplify the setup and execution of retries. 
When setting up a retry, there are a number of considerations, such as how long to wait, how many attempts to make, and whether to fail.
This module provides a unified procedure for setting up and executing these complicated retries.

It is particularly influenced by spring-retry and resilience4j, and can incorporate retry settings in a robust and concise manner by combining objects that represent settings.

# Usage
## Getting started
Try to start from `SimpleRetryPolicy` to call `ofDefaults` and boot `Attempt` with that policy.

```typescript
const simpleRetry = SimpleRetryPolicy.ofDefaults();

new Attempt(simpleRetry).execute(() => {
  return new Application().run();
});
```
This retry policy has settings that wait for 1 seconds in interval and max attempt count is 5 times. `Attempt` can execute synchronous or asynchronous, and when asynchronously want to attempt, it is possible to call `executeAsync` like below:

```typescript
new Attempt(simpleRetry).executeAsync(() => (new Application().run()));
```

`Attempt` enable log for debug, using `enableDebugLogging`:

```typescript
new Attempt(simpleRetry)
    .enableDebugLogging()
    .executeAsync(() => (new Application().run()));
```

## About retry policies
This module provides some retry policies - the policy is the strategy for retry.

- `SimpleRetryPolicy` ... simply retrying tomax attempts
- `ExponentialBackOffRetryPolicy` ... wait interval increases exponentialy


## Customize retry policy
This project provides 2 retry policies: constant retry and exponential backoff.
User can use `SimpleRetryPolicy` and `ExponentialBackOffRetryPolicy` each.

### SimpleRetryPolicy
This policy attempt to do a function with constant interval set with interval duration and max attempt counts.
`RetryPolicy` can customize its policy setting to set some values to constructors:

```typescript
const simpleRetry = new SimpleRetryPolicy(seconds(1), 3)
```

The 1st argument of `SimpleRetryPolicy` receive `Duration` instance, passing easily to use `msecs` / `seconds` / `minutes` .

Also, if we want to set a part of settings of policy, a builder is useful. Values that is not set will be defaults.

```typescript
SimpleRetryPolicy.newBuilder()
      .duration(seconds(1))
      .build();
```

For all builder settings, see more: [Class Builder](https://simonnozaki.github.io/attemptify/classes/SimpleRetryPolicy.Builder.html)

### ExponentialBackOffRetryPolicy
`ExponentialBackOffRetryPolicy` also can customize its retry settings by its constructor or builder.

1. initial delay ... initial interval to wait a next attempt
2. max Attempts ... max retry attempt counts
3. multiplier ... an index that multiply a previous delay

And it can be built like below:

```typescript
const policy = new ExponentialBackOffRetryPolicy(seconds(1), 4, multiplierOf(2));
```

The 3rd parameter `multiplier` will multiply its interval exponentialy. For example, when interval duration is 1 seconds and multiplier is 2, interval is calcurated like `1(sec)^2` .

Like `SimpleRetryPolicy`, `ExponentialBackOffRetryPolicy` also can be built by builder style.

```typescript
const policy = ExponentialBackOffRetryPolicy.newBuilder()
      .maxAttempts(2)
      .build();
```

For all builder settings, see more: [Class Builder](https://simonnozaki.github.io/attemptify/classes/ExponentialBackOffRetryPolicy.Builder.html)

## Useful helper type and functions
This project provides some useful helper type and functions.

### Duration
`Duration` class represents some time. It can be constructed by constructor or factory method inside of it.
This class has time value itself and duration unit. For retrying, default duration unit is milli seconds.

```typescript
// Duration unit: milliseconds
Duration.of(1000);

// Duration unit: seconds
Duration.ofSeconds(1);

// Duration unit: minutes
Duration.ofMinutes(1);
```

User also can use some helper functions to shortcut:
```typescript
msecs(1000);

seconds(1);

minutes(1);
```

### Multiplier
`Multiplier` object represents an index to multiply an interval, so this force to round to integer.

User can build it by constructor or helper functions like below:

```typescript
// Both are Okay.
new Multiplier(2);

multiplierOf(2);
```

# docs
All class documents can be seen here: https://simonnozaki.github.io/attemptify/
