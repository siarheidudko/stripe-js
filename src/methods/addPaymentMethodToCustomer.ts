import { PaymentMethod } from "@stripe/stripe-js";
import { responseHandler } from "../utils/handlers";
import { stripeApiUrl, stripeApiVersion } from "../utils/constants";
import { RemedyProductStripe } from "./index";

/**
 * Add payment method to customer.
 *
 * @param paymentMethodId - payment method id (see: https://stripe.com/docs/api/customers/object#payment_method_object-id)
 * @param customerId - customer id (see: https://stripe.com/docs/api/customers/object#customer_object-id)
 * @param customerEphemeralKey - customer ephemeral key
 * @returns
 */
export const addPaymentMethodToCustomer = async function (
  this: RemedyProductStripe,
  paymentMethodId: string,
  customerId: string,
  customerEphemeralKey: string
): Promise<PaymentMethod | undefined> {
  /* eslint-disable */
  const stripeApiKey = this._apiKey;
  /* eslint-enable */
  if (typeof stripeApiKey !== "string")
    throw new Error("Initialization failed.");

  // make request
  return fetch(`${stripeApiUrl}/payment_methods/${paymentMethodId}/attach`, {
    body: `customer=${customerId}`,
    headers: {
      Authorization: `Bearer ${customerEphemeralKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": `${stripeApiVersion}`,
    },
    method: "POST",
  }).then(responseHandler);
};
