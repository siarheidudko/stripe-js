import { responseHandler } from "../utils/handlers";
import { stripeApiUrl, stripeApiVersion } from "../utils/constants";
import { RemedyProductStripe } from ".";

/**
 * Confirm payment intent by customer's card
 *
 * @param paymentMethodId - payment method id (see: https://stripe.com/docs/api/customers/object#payment_method_object-id)
 * @param customerKey - customer ephemeral key
 * @param customerId - customer id (see: https://stripe.com/docs/api/customers/object#customer_object-id)
 * @returns
 */

export const setDefaultPaymentMethod = async function (
  this: RemedyProductStripe,
  paymentMethodId: string,
  customerKey: string,
  customerId: string
) {
  /* eslint-disable */
  const stripeApiKey = this._apiKey;
  /* eslint-enable */
  if (typeof stripeApiKey !== "string")
    throw new Error("Initialization failed.");
  // make request for payment method api
  return fetch(`${stripeApiUrl}/customers/${customerId}`, {
    body: `invoice_settings[default_payment_method]=${paymentMethodId}`,
    headers: {
      Authorization: `Bearer ${customerKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": stripeApiVersion,
    },
    method: "POST",
  }).then(responseHandler);
};
