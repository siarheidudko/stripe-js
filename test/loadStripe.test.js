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
  this.timeout(30000);
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
  it("Checking any original method getCustomer", async function () {
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
  it("Checking method confirmPaymentIntentByCard", async function () {
    expect(stripeClientSDK)
      .to.have.property("confirmPaymentIntentByCard")
      .to.be.an("function");
    return;
  });
  it("Checking method addSourceToCustomer", async function () {
    expect(stripeClientSDK)
      .to.have.property("addSourceToCustomer")
      .to.be.an("function");
    return;
  });
  it("Checking method deleteSourceFromCustomer", async function () {
    expect(stripeClientSDK)
      .to.have.property("deleteSourceFromCustomer")
      .to.be.an("function");
    return;
  });
  it("Checking method getAllCards", async function () {
    expect(stripeClientSDK)
      .to.have.property("getAllCards")
      .to.be.an("function");
    return;
  });
  it("Checking method getCustomer", async function () {
    expect(stripeClientSDK)
      .to.have.property("getCustomer")
      .to.be.an("function");
    return;
  });
  it("Checking method setDefaultCard", async function () {
    expect(stripeClientSDK)
      .to.have.property("setDefaultCard")
      .to.be.an("function");
    return;
  });
  it("Checking method addPaymentMethodToCustomer", async function () {
    expect(stripeClientSDK)
      .to.have.property("addPaymentMethodToCustomer")
      .to.be.an("function");
    return;
  });
  it("Checking method deletePaymentMethodFromCustomer", async function () {
    expect(stripeClientSDK)
      .to.have.property("deletePaymentMethodFromCustomer")
      .to.be.an("function");
    return;
  });
  it("Checking method getAllPaymentMethods", async function () {
    expect(stripeClientSDK)
      .to.have.property("getAllPaymentMethods")
      .to.be.an("function");
    return;
  });
  it("Checking method setDefaultPaymentMethod", async function () {
    expect(stripeClientSDK)
      .to.have.property("setDefaultPaymentMethod")
      .to.be.an("function");
    return;
  });
});
