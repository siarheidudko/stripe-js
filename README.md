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
