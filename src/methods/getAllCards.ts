import { responseHandler } from "../utils/handlers.js";
import { stripeApiUrl, stripeApiVersion } from "../utils/constants.js";
import { StripeExtension } from "./index.js";

/**
 * Get all customer's card
 *
 * @param customerId - customer id (see: https://stripe.com/docs/api/customers/object#customer_object-id)
 * @param ephemeralKey - customer ephemeral key
 * @returns
 */
export const getAllCards = async function (
  this: StripeExtension,
  customerId: string,
  ephemeralKey: string
) {
   
  const stripeApiKey = this._apiKey;
   
  if (typeof stripeApiKey !== "string")
    throw new Error("Initialization failed.");

  // make request
  return fetch(
    `${stripeApiUrl}/payment_methods?customer=${customerId}&type=card&limit=100`,
    {
      headers: {
        Authorization: `Bearer ${ephemeralKey}`,
        "Stripe-Version": stripeApiVersion,
      },
      method: "GET",
    }
  ).then(responseHandler);
};
