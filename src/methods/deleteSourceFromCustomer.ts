import { Card } from "@stripe/stripe-js";
import { responseHandler } from "../utils/handlers";
import { stripeApiUrl, stripeApiVersion } from "../utils/constants";
import { StripeExtension } from "./index";

/**
 * Delete card from customer.
 *
 * @param sourceId - source or card id (see: https://stripe.com/docs/api/sources/object#source_object-id)
 * @param customerId - customer id (see: https://stripe.com/docs/api/customers/object#customer_object-id)
 * @param ephemeralKey - customer ephemeral key
 * @returns
 */
export const deleteSourceFromCustomer = async function (
  this: StripeExtension,
  sourceId: string,
  customerId: string,
  ephemeralKey: string
): Promise<Card | undefined> {
   
  const stripeApiKey = this._apiKey;
   
  if (typeof stripeApiKey !== "string")
    throw new Error("Initialization failed.");

  // make request
  return await fetch(
    `${stripeApiUrl}/customers/${customerId}/sources/${sourceId}`,
    {
      headers: {
        Authorization: `Bearer ${ephemeralKey}`,
        "Stripe-Version": stripeApiVersion,
      },
      method: "DELETE",
    }
  ).then(responseHandler);
};
