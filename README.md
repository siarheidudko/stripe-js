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

| Method                     | Arguments                                         | Description                                            |
| -------------------------- | ------------------------------------------------- | ------------------------------------------------------ |
| confirmPaymentIntentByCard | [client_secret], [card_id], [returnUrl]           | Confirm payment with the user's payment intent card.   |
| addSourceToCustomer        | [source or token], [customer_id], [ephemeral_key] | Add payment method to customer (from source or token). |
| deleteSourceFromCustomer   | [source_id], [customer_id], [ephemeral_key]       | Delete payment method from customer.                   |
| getAllCards                | [ephemeral_key], [customer_id]                    | Get all cards from customer.                           |
| getCustomer                | [ephemeral_key], [customer_id]                    | Get customer.                                          |
| setDefaultCard             | [defaultCardId], [ephemeral_key], [customer_id]   | Set default card.                                      |

## Examples

```
stripe.confirmPaymentIntentByCard(
  'pi_3Jrk80HdlMaZle3e1tGtSxiH_secret_mWdWNlqJfkYEoYOml1GqRPyPm',
  'card_1JrMi8HdlMaZle3eSPPOvapJ',
  'https://stripe.com/'
);

stripe.addSourceToCustomer(
  'tok_visa',
  'cus_KO9SkBdMeHoMXR',
  'ek_test_YWNjdF8xSFhSd0xIZGxNYVpsZTNlLENrVUxKWWNjZExxSDJDb1VKa1YwaXU5VDZVcmVmQXQ_00drAg7pBQ'
);

stripe.deleteSourceFromCustomer(
  'card_1JroRSHdlMaZle3e4EIGOZuv',
  'cus_KO9SkBdMeHoMXR',
  'ek_test_YWNjdF8xSFhSd0xIZGxNYVpsZTNlLENrVUxKWWNjZExxSDJDb1VKa1YwaXU5VDZVcmVmQXQ_00drAg7pBQ'
);

stripe.getAllCards(
  'ek_test_YWNjdF8xSFhSd0xIZGxNYVpsZTNlLENrVUxKWWNjZExxSDJDb1VKa1YwaXU5VDZVcmVmQXQ_00drAg7pBQ',
  'cus_KO9SkBdMeHoMXR'
);

stripe.getCustomer(
  'ek_test_YWNjdF8xSFhSd0xIZGxNYVpsZTNlLENrVUxKWWNjZExxSDJDb1VKa1YwaXU5VDZVcmVmQXQ_00drAg7pBQ',
  'cus_KO9SkBdMeHoMXR'
);

stripe.setDefaultCard(
  'card_1JrMi8HdlMaZle3eSPPOvapJ',
  'ek_test_YWNjdF8xSFhSd0xIZGxNYVpsZTNlLENrVUxKWWNjZExxSDJDb1VKa1YwaXU5VDZVcmVmQXQ_00drAg7pBQ',
  'cus_KO9SkBdMeHoMXR'
);
```

## Scripts

- To run linting `npm run lint`.
- To run build `npm run build`.
- To run testing `npm run test`.
- To create docs `npm run doc`.
