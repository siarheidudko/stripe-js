import { PaymentMethod } from "@stripe/stripe-js";
import { responseHandler } from "../utils/handlers";
import { stripeApiUrl, stripeApiVersion } from "../utils/constants";
import { StripeExtension } from "./index";

/**
 * Delete payment method from customer.
 *
 * @param paymentMethodId - payment method id (see: https://stripe.com/docs/api/customers/object#payment_method_object-id)
 * @param ephemeralKey - customer ephemeral key
 * @returns
 */
export const deletePaymentMethodFromCustomer = async function (
  this: StripeExtension,
  paymentMethodId: string,
  ephemeralKey: string
): Promise<PaymentMethod | undefined> {
  /* eslint-disable */
  const stripeApiKey = this._apiKey;
  /* eslint-enable */
  if (typeof stripeApiKey !== "string")
    throw new Error("Initialization failed.");

  // make request
  return fetch(`${stripeApiUrl}/payment_methods/${paymentMethodId}/detach`, {
    headers: {
      Authorization: `Bearer ${ephemeralKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": `${stripeApiVersion}`,
    },
    method: "POST",
  }).then(responseHandler);
};
