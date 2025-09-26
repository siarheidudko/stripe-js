# @sergdudko/stripe-js

Supercharge Your Stripe Integration with Enhanced Methods for stripe-js: Take Full Control of Customer Card Management Right from Your Frontend! Elevate Your Payment Processing Capabilities with Ease and Efficiency.

[![npm](https://img.shields.io/npm/v/@sergdudko/stripe-js.svg)](https://www.npmjs.com/package/@sergdudko/stripe-js)
[![npm](https://img.shields.io/npm/dy/@sergdudko/stripe-js.svg)](https://www.npmjs.com/package/@sergdudko/stripe-js)
[![NpmLicense](https://img.shields.io/npm/l/@sergdudko/stripe-js.svg)](https://www.npmjs.com/package/@sergdudko/stripe-js)
![GitHub last commit](https://img.shields.io/github/last-commit/siarheidudko/stripe-js.svg)
![GitHub release](https://img.shields.io/github/release/siarheidudko/stripe-js.svg)

## 🚀 What's New in v2.0.0

- ✅ **Dual Package**: Full support for both CommonJS and ES Modules
- ✅ **TypeScript**: Complete type definitions and TypeScript source
- ✅ **Optimized Types**: Shared type definitions for smaller bundle size
- ✅ **TypeScript Tests**: All tests converted to TypeScript with `node --test --import tsx`
- ✅ **Better Tree-shaking**: Optimized module structure for better bundling

## Usage

### ES Modules (Recommended)

```typescript
import { loadStripe } from "@sergdudko/stripe-js";

const stripe = await loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");
```

### CommonJS

```javascript
const { loadStripe } = require("@sergdudko/stripe-js");

const stripe = await loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");
```

## Stripe.js Documentation

- [Stripe.js Docs](https://stripe.com/docs/stripe-js)
- [Stripe.js Reference](https://stripe.com/docs/js)
- [React Stripe.js Docs](https://stripe.com/docs/stripe-js/react)

## Additional Methods

| Method                              | Arguments                                           | Description                                                                  |
| ----------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------- |
| getCustomer                         | [customer_id], [ephemeral_key]                      | Get customer.                                                                |
| confirmPaymentIntentByCard          | [client_secret], [card_id], [returnUrl]             | Confirm payment intent with the user's payment card (sources api).           |
| addSourceToCustomer                 | [source or token], [customer_id], [ephemeral_key]   | Add payment card to customer (from source or token, sources api).            |
| deleteSourceFromCustomer            | [source_id], [customer_id], [ephemeral_key]         | Delete payment card from customer (sources api).                             |
| getAllCards                         | [customer_id], [ephemeral_key]                      | Get all cards from customer (sources api).                                   |
| setDefaultCard                      | [defaultCardId], [customer_id], [ephemeral_key]     | Set default card (sources api).                                              |
| getDefaultCard                      | [customer_id], [ephemeral_key]                      | Get customer default payment card (sources api).                             |
| confirmPaymentIntentByPaymentMethod | [client_secret], [payment_method_id], [returnUrl]   | Confirm payment intent with the user's payment method (payment methods api). |
| addPaymentMethodToCustomer          | [payment_method_id], [customer_id], [ephemeral_key] | Attach payment method to customer (payment methods api).                     |
| deletePaymentMethodFromCustomer     | [payment_method_id], [ephemeral_key]                | Detach payment method from customer (payment methods api).                   |
| getAllPaymentMethods                | [customer_id], [ephemeral_key]                      | Get all payment methods from customer (payment methods api).                 |
| setDefaultPaymentMethod             | [payment_method_id], [customer_id], [ephemeral_key] | Set customer default payment method (payment methods api).                   |

## Examples

```
stripe.getCustomer(
  'cus_KO9SkBdMeHoMXR',
  'ek_test_YWNjdF8xSFhSd0xIZGxNYVpsZTNlLENrVUxKWWNjZExxSDJDb1VKa1YwaXU5VDZVcmVmQXQ_00drAg7pBQ'
);

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
  'cus_KO9SkBdMeHoMXR',
  'ek_test_YWNjdF8xSFhSd0xIZGxNYVpsZTNlLENrVUxKWWNjZExxSDJDb1VKa1YwaXU5VDZVcmVmQXQ_00drAg7pBQ'
);

stripe.setDefaultCard(
  'card_1JrMi8HdlMaZle3eSPPOvapJ',
  'cus_KO9SkBdMeHoMXR',
  'ek_test_YWNjdF8xSFhSd0xIZGxNYVpsZTNlLENrVUxKWWNjZExxSDJDb1VKa1YwaXU5VDZVcmVmQXQ_00drAg7pBQ'
);

stripe.getDefaultCard(
  'cus_KO9SkBdMeHoMXR',
  'ek_test_YWNjdF8xSFhSd0xIZGxNYVpsZTNlLENrVUxKWWNjZExxSDJDb1VKa1YwaXU5VDZVcmVmQXQ_00drAg7pBQ'
);

stripe.confirmPaymentIntentByPaymentMethod(
  'pi_3Jrk80HdlMaZle3e1tGtSxiH_secret_mWdWNlqJfkYEoYOml1GqRPyPm',
  'pm_1JrMi8HdlMaZle3eSPPOvapJ',
  'https://stripe.com/'
);

stripe.addPaymentMethodToCustomer(
  'pm_1JrMi8HdlMaZle3eSPPOvapJ',
  'cus_KO9SkBdMeHoMXR',
  'ek_test_YWNjdF8xSFhSd0xIZGxNYVpsZTNlLENrVUxKWWNjZExxSDJDb1VKa1YwaXU5VDZVcmVmQXQ_00drAg7pBQ'
);

stripe.deletePaymentMethodFromCustomer(
  'pm_1JrMi8HdlMaZle3eSPPOvapJ',
  'ek_test_YWNjdF8xSFhSd0xIZGxNYVpsZTNlLENrVUxKWWNjZExxSDJDb1VKa1YwaXU5VDZVcmVmQXQ_00drAg7pBQ'
);

stripe.getAllPaymentMethods(
  'cus_KO9SkBdMeHoMXR',
  'ek_test_YWNjdF8xSFhSd0xIZGxNYVpsZTNlLENrVUxKWWNjZExxSDJDb1VKa1YwaXU5VDZVcmVmQXQ_00drAg7pBQ'
);

stripe.setDefaultPaymentMethod(
  'pm_1JrMi8HdlMaZle3eSPPOvapJ',
  'cus_KO9SkBdMeHoMXR',
  'ek_test_YWNjdF8xSFhSd0xIZGxNYVpsZTNlLENrVUxKWWNjZExxSDJDb1VKa1YwaXU5VDZVcmVmQXQ_00drAg7pBQ'
);
```

## Scripts

- To run linting `npm run lint`.
- To run build `npm run build`.
- To run testing `npm run test`.
- To create docs `npm run doc`.

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🆘 Support

- 📝 **Issues**: [GitHub Issues](https://github.com/siarheidudko/stripe-js/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/siarheidudko/stripe-js/discussions)
- 📧 **Email**: [siarhei@dudko.dev](mailto:siarhei@dudko.dev)

## 💝 Support This Project

If my Stripe JS Extension helps you build amazing applications, consider supporting its development:

- ☕ **[Buy me a coffee](https://www.buymeacoffee.com/dudko.dev)**
- 💳 **[PayPal](https://paypal.me/dudkodev)**
- 🎯 **[Patreon](https://patreon.com/dudko_dev)**
- 🌐 **[More options](http://dudko.dev/donate)**

Your support helps maintain and improve Redux Cluster for the entire community!

---

**Made with ❤️ by [Siarhei Dudko](https://github.com/siarheidudko)**
