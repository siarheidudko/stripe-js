import { Card } from "@stripe/stripe-js";
import { responseHandler } from "../utils/handlers";
import { stripeApiUrl, stripeApiVersion } from "../utils/constants";
import { RemedyProductStripe } from "./index";

/**
 * Add card to customer (from source or token).
 *
 * @param token - source or token string (see: https://stripe.com/docs/api/sources/object)
 * @param customerId - customer id (see: https://stripe.com/docs/api/customers/object#customer_object-id)
 * @param ephemeralKey - customer ephemeral key
 * @returns
 */
export const addSourceToCustomer = async function (
  this: RemedyProductStripe,
  token: string,
  customerId: string,
  ephemeralKey: string
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
      Authorization: `Bearer ${ephemeralKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": `${stripeApiVersion}`,
    },
    method: "POST",
  }).then(responseHandler);
};
