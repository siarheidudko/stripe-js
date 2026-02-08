import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { Stripe as StripeAdmin } from "stripe";
import {
  stripeAdminSDK,
  stripeApiVersion,
  stripePublicKey,
  stripeExtensionJS,
  cleanDom,
} from "./utils/loader";

const lib = stripeExtensionJS;
const hasStripeCredentials = Boolean(stripeAdminSDK && stripePublicKey);

describe(
  "Checking the initializing function:",
  { skip: !hasStripeCredentials },
  function () {
  /**
   * Stripe Client SDK (sergdudko/stripe-js)
   */
  let stripeClientSDK: any;
  /**
   * Stripe customer
   */
  let customer: StripeAdmin.Response<StripeAdmin.Customer>;
  /**
   * Stripe ephemeral key
   */
  let ephemeralKey: StripeAdmin.Response<StripeAdmin.EphemeralKey>;

  before(async () => {
    customer = await stripeAdminSDK.customers.create({
      description: "Test customer",
    });
    ephemeralKey = await stripeAdminSDK.ephemeralKeys.create(
      {
        customer: customer.id,
      },
      { apiVersion: stripeApiVersion }
    );
    return;
  });

  after(async () => {
    if (customer)
      await stripeAdminSDK.customers.del(customer.id).catch((err: any) => {
        console.log(err);
      });
    (global as any).window.close();
    cleanDom();
    return;
  });

  it("Checking the type of initializing function", async function () {
    assert.equal(typeof lib.loadStripe, "function");
    return;
  });

  it("Checking the operation of the initializing function", async function () {
    const stripeClientLoader = lib.loadStripe(stripePublicKey, undefined);
    assert.equal(stripeClientLoader instanceof Promise, true);
    stripeClientSDK = await stripeClientLoader;
    assert.equal(typeof stripeClientSDK, "object");
    assert.equal(stripeClientSDK._apiKey, stripePublicKey);
    assert.equal(stripeClientSDK?._keyMode, "test");
    return;
  });

  it("Checking any original method (retrievePaymentIntent)", async function () {
    /**
     * I could not get the original library to work in jsdom,
     * because it is too heavily tied up with browser events that are not
     * supported by jsdom. We assume that if the library code could be run,
     * then all methods will work. Otherwise it will take too much pointless work.
     */
    assert.equal(typeof stripeClientSDK.retrievePaymentIntent, "function");
    return;
  });

  it("Checking method confirmPaymentIntentByCard", async function () {
    assert.equal(typeof stripeClientSDK.confirmPaymentIntentByCard, "function");
    const card = await stripeAdminSDK.customers.createSource(customer.id, {
      source: "tok_visa",
    });
    const paymentIntent = await stripeAdminSDK.paymentIntents.create({
      customer: customer.id,
      amount: 100,
      currency: "usd",
      capture_method: "manual",
    });
    const returnUrl = "https://test.com/test?test=1";
    let e: Error | undefined;
    try {
      await stripeClientSDK.confirmPaymentIntentByCard(
        paymentIntent.client_secret,
        card.id,
        returnUrl
      );
      const paymentIntentData = await stripeAdminSDK.paymentIntents.retrieve(
        paymentIntent.id
      );
      assert.equal(typeof paymentIntentData, "object");
      assert.equal(paymentIntentData.id, paymentIntent.id);
      assert.equal(paymentIntentData.customer, paymentIntent.customer);
      assert.equal(paymentIntentData.amount, paymentIntent.amount);
      assert.equal(paymentIntentData.currency, paymentIntent.currency);
      assert.equal(
        paymentIntentData.capture_method,
        paymentIntent.capture_method
      );
      assert.equal(paymentIntentData.payment_method, card.id);
      assert.equal(paymentIntentData.status, "requires_capture");
    } catch (err) {
      e = err as Error;
    } finally {
      await stripeAdminSDK.paymentIntents
        .cancel(paymentIntent.id)
        .catch((err: any) => {
          console.log(err);
        });
      await stripeAdminSDK.customers
        .deleteSource(customer.id, card.id)
        .catch((err: any) => {
          console.log(err);
        });
      if (e) throw e;
    }
    return;
  });

  it("Checking method confirmPaymentIntentByPaymentMethod", async function () {
    assert.equal(
      typeof stripeClientSDK.confirmPaymentIntentByPaymentMethod,
      "function"
    );
    const paymentMethod = await stripeAdminSDK.paymentMethods.create({
      type: "card",
      card: { token: "tok_visa" },
    });
    await stripeAdminSDK.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id,
    });
    const paymentIntent = await stripeAdminSDK.paymentIntents.create({
      customer: customer.id,
      amount: 100,
      currency: "usd",
      capture_method: "manual",
    });
    const returnUrl = "https://test.com/test?test=1";
    let e: Error | undefined;
    try {
      await stripeClientSDK.confirmPaymentIntentByPaymentMethod(
        paymentIntent.client_secret,
        paymentMethod.id,
        returnUrl
      );
      const paymentIntentData = await stripeAdminSDK.paymentIntents.retrieve(
        paymentIntent.id
      );
      assert.equal(typeof paymentIntentData, "object");
      assert.equal(paymentIntentData.id, paymentIntent.id);
      assert.equal(paymentIntentData.customer, paymentIntent.customer);
      assert.equal(paymentIntentData.amount, paymentIntent.amount);
      assert.equal(paymentIntentData.currency, paymentIntent.currency);
      assert.equal(
        paymentIntentData.capture_method,
        paymentIntent.capture_method
      );
      assert.equal(paymentIntentData.payment_method, paymentMethod.id);
      assert.equal(paymentIntentData.status, "requires_capture");
    } catch (err) {
      e = err as Error;
    } finally {
      await stripeAdminSDK.paymentIntents
        .cancel(paymentIntent.id)
        .catch((err: any) => {
          console.log(err);
        });
      await stripeAdminSDK.paymentMethods
        .detach(paymentMethod.id)
        .catch((err: any) => {
          console.log(err);
        });
      if (e) throw e;
    }
    return;
  });

  it("Checking method addSourceToCustomer", async function () {
    assert.equal(typeof stripeClientSDK.addSourceToCustomer, "function");
    let e: Error | undefined;
    let cardId: string | undefined;
    try {
      const card = await stripeClientSDK.addSourceToCustomer(
        "tok_visa",
        customer.id,
        ephemeralKey.secret
      );
      cardId = card.id;
      const sourceData = await stripeAdminSDK.customers.retrieveSource(
        customer.id,
        card.id
      );
      assert.equal(typeof sourceData, "object");
      assert.equal(sourceData.id, card.id);
      assert.equal(sourceData.customer, customer.id);
    } catch (err) {
      e = err as Error;
    } finally {
      if (typeof cardId === "string")
        await stripeAdminSDK.customers
          .deleteSource(customer.id, cardId)
          .catch((err: any) => {
            console.log(err);
          });
      if (e) throw e;
    }
    return;
  });

  it("Checking method deleteSourceFromCustomer", async function () {
    assert.equal(typeof stripeClientSDK.deleteSourceFromCustomer, "function");
    const card = await stripeAdminSDK.customers.createSource(customer.id, {
      source: "tok_visa",
    });
    let e: Error | undefined;
    try {
      await stripeClientSDK.deleteSourceFromCustomer(
        card.id,
        customer.id,
        ephemeralKey.secret
      );
      await stripeAdminSDK.customers
        .retrieveSource(customer.id, card.id)
        .then(() => {
          return Promise.reject(
            "The source for this customer has not been removed."
          );
        })
        .catch((err: any) => {
          assert.equal(err instanceof Error, true);
          assert.equal(err.type, "StripeInvalidRequestError");
          assert.equal(err.code, "resource_missing");
        });
    } catch (err) {
      e = err as Error;
    } finally {
      if (e) {
        await stripeAdminSDK.customers
          .deleteSource(customer.id, card.id)
          .catch((err: any) => {
            console.log(err);
          });
        throw e;
      }
    }
    return;
  });

  it("Checking method getAllCards", async function () {
    assert.equal(typeof stripeClientSDK.getAllCards, "function");
    const card1 = await stripeAdminSDK.customers.createSource(customer.id, {
      source: "tok_visa",
    });
    const card2 = await stripeAdminSDK.customers.createSource(customer.id, {
      source: "tok_visa",
    });
    const card3 = await stripeAdminSDK.customers.createSource(customer.id, {
      source: "tok_visa",
    });
    let e: Error | undefined;
    try {
      const cards = await stripeClientSDK.getAllCards(
        customer.id,
        ephemeralKey.secret
      );
      assert.equal(typeof cards, "object");
      assert.equal(cards.object, "list");
      assert.equal(Array.isArray(cards.data), true);
      assert.equal(cards.data.length, 3);
      cards.data
        .map((c: any) => c.id)
        .forEach((e: string) => {
          assert.equal([card1.id, card2.id, card3.id].includes(e), true);
        });
    } catch (err) {
      e = err as Error;
    } finally {
      await stripeAdminSDK.customers
        .deleteSource(customer.id, card1.id)
        .catch((err: any) => {
          console.log(err);
        });
      await stripeAdminSDK.customers
        .deleteSource(customer.id, card2.id)
        .catch((err: any) => {
          console.log(err);
        });
      await stripeAdminSDK.customers
        .deleteSource(customer.id, card3.id)
        .catch((err: any) => {
          console.log(err);
        });
      if (e) throw e;
    }
    return;
  });

  it("Checking method getCustomer", async function () {
    assert.equal(typeof stripeClientSDK.getCustomer, "function");
    const loadedCustomer = await stripeClientSDK.getCustomer(
      customer.id,
      ephemeralKey.secret
    );
    assert.equal(typeof loadedCustomer, "object");
    assert.equal(loadedCustomer.id, customer.id);
    assert.equal(loadedCustomer.description, customer.description);
    return;
  });

  it("Checking method setDefaultCard", async function () {
    assert.equal(typeof stripeClientSDK.setDefaultCard, "function");
    const card = await stripeAdminSDK.customers.createSource(customer.id, {
      source: "tok_visa",
    });
    let e: Error | undefined;
    try {
      await stripeClientSDK.setDefaultCard(
        card.id,
        customer.id,
        ephemeralKey.secret
      );
      const customerData = await stripeAdminSDK.customers.retrieve(customer.id);
      assert.equal(typeof customerData, "object");
      assert.equal(customerData.default_source, card.id);
    } catch (err) {
      e = err as Error;
    } finally {
      await stripeAdminSDK.customers
        .deleteSource(customer.id, card.id)
        .catch((err: any) => {
          console.log(err);
        });
      if (e) throw e;
    }
    return;
  });

  it("Checking method addPaymentMethodToCustomer", async function () {
    assert.equal(typeof stripeClientSDK.addPaymentMethodToCustomer, "function");
    const paymentMethod = await stripeAdminSDK.paymentMethods.create({
      type: "card",
      card: { token: "tok_visa" },
    });
    let e: Error | undefined;
    try {
      await stripeClientSDK.addPaymentMethodToCustomer(
        paymentMethod.id,
        customer.id,
        ephemeralKey.secret
      );
      const customerPaymentMethods = await stripeAdminSDK.paymentMethods.list({
        customer: customer.id,
        type: "card",
      });
      assert.equal(typeof customerPaymentMethods, "object");
      assert.equal(Array.isArray(customerPaymentMethods.data), true);
      assert.equal(customerPaymentMethods.data.length, 1);
      assert.equal(
        customerPaymentMethods.data
          .map((c: any) => c.id)
          .includes(paymentMethod.id),
        true
      );
    } catch (err) {
      e = err as Error;
    } finally {
      await stripeAdminSDK.paymentMethods
        .detach(paymentMethod.id)
        .catch((err: any) => {
          console.log(err);
        });
      if (e) throw e;
    }
    return;
  });

  it("Checking method deletePaymentMethodFromCustomer", async function () {
    assert.equal(
      typeof stripeClientSDK.deletePaymentMethodFromCustomer,
      "function"
    );
    const paymentMethod = await stripeAdminSDK.paymentMethods.create({
      type: "card",
      card: { token: "tok_visa" },
    });
    await stripeAdminSDK.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id,
    });
    let e: Error | undefined;
    try {
      await stripeClientSDK.deletePaymentMethodFromCustomer(
        paymentMethod.id,
        ephemeralKey.secret
      );
      const customerPaymentMethods = await stripeAdminSDK.paymentMethods.list({
        customer: customer.id,
        type: "card",
      });
      assert.equal(typeof customerPaymentMethods, "object");
      assert.equal(Array.isArray(customerPaymentMethods.data), true);
      assert.equal(customerPaymentMethods.data.length, 0);
    } catch (err) {
      e = err as Error;
    } finally {
      if (e) {
        await stripeAdminSDK.paymentMethods
          .detach(paymentMethod.id)
          .catch((err: any) => {
            console.log(err);
          });
        throw e;
      }
    }
    return;
  });

  it("Checking method getAllPaymentMethods", async function () {
    assert.equal(typeof stripeClientSDK.getAllPaymentMethods, "function");
    const paymentMethod1 = await stripeAdminSDK.paymentMethods.create({
      type: "card",
      card: { token: "tok_visa" },
    });
    const paymentMethod2 = await stripeAdminSDK.paymentMethods.create({
      type: "card",
      card: { token: "tok_visa" },
    });
    const paymentMethod3 = await stripeAdminSDK.paymentMethods.create({
      type: "card",
      card: { token: "tok_visa" },
    });
    await stripeAdminSDK.paymentMethods.attach(paymentMethod1.id, {
      customer: customer.id,
    });
    await stripeAdminSDK.paymentMethods.attach(paymentMethod2.id, {
      customer: customer.id,
    });
    await stripeAdminSDK.paymentMethods.attach(paymentMethod3.id, {
      customer: customer.id,
    });
    let e: Error | undefined;
    try {
      const paymentMethods = await stripeClientSDK.getAllPaymentMethods(
        customer.id,
        ephemeralKey.secret
      );
      assert.equal(typeof paymentMethods, "object");
      assert.equal(paymentMethods.object, "list");
      assert.equal(Array.isArray(paymentMethods.data), true);
      assert.equal(paymentMethods.data.length, 3);
      paymentMethods.data
        .map((c: any) => c.id)
        .forEach((e: string) => {
          assert.equal(
            [paymentMethod1.id, paymentMethod2.id, paymentMethod3.id].includes(
              e
            ),
            true
          );
        });
    } catch (err) {
      e = err as Error;
    } finally {
      await stripeAdminSDK.paymentMethods
        .detach(paymentMethod1.id)
        .catch((err: any) => {
          console.log(err);
        });
      await stripeAdminSDK.paymentMethods
        .detach(paymentMethod2.id)
        .catch((err: any) => {
          console.log(err);
        });
      await stripeAdminSDK.paymentMethods
        .detach(paymentMethod3.id)
        .catch((err: any) => {
          console.log(err);
        });
      if (e) throw e;
    }
    return;
  });

  it("Checking method setDefaultPaymentMethod", async function () {
    assert.equal(typeof stripeClientSDK.setDefaultPaymentMethod, "function");
    const paymentMethod = await stripeAdminSDK.paymentMethods.create({
      type: "card",
      card: { token: "tok_visa" },
    });
    await stripeAdminSDK.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id,
    });
    let e: Error | undefined;
    try {
      await stripeClientSDK.setDefaultPaymentMethod(
        paymentMethod.id,
        customer.id,
        ephemeralKey.secret
      );
      const customerData = await stripeAdminSDK.customers.retrieve(customer.id);
      assert.equal(typeof customerData, "object");
      assert.equal(typeof customerData.invoice_settings, "object");
      assert.equal(
        customerData.invoice_settings.default_payment_method,
        paymentMethod.id
      );
    } catch (err) {
      e = err as Error;
    } finally {
      await stripeAdminSDK.paymentMethods
        .detach(paymentMethod.id)
        .catch((err: any) => {
          console.log(err);
        });
      if (e) throw e;
    }
    return;
  });
  }
);
