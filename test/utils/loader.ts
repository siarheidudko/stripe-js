import stripe from "stripe";
import { EventEmitter } from "events";
import createJSDom from "jsdom-global";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

// ESM equivalents for __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use require for CommonJS modules
const require = createRequire(import.meta.url);
const stripeExtensionJS = require("../../dist/cjs/index");
const { stripeApiVersion } = require("../../dist/cjs/utils/constants");

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
  const cleanJSDom = createJSDom(htmlData.toString(), {
    url: "https://test.com/",
    referrer: "https://test.com/",
    contentType: "text/html",
    includeNodeLocations: true,
    storageQuota: 10000000,
  });
  let scriptNode: any;
  cleanDom = () => {
    eventEmitter.removeAllListeners();
    (global as any).document.querySelectorAll = (
      global as any
    ).document._querySelectorAll;
    console.warn("An error occurs here that document was not found.");
    cleanJSDom();
    process.exit(process.exitCode);
  };
  (global as any).document._querySelectorAll = (
    global as any
  ).document.querySelectorAll;
  (global as any).document.querySelectorAll = function () {
    const scriptUrl = (arguments as any)[0]?.match(
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
      scriptNode = (global as any).document.createElement("script");
      scriptNode.src = stripeUrl;
      scriptNode.addEventListener = function () {
        eventEmitter.on((arguments as any)[0], (arguments as any)[1]);
      };
      (global as any).document.head.appendChild(scriptNode);
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
    return (global as any).document._querySelectorAll(
      (arguments as any)[0],
      (arguments as any)[1]
    );
  };
};
/**
 * Stripe public key (see: https://dashboard.stripe.com/test/apikeys)
 */
const stripePublicKey = process.env.STRIPE_TEST_PK;
/**
 * Stripe secret key (see: https://dashboard.stripe.com/test/apikeys)
 */
const stripeSecretKey = process.env.STRIPE_TEST_SK;

/**
 * Stripe Admin SDK (server)
 */
const stripeAdminSDK = stripeSecretKey
  ? new stripe(stripeSecretKey, {
      apiVersion: stripeApiVersion as any,
    })
  : undefined;

if (stripePublicKey && stripeSecretKey) {
  createDom();
}

export {
  stripeExtensionJS,
  stripeAdminSDK,
  stripeApiVersion,
  stripePublicKey,
  stripeSecretKey,
  createDom,
  cleanDom,
};
