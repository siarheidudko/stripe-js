import { confirmPaymentIntentByCard } from "./confirmPaymentIntentByCard.js";

/**
 * Confirm payment intent by customer's payment method
 *
 * @param paymentIntentSecret - stripe payment intent secret (see: https://stripe.com/docs/api/payment_intents/object#payment_intent_object-client_secret)
 * @param paymentMethodId - stripe customer payment method id (see: https://stripe.com/docs/api/cards/object#card_object-id)
 * @returns
 */
export const confirmPaymentIntentByPaymentMethod = confirmPaymentIntentByCard;
