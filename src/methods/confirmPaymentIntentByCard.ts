import { PaymentIntentResult } from "@stripe/stripe-js";
import { responseHandler } from "../utils/handlers";
import { stripeApiUrl, stripeApiVersion } from "../utils/constants";
import { RemedyProductStripe } from "./index";

/**
 * Confirm payment intent by customer's card
 *
 * @param paymentIntentSecret - stripe payment intent secret (see: https://stripe.com/docs/api/payment_intents/object#payment_intent_object-client_secret)
 * @param paymentMethodId - stripe customer payment method id (see: https://stripe.com/docs/api/cards/object#card_object-id)
 * @returns
 */
export const confirmPaymentIntentByCard = async function (
  this: RemedyProductStripe,
  paymentIntentSecret: string,
  paymentMethodId: string
): Promise<PaymentIntentResult["paymentIntent"] | undefined> {
  /* eslint-disable */
  const stripeApiKey = this._apiKey;
  /* eslint-enable */
  if (typeof stripeApiKey !== "string")
    throw new Error("Initialization failed.");

  // make request
  const paymentIntentId = paymentIntentSecret.replace(/_secret_.+$/i, "");
  return fetch(
    `${stripeApiUrl}/payment_intents/${paymentIntentId}/confirm?client_secret=${paymentIntentSecret}`,
    {
      body: `payment_method=${paymentMethodId}`,
      headers: {
        Authorization: `Bearer ${stripeApiKey}`,
        "Content-Type": `application/x-www-form-urlencoded`,
        "Stripe-Version": `${stripeApiVersion}`,
      },
      method: `POST`,
    }
  ).then(responseHandler);
};
