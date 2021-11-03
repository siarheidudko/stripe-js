# @remedyproduct/stripe-js

Additional methods for working with stripe-js

[![npm](https://img.shields.io/npm/v/@remedyproduct/stripe-js.svg)](https://www.npmjs.com/package/@remedyproduct/stripe-js)
[![npm](https://img.shields.io/npm/dy/@remedyproduct/stripe-js.svg)](https://www.npmjs.com/package/@remedyproduct/stripe-js)
[![NpmLicense](https://img.shields.io/npm/l/@remedyproduct/stripe-js.svg)](https://www.npmjs.com/package/@remedyproduct/stripe-js)
![GitHub last commit](https://img.shields.io/github/last-commit/remedyproduct/stripe-js.svg)
![GitHub release](https://img.shields.io/github/release/remedyproduct/stripe-js.svg)

## Usage

### `loadStripe`

```js
import { loadStripe } from "@remedyproduct/stripe-js";

const stripe = await loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");
```

## Stripe.js Documentation

- [Stripe.js Docs](https://stripe.com/docs/stripe-js)
- [Stripe.js Reference](https://stripe.com/docs/js)
- [React Stripe.js Docs](https://stripe.com/docs/stripe-js/react)

## Additional Methods

| Method                     | Arguments                  | Description                                          |
| -------------------------- | -------------------------- | ---------------------------------------------------- |
| confirmPaymentIntentByCard | [client_secret], [card_id] | Confirm payment with the user's payment intent card. |

## Scripts

- To run linting `npm run lint`.
- To run build `npm run build`.
- To run testing `npm run test`.
- To create docs `npm run doc`.
