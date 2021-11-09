import { responseHandler } from "../utils/handlers";
import { stripeApiUrl, stripeApiVersion } from "../utils/constants";
import { RemedyProductStripe } from ".";

/**
 * Confirm payment intent by customer's card
 *
 * @param customerKey - customer ephemeral key
 * @param customerId - customer id (see: https://stripe.com/docs/api/customers/object#customer_object-id)
 * @returns
 */

export const getCustomer = async function (
  this: RemedyProductStripe,
  customerKey: string,
  customerId: string
) {
  /* eslint-disable */
  const stripeApiKey = this._apiKey;
  /* eslint-enable */
  if (typeof stripeApiKey !== "string")
    throw new Error("Initialization failed.");

  // make request
  return await fetch(`${stripeApiUrl}/customers/${customerId}`, {
    headers: {
      Authorization: `Bearer ${customerKey}`,
      "Stripe-Version": stripeApiVersion,
    },
  }).then(responseHandler);
};
