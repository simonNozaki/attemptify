"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var exponential_backoff_retry_policy_1 = require("@/policy/exponential-backoff-retry-policy");
var attempt_1 = require("@/attempt");
var duration_1 = require("@/duration");
var exhausted_retey_exception_1 = require("@/exception/exhausted-retey-exception");
var simple_retry_policy_1 = require("@/policy/simple-retry-policy");
var app_1 = require("./app");
var spec_retry_exception_1 = require("./spec-retry-exception");
var multiplier_1 = require("@/multiplier");
describe('Policy Specs', function () {
    afterEach(function () {
        jest.clearAllMocks();
    });
    describe('SimpleRetryPolicy specs', function () {
        it('should not retry on SpecRetryException', function () {
            var policy = new simple_retry_policy_1.SimpleRetryPolicy((0, duration_1.msecs)(50), 3);
            policy.notRetryOn(spec_retry_exception_1.SpecRetryException);
            var spy = jest.spyOn(app_1.App.prototype, 'execute')
                .mockImplementation(function () {
                throw new spec_retry_exception_1.SpecRetryException('Error occured on App');
            });
            try {
                new attempt_1.Attempt(policy).execute(function () {
                    return app_1.app.execute();
                });
            }
            catch (e) {
                expect(e).toBeInstanceOf(exhausted_retey_exception_1.ExhaustedRetryException);
            }
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('can customize policy with builder', function () {
            var p = simple_retry_policy_1.SimpleRetryPolicy.newBuilder()
                .duration(duration_1.Duration.of(50))
                .maxAttempts(2)
                .build();
            var spy = jest.spyOn(app_1.App.prototype, 'execute')
                .mockImplementation(function () {
                throw new spec_retry_exception_1.SpecRetryException('Error occured on App');
            });
            try {
                new attempt_1.Attempt(p)
                    .enableDebugLogging()
                    .execute(function () {
                    return app_1.app.execute();
                });
            }
            catch (e) {
                expect(e).toBeInstanceOf(exhausted_retey_exception_1.ExhaustedRetryException);
            }
            expect(spy).toHaveBeenCalledTimes(2);
        });
    });
    describe('ExponentialBackOffRetryPolicy specs', function () {
        it('should not retry on SpecRetryException', function () {
            var policy = new exponential_backoff_retry_policy_1.ExponentialBackOffRetryPolicy((0, duration_1.msecs)(10), 3, (0, multiplier_1.multiplierOf)(2));
            policy.notRetryOn(spec_retry_exception_1.SpecRetryException);
            var spy = jest.spyOn(app_1.App.prototype, 'execute')
                .mockImplementation(function () {
                throw new spec_retry_exception_1.SpecRetryException('Error occured on App');
            });
            try {
                new attempt_1.Attempt(policy)
                    .enableDebugLogging()
                    .execute(function () {
                    return app_1.app.execute();
                });
            }
            catch (e) {
                expect(e).toBeInstanceOf(exhausted_retey_exception_1.ExhaustedRetryException);
            }
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('can customize policy with builder', function () {
            var p = exponential_backoff_retry_policy_1.ExponentialBackOffRetryPolicy.newBuilder()
                .initialDelay((0, duration_1.msecs)(10))
                .maxAttempts(4)
                .multiplier((0, multiplier_1.multiplierOf)(2))
                .build();
            var spy = jest.spyOn(app_1.App.prototype, 'execute')
                .mockImplementation(function () {
                throw new spec_retry_exception_1.SpecRetryException('Error occured on App');
            });
            try {
                new attempt_1.Attempt(p)
                    .enableDebugLogging()
                    .execute(function () {
                    return app_1.app.execute();
                });
            }
            catch (e) {
                expect(e).toBeInstanceOf(exhausted_retey_exception_1.ExhaustedRetryException);
            }
            expect(spy).toHaveBeenCalledTimes(4);
        });
    });
});
//# sourceMappingURL=policy-spec.js.map