import { responseHandler } from "../utils/handlers";
import { stripeApiUrl, stripeApiVersion } from "../utils/constants";
import { RemedyProductStripe } from ".";

/**
 * Confirm payment intent by customer's card
 *
 * @param defaultCardId customer default card id
 * @param customerKey - customer ephemeral key
 * @param customerId - customer id (see: https://stripe.com/docs/api/customers/object#customer_object-id)
 * @returns
 */

export const setDefaultCard = async function (
  this: RemedyProductStripe,
  defaultCardId: string,
  customerKey: string,
  customerId: string
) {
  /* eslint-disable */
  const stripeApiKey = this._apiKey;
  /* eslint-enable */
  if (typeof stripeApiKey !== "string")
    throw new Error("Initialization failed.");

  // make request
  return fetch(`${stripeApiUrl}/customers/${customerId}`, {
    body: `default_source=${defaultCardId}`,
    headers: {
      Authorization: `Bearer ${customerKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": stripeApiVersion,
    },
    method: "POST",
  }).then(responseHandler);
};
