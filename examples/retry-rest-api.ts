import { SimpleRetryPolicy } from "@core/policy/simple-retry-policy";
import { msecs } from "@core/duration";
import { Axios } from "axios";
import { Attempt } from "@core/attempt";

const getCurrentPrice = async (symbol: string) => {
  const url = "https://financialmodelingprep.com/api/company/real-time-price/" + symbol + "?datatype=json";
  return await new Axios().get(url);
};

const main = async () => {
  const policy = SimpleRetryPolicy.newBuilder()
      .duration(msecs(500))
      .maxAttempts(3)
      .build();
  const res = new Attempt(policy).executeAsync(() => {
    return getCurrentPrice("amzn");
  });
  console.log(res);
}

main();
