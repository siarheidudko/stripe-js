import { responseHandler } from "../utils/handlers";
import { stripeApiUrl, stripeApiVersion } from "../utils/constants";
import { RemedyProductStripe } from ".";

/**
 * Get customer data
 *
 * @param customerId - customer id (see: https://stripe.com/docs/api/customers/object#customer_object-id)
 * @param ephemeralKey - customer ephemeral key
 * @returns
 */
export const getCustomer = async function (
  this: RemedyProductStripe,
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
    headers: {
      Authorization: `Bearer ${ephemeralKey}`,
      "Stripe-Version": stripeApiVersion,
    },
  }).then(responseHandler);
};
