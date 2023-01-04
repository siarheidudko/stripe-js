import { responseHandler } from "../utils/handlers";
import { stripeApiUrl, stripeApiVersion } from "../utils/constants";
import { StripeExtension } from ".";

/**
 * Get customer's default card id
 *
 * @param customerId - customer id (see: https://stripe.com/docs/api/customers/object#customer_object-id)
 * @param ephemeralKey - customer ephemeral key
 * @returns
 */
export const getDefaultCard = async function (
  this: StripeExtension,
  customerId: string,
  ephemeralKey: string
): Promise<string | undefined> {
  /* eslint-disable */
  const stripeApiKey = this._apiKey;
  /* eslint-enable */
  if (typeof stripeApiKey !== "string")
    throw new Error("Initialization failed.");

  // make request
  return fetch(`${stripeApiUrl}/customers/${customerId}`, {
    headers: {
      Authorization: `Bearer ${ephemeralKey}`,
      "Stripe-Version": stripeApiVersion,
    },
  })
    .then(responseHandler)
    .then((e) => (e?.default_source ? e.default_source : undefined));
};
