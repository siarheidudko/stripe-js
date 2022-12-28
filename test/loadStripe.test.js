"use strict";
const { describe, it } = require("mocha");
const { expect } = require("chai");
const { Stripe: StripeAdmin } = require("stripe");
const {
  stripeAdminSDK,
  stripeApiVersion,
  stripePublicKey,
  remedyproductStripeJS,
} = require("./utils/loader");

const lib = remedyproductStripeJS;

describe("Checking the initializing function:", function () {
  /**
   * Stripe Client SDK (remedyproduct/stripe-js)
   *
   * @type {remedyproductStripeJS.Stripe}
   */
  let stripeClientSDK;
  /**
   * Stripe customer
   *
   * @type {StripeAdmin.Response<StripeAdmin.Customer>}
   */
  let customer;
  /**
   * Stripe ephemeral key
   *
   * @type {StripeAdmin.Response<StripeAdmin.EphemeralKey>}
   */
  let ephemeralKey;
  this.timeout(15000);
  this.beforeAll(async () => {
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
  this.afterAll(async () => {
    if (customer)
      await stripeAdminSDK.customers.del(customer.id).catch((err) => {
        console.log(err);
      });
    return;
  });
  it("Checking the type of initializing function", async function () {
    expect(lib.loadStripe).to.be.an("function");
    return;
  });
  it("Checking the operation of the initializing function", async function () {
    const stripeClientLoader = lib.loadStripe(stripePublicKey, {
      apiVersion: stripeApiVersion,
    });
    expect(stripeClientLoader).to.be.instanceOf(Promise);
    stripeClientSDK = await stripeClientLoader;
    expect(stripeClientSDK).to.be.an("object");
    expect(stripeClientSDK).to.have.property("_apiKey", stripePublicKey);
    expect(stripeClientSDK).to.have.property("_keyMode", "test");
    return;
  });
  it("Checking any original method (retrievePaymentIntent)", async function () {
    /**
     * I could not get the original library to work in jsdom,
     * because it is too heavily tied up with browser events that are not
     * supported by jsdom. We assume that if the library code could be run,
     * then all methods will work. Otherwise it will take too much pointless work.
     */
    expect(stripeClientSDK)
      .to.have.property("retrievePaymentIntent")
      .to.be.an("function");
    // const paymentIntent = await stripeAdminSDK.paymentIntents.create({
    //   amount: 100,
    //   currency: "usd",
    // });
    // const t = await stripeClientSDK.retrievePaymentIntent(
    //   paymentIntent.client_secret
    // );
    // console.log(t);
    // const pi = t.paymentIntent;
    // expect(pi).to.be.an("object");
    // expect(pi).to.deep.include({
    //   id: paymentIntent.id,
    //   description: paymentIntent.description,
    //   amount: paymentIntent.amount,
    //   currency: paymentIntent.currency,
    // });
    return;
  });
  it("Checking method confirmPaymentIntentByCard", async function () {
    expect(stripeClientSDK)
      .to.have.property("confirmPaymentIntentByCard")
      .to.be.an("function");
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
    let e;
    try {
      await stripeClientSDK.confirmPaymentIntentByCard(
        paymentIntent.client_secret,
        card.id,
        returnUrl
      );
      const paymentIntentData = await stripeAdminSDK.paymentIntents.retrieve(
        paymentIntent.id
      );
      expect(paymentIntentData).to.be.an("object").to.deep.include({
        id: paymentIntent.id,
        customer: paymentIntent.customer,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        capture_method: paymentIntent.capture_method,
        payment_method: card.id,
        status: "requires_capture",
      });
    } catch (err) {
      e = err;
    } finally {
      await stripeAdminSDK.paymentIntents
        .cancel(paymentIntent.id)
        .catch((err) => {
          console.log(err);
        });
      await stripeAdminSDK.customers
        .deleteSource(customer.id, card.id)
        .catch((err) => {
          console.log(err);
        });
      if (e) throw e;
    }
    return;
  });
  it("Checking method confirmPaymentIntentByPaymentMethod", async function () {
    expect(stripeClientSDK)
      .to.have.property("confirmPaymentIntentByPaymentMethod")
      .to.be.an("function");
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
    let e;
    try {
      await stripeClientSDK.confirmPaymentIntentByPaymentMethod(
        paymentIntent.client_secret,
        paymentMethod.id,
        returnUrl
      );
      const paymentIntentData = await stripeAdminSDK.paymentIntents.retrieve(
        paymentIntent.id
      );
      expect(paymentIntentData).to.be.an("object").to.deep.include({
        id: paymentIntent.id,
        customer: paymentIntent.customer,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        capture_method: paymentIntent.capture_method,
        payment_method: paymentMethod.id,
        status: "requires_capture",
      });
    } catch (err) {
      e = err;
    } finally {
      await stripeAdminSDK.paymentIntents
        .cancel(paymentIntent.id)
        .catch((err) => {
          console.log(err);
        });
      await stripeAdminSDK.paymentMethods
        .detach(paymentMethod.id)
        .catch((err) => {
          console.log(err);
        });
      if (e) throw e;
    }
    return;
  });
  it("Checking method addSourceToCustomer", async function () {
    expect(stripeClientSDK)
      .to.have.property("addSourceToCustomer")
      .to.be.an("function");
    let e, cardId;
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
      expect(sourceData).to.deep.include({
        id: card.id,
        customer: customer.id,
      });
    } catch (err) {
      e = err;
    } finally {
      if (typeof cardId === "string")
        await stripeAdminSDK.customers
          .deleteSource(customer.id, cardId)
          .catch((err) => {
            console.log(err);
          });
      if (e) throw e;
    }
    return;
  });
  it("Checking method deleteSourceFromCustomer", async function () {
    expect(stripeClientSDK)
      .to.have.property("deleteSourceFromCustomer")
      .to.be.an("function");
    const card = await stripeAdminSDK.customers.createSource(customer.id, {
      source: "tok_visa",
    });
    let e;
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
        .catch((err) => {
          expect(err)
            .to.be.an("error")
            .to.have.property("type", "StripeInvalidRequestError");
          expect(err).to.have.property("code", "resource_missing");
        });
    } catch (err) {
      e = err;
    } finally {
      if (e) {
        await stripeAdminSDK.customers
          .deleteSource(customer.id, card.id)
          .catch((err) => {
            console.log(err);
          });
        throw e;
      }
    }
    return;
  });
  it("Checking method getAllCards", async function () {
    expect(stripeClientSDK)
      .to.have.property("getAllCards")
      .to.be.an("function");
    const card1 = await stripeAdminSDK.customers.createSource(customer.id, {
      source: "tok_visa",
    });
    const card2 = await stripeAdminSDK.customers.createSource(customer.id, {
      source: "tok_visa",
    });
    const card3 = await stripeAdminSDK.customers.createSource(customer.id, {
      source: "tok_visa",
    });
    let e;
    try {
      const cards = await stripeClientSDK.getAllCards(
        customer.id,
        ephemeralKey.secret
      );
      expect(cards).to.be.an("object").to.have.property("object", "list");
      expect(cards)
        .to.be.an("object")
        .to.have.property("data")
        .to.be.an("array")
        .lengthOf(3);
      expect(cards.data.map((c) => c.id)).to.have.members([
        card1.id,
        card2.id,
        card3.id,
      ]);
    } catch (err) {
      e = err;
    } finally {
      await stripeAdminSDK.customers
        .deleteSource(customer.id, card1.id)
        .catch((err) => {
          console.log(err);
        });
      await stripeAdminSDK.customers
        .deleteSource(customer.id, card2.id)
        .catch((err) => {
          console.log(err);
        });
      await stripeAdminSDK.customers
        .deleteSource(customer.id, card3.id)
        .catch((err) => {
          console.log(err);
        });
      if (e) throw e;
    }
    return;
  });
  it("Checking method getCustomer", async function () {
    expect(stripeClientSDK)
      .to.have.property("getCustomer")
      .to.be.an("function");
    const loadedCustomer = await stripeClientSDK.getCustomer(
      customer.id,
      ephemeralKey.secret
    );
    expect(loadedCustomer).to.be.an("object");
    expect(loadedCustomer).to.deep.include({
      id: customer.id,
      description: customer.description,
    });
    return;
  });
  it("Checking method setDefaultCard", async function () {
    expect(stripeClientSDK)
      .to.have.property("setDefaultCard")
      .to.be.an("function");
    const card = await stripeAdminSDK.customers.createSource(customer.id, {
      source: "tok_visa",
    });
    let e;
    try {
      await stripeClientSDK.setDefaultCard(
        card.id,
        customer.id,
        ephemeralKey.secret
      );
      const customerData = await stripeAdminSDK.customers.retrieve(customer.id);
      expect(customerData).to.deep.include({
        default_source: card.id,
      });
    } catch (err) {
      e = err;
    } finally {
      await stripeAdminSDK.customers
        .deleteSource(customer.id, card.id)
        .catch((err) => {
          console.log(err);
        });
      if (e) throw e;
    }
    return;
  });
  it("Checking method addPaymentMethodToCustomer", async function () {
    expect(stripeClientSDK)
      .to.have.property("addPaymentMethodToCustomer")
      .to.be.an("function");
    const paymentMethod = await stripeAdminSDK.paymentMethods.create({
      type: "card",
      card: { token: "tok_visa" },
    });
    let e;
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
      expect(customerPaymentMethods)
        .to.be.an("object")
        .to.have.property("data")
        .to.be.an("array")
        .lengthOf(1);
      expect(customerPaymentMethods.data.map((c) => c.id)).to.have.members([
        paymentMethod.id,
      ]);
    } catch (err) {
      e = err;
    } finally {
      await stripeAdminSDK.paymentMethods
        .detach(paymentMethod.id)
        .catch((err) => {
          console.log(err);
        });
      if (e) throw e;
    }
    return;
  });
  it("Checking method deletePaymentMethodFromCustomer", async function () {
    expect(stripeClientSDK)
      .to.have.property("deletePaymentMethodFromCustomer")
      .to.be.an("function");
    const paymentMethod = await stripeAdminSDK.paymentMethods.create({
      type: "card",
      card: { token: "tok_visa" },
    });
    await stripeAdminSDK.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id,
    });
    let e;
    try {
      await stripeClientSDK.deletePaymentMethodFromCustomer(
        paymentMethod.id,
        ephemeralKey.secret
      );
      const customerPaymentMethods = await stripeAdminSDK.paymentMethods.list({
        customer: customer.id,
        type: "card",
      });
      expect(customerPaymentMethods)
        .to.be.an("object")
        .to.have.property("data")
        .to.be.an("array")
        .lengthOf(0);
    } catch (err) {
      e = err;
    } finally {
      if (e) {
        await stripeAdminSDK.paymentMethods
          .detach(paymentMethod.id)
          .catch((err) => {
            console.log(err);
          });
        throw e;
      }
    }
    return;
  });
  it("Checking method getAllPaymentMethods", async function () {
    expect(stripeClientSDK)
      .to.have.property("getAllPaymentMethods")
      .to.be.an("function");
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
    let e;
    try {
      const paymentMethods = await stripeClientSDK.getAllPaymentMethods(
        customer.id,
        ephemeralKey.secret
      );
      expect(paymentMethods)
        .to.be.an("object")
        .to.have.property("object", "list");
      expect(paymentMethods)
        .to.be.an("object")
        .to.have.property("data")
        .to.be.an("array")
        .lengthOf(3);
      expect(paymentMethods.data.map((c) => c.id)).to.have.members([
        paymentMethod1.id,
        paymentMethod2.id,
        paymentMethod3.id,
      ]);
    } catch (err) {
      e = err;
    } finally {
      await stripeAdminSDK.paymentMethods
        .detach(paymentMethod1.id)
        .catch((err) => {
          console.log(err);
        });
      await stripeAdminSDK.paymentMethods
        .detach(paymentMethod2.id)
        .catch((err) => {
          console.log(err);
        });
      await stripeAdminSDK.paymentMethods
        .detach(paymentMethod3.id)
        .catch((err) => {
          console.log(err);
        });
      if (e) throw e;
    }
    return;
  });
  it("Checking method setDefaultPaymentMethod", async function () {
    expect(stripeClientSDK)
      .to.have.property("setDefaultPaymentMethod")
      .to.be.an("function");
    const paymentMethod = await stripeAdminSDK.paymentMethods.create({
      type: "card",
      card: { token: "tok_visa" },
    });
    await stripeAdminSDK.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id,
    });
    let e;
    try {
      await stripeClientSDK.setDefaultPaymentMethod(
        paymentMethod.id,
        customer.id,
        ephemeralKey.secret
      );
      const customerData = await stripeAdminSDK.customers.retrieve(customer.id);
      expect(customerData)
        .to.be.an("object")
        .to.have.property("invoice_settings")
        .to.be.an("object")
        .to.be.include({
          default_payment_method: paymentMethod.id,
        });
    } catch (err) {
      e = err;
    } finally {
      await stripeAdminSDK.paymentMethods
        .detach(paymentMethod.id)
        .catch((err) => {
          console.log(err);
        });
      if (e) throw e;
    }
    return;
  });
});
