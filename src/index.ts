import {
  loadStripe as loadStripeDefault,
  StripeConstructorOptions,
} from "@stripe/stripe-js";
import { StripeExtension } from "./methods/index.js";
import { Stripe, StripeDefaultWithInternal } from "./types.js";

/**
 * Initialize stripe
 *
 * @param publishableKey - stripe public key, like pk_...
 * @param options - stripe initialization options
 * @returns
 */
export const loadStripe = async (
  publishableKey: string,
  options?: StripeConstructorOptions
): Promise<Stripe> => {
  const stripeDefault = await loadStripeDefault(`${publishableKey}`, options);
  if (
    stripeDefault === null ||
    // eslint-disable-next-line no-underscore-dangle
    typeof (stripeDefault as StripeDefaultWithInternal)?._apiKey !== "string"
  )
    throw new Error("Initialization error.");
  const stripeExtension = new StripeExtension(
    // eslint-disable-next-line no-underscore-dangle
    (stripeDefault as StripeDefaultWithInternal)._apiKey
  );
  const stripe: Stripe = Object.assign(stripeDefault, stripeExtension);
  return stripe;
};

// Re-export types for consumers
export type { Stripe, StripeDefaultWithInternal } from "./types.js";
