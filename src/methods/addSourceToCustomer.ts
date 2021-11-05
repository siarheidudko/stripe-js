import { Card } from "@stripe/stripe-js";
import { responseHandler } from "../utils/handlers";
import { stripeApiUrl, stripeApiVersion } from "../utils/constants";
import { RemedyProductStripe } from "./index";

/**
 * Add payment method to customer (from source or token).
 *
 * @param source - source or token string (see: https://stripe.com/docs/api/sources/object)
 * @param customerId - customer id (see: https://stripe.com/docs/api/customers/object#customer_object-id)
 * @param customerEphemeralKey - customer ephemeral key
 * @returns
 */
export const addSourceToCustomer = async function (
  this: RemedyProductStripe,
  token: string,
  customerId: string,
  customerEphemeralKey: string
): Promise<Card | undefined> {
  /* eslint-disable */
  const stripeApiKey = this._apiKey;
  /* eslint-enable */
  if (typeof stripeApiKey !== "string")
    throw new Error("Initialization failed.");

  // make request
  return fetch(`${stripeApiUrl}/customers/${customerId}/sources`, {
    body: `source=${token}`,
    headers: {
      Authorization: `Bearer ${customerEphemeralKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": `${stripeApiVersion}`,
    },
    method: "POST",
  }).then(responseHandler);
};
