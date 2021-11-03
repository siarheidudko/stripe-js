import { PaymentIntentResult } from "@stripe/stripe-js";
import { responseHandler } from "../utils/handlers";
import { stripeApiUrl } from "../utils/constants";
import { getApiKey } from "../utils/store";

/**
 * Confirm payment intent by customer's card
 *
 * @param paymentIntentSecret - stripe payment intent secret
 * @param paymentMethodId - stripe customer payment method id
 * @returns
 */
export const confirmPaymentIntentByCard = async (
  paymentIntentSecret: string,
  paymentMethodId: string
): Promise<PaymentIntentResult | undefined> => {
  const stripeApiKey = getApiKey() as string;
  if (typeof stripeApiKey !== "string")
    throw new Error("Initialization failed.");

  // make request
  const paymentIntentId = paymentIntentSecret.replace(/_secret_.+$/i, "");
  return fetch(
    `${stripeApiUrl}/v1/payment_intents/${paymentIntentId}/confirm?client_secret=${paymentIntentSecret}`,
    {
      body: `payment_method=${paymentMethodId}`,
      headers: {
        Authorization: `Bearer ${stripeApiKey}`,
        "Content-Type": `application/x-www-form-urlencoded`,
      },
      method: `POST`,
    }
  ).then(responseHandler);
};
