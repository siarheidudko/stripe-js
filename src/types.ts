import {
  StripeConstructorOptions,
  Stripe as StripeDefault,
} from "@stripe/stripe-js";

/**
 * Stripe default interface with internal properties
 */
export interface StripeDefaultWithInternal extends StripeDefault {
  /**
   * Stripe api key after initialization, like pk_...
   */
  _apiKey: string;
}

/**
 * Base interface for Stripe extension methods
 */
export interface StripeExtensionMethods {
  /**
   * Confirm payment intent by card
   */
  confirmPaymentIntentByCard(
    clientSecret: string,
    cardId: string,
    returnUrl: string
  ): Promise<any>;

  /**
   * Confirm payment intent by payment method
   */
  confirmPaymentIntentByPaymentMethod(
    clientSecret: string,
    paymentMethodId: string,
    returnUrl: string
  ): Promise<any>;

  /**
   * Add source to customer
   */
  addSourceToCustomer(
    token: string,
    customerId: string,
    ephemeralKey: string
  ): Promise<any>;

  /**
   * Delete source from customer
   */
  deleteSourceFromCustomer(
    sourceId: string,
    customerId: string,
    ephemeralKey: string
  ): Promise<any>;

  /**
   * Get all cards for customer
   */
  getAllCards(customerId: string, ephemeralKey: string): Promise<any>;

  /**
   * Get customer data
   */
  getCustomer(customerId: string, ephemeralKey: string): Promise<any>;

  /**
   * Get default card
   */
  getDefaultCard(
    customerId: string,
    ephemeralKey: string
  ): Promise<string | undefined>;

  /**
   * Set default card
   */
  setDefaultCard(
    cardId: string,
    customerId: string,
    ephemeralKey: string
  ): Promise<any>;

  /**
   * Add payment method to customer
   */
  addPaymentMethodToCustomer(
    paymentMethodId: string,
    customerId: string,
    ephemeralKey: string
  ): Promise<any>;

  /**
   * Delete payment method from customer
   */
  deletePaymentMethodFromCustomer(
    paymentMethodId: string,
    ephemeralKey: string
  ): Promise<any>;

  /**
   * Get all payment methods for customer
   */
  getAllPaymentMethods(customerId: string, ephemeralKey: string): Promise<any>;

  /**
   * Set default payment method
   */
  setDefaultPaymentMethod(
    paymentMethodId: string,
    customerId: string,
    ephemeralKey: string
  ): Promise<any>;
}

/**
 * Extended Stripe interface combining default Stripe with extensions
 */
export interface Stripe extends StripeExtensionMethods, StripeDefault {}

/**
 * Load Stripe function type
 */
export type LoadStripeFunction = (
  publishableKey: string,
  options?: StripeConstructorOptions
) => Promise<Stripe>;
