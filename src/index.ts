import {
  loadStripe as loadStripeDefault,
  StripeConstructorOptions,
  Stripe as StripeDefault,
} from "@stripe/stripe-js";
import { StripeExtension } from "./methods/index";

/**
 * Stripe default interface
 */
export interface StripeDefaultWithInternal extends StripeDefault {
  /**
   * Stripe api key after initialization, like pk_...
   */
  _apiKey: string;
}

/**
 * Stripe patched library
 */
export interface Stripe extends StripeExtension, StripeDefault {}

/**
 * Initialize stripe
 *
 * @param publishableKey - stripe public key, like pk_...
 * @param options - stripe initialization options
 * @returns
 */
export const loadStripe = async (
  publishableKey: string,
  options: StripeConstructorOptions | undefined
): Promise<Stripe> => {
  const stripeDefault: StripeDefault | null = await loadStripeDefault(
    publishableKey,
    options
  );
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
