import {
  loadStripe as loadStripeDefault,
  StripeConstructorOptions,
  Stripe as StripeDefault,
} from "@stripe/stripe-js";
import { additionalMethods } from "./methods";
import { setApiKey } from "./utils/store";

/**
 * Stripe default interface
 */
interface StripeDefaultWithInternal extends StripeDefault {
  /**
   * Stripe api key after initialization, like pk_...
   */
  _apiKey: string;
}

/**
 * Stripe patched interface
 */
export interface Stripe extends StripeDefaultWithInternal, additionalMethods {}

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
) => {
  const stripeDefault: StripeDefault | null = await loadStripeDefault(
    publishableKey,
    options
  );
  if (
    stripeDefault === null ||
    typeof (stripeDefault as StripeDefaultWithInternal)?._apiKey !== "string"
  )
    throw new Error("Initialization error.");
  const apiKey = (stripeDefault as StripeDefaultWithInternal)._apiKey;
  setApiKey(apiKey);
  const methods = new additionalMethods();

  const stripe: Stripe = {
    _apiKey: apiKey,
    ...stripeDefault,
    ...methods,
  };

  return stripe;
};
