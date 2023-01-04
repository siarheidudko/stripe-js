import { responseHandler } from "../utils/handlers";
import { stripeApiUrl, stripeApiVersion } from "../utils/constants";
import { StripeExtension } from ".";

/**
 * Set default customer card
 *
 * @param cardId - card id (see: https://stripe.com/docs/api/customers/object#card_object-id)
 * @param customerId - customer id (see: https://stripe.com/docs/api/customers/object#customer_object-id)
 * @param ephemeralKey - customer ephemeral key
 * @returns
 */
export const setDefaultCard = async function (
  this: StripeExtension,
  cardId: string,
  customerId: string,
  ephemeralKey: string
) {
  /* eslint-disable */
  const stripeApiKey = this._apiKey;
  /* eslint-enable */
  if (typeof stripeApiKey !== "string")
    throw new Error("Initialization failed.");

  // make request
  return fetch(`${stripeApiUrl}/customers/${customerId}`, {
    body: `default_source=${cardId}`,
    headers: {
      Authorization: `Bearer ${ephemeralKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": stripeApiVersion,
    },
    method: "POST",
  }).then(responseHandler);
};
