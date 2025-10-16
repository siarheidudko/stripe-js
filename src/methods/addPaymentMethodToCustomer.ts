import { PaymentMethod } from "@stripe/stripe-js";
import { responseHandler } from "../utils/handlers.js";
import { stripeApiUrl, stripeApiVersion } from "../utils/constants.js";
import { StripeExtension } from "./index.js";

/**
 * Add payment method to customer.
 *
 * @param paymentMethodId - payment method id (see: https://stripe.com/docs/api/customers/object#payment_method_object-id)
 * @param customerId - customer id (see: https://stripe.com/docs/api/customers/object#customer_object-id)
 * @param ephemeralKey - customer ephemeral key
 * @returns
 */
export const addPaymentMethodToCustomer = async function (
  this: StripeExtension,
  paymentMethodId: string,
  customerId: string,
  ephemeralKey: string
): Promise<PaymentMethod | undefined> {
   
  const stripeApiKey = this._apiKey;
   
  if (typeof stripeApiKey !== "string")
    throw new Error("Initialization failed.");

  // make request
  return fetch(`${stripeApiUrl}/payment_methods/${paymentMethodId}/attach`, {
    body: `customer=${customerId}`,
    headers: {
      Authorization: `Bearer ${ephemeralKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": `${stripeApiVersion}`,
    },
    method: "POST",
  }).then(responseHandler);
};
