const stripe = require("stripe");
const { EventEmitter } = require("events");
const createJSDom = require("jsdom-global");
const { readFileSync } = require("fs");
const { join } = require("path");
const stripeExtensionJS = require("../../lib/index");
const { stripeApiVersion } = require("../../lib/utils/constants");

/**
 * Clearing the stub to create a browser window object
 */
let cleanDom = () => {};
/**
 * A stub for creating a browser window object
 */
const createDom = () => {
  const htmlData = readFileSync(join(__dirname, "./test.html"));
  const eventEmitter = new EventEmitter();
  const cleanJSDom = createJSDom(htmlData, {
    url: "https://test.com/",
    referrer: "https://test.com/",
    contentType: "text/html",
    includeNodeLocations: true,
    storageQuota: 10000000,
  });
  let scriptNode;
  cleanDom = () => {
    eventEmitter.removeAllListeners();
    global.document.querySelectorAll = global.document._querySelectorAll;
    console.warn("An error occurs here that document was not found.");
    cleanJSDom();
    process.exit(process.exitCode);
  };
  global.document._querySelectorAll = global.document.querySelectorAll;
  global.document.querySelectorAll = function () {
    const scriptUrl = arguments[0]?.match(
      /^script\[src\^=(["'])(https?:\/\/[^"']+|\/\/[^"']+|\/[^"']+)\1\]$/i
    )?.[2];
    const isStripeUrl = /^https:\/\/js\.stripe\.com(\/v\d)?\/?$/i.test(
      scriptUrl
    );
    const isNewStripeUrl = /^https:\/\/js\.stripe\.com\/?$/i.test(scriptUrl);
    const stripeUrl = isStripeUrl
      ? isNewStripeUrl
        ? `https://js.stripe.com/basil/stripe.js`
        : `https://js.stripe.com/v3`
      : undefined;
    if (stripeUrl && !scriptNode) {
      scriptNode = global.document.createElement("script");
      scriptNode.src = stripeUrl;
      scriptNode.addEventListener = function () {
        eventEmitter.on(arguments[0], arguments[1]);
      };
      global.document.head.appendChild(scriptNode);
      fetch(stripeUrl)
        .then((response) => response.text())
        .then(async (text) => {
          eval(text);
        })
        .then(() => {
          eventEmitter.emit("load");
        })
        .catch((err) => {
          eventEmitter.emit("error", err);
        });
      return [scriptNode];
    }
    return global.document._querySelectorAll(arguments[0], arguments[1]);
  };
};
createDom();

/**
 * Stripe public key (see: https://dashboard.stripe.com/test/apikeys)
 *
 * @type {String}
 */
const stripePublicKey = process.env.STRIPE_TEST_PK;
/**
 * Stripe secret key (see: https://dashboard.stripe.com/test/apikeys)
 *
 * @type {String}
 */
const stripeSecretKey = process.env.STRIPE_TEST_SK;

/**
 * Stripe Admin SDK (server)
 *
 * @type {stripe.Stripe}
 */
const stripeAdminSDK = stripe(stripeSecretKey, {
  apiVersion: stripeApiVersion,
});

module.exports = {
  stripeExtensionJS,
  stripeAdminSDK,
  stripeApiVersion,
  stripePublicKey,
  stripeSecretKey,
  createDom,
  cleanDom,
};
