import { confirmPaymentIntentByCard } from "./confirmPaymentIntentByCard";
import { confirmPaymentIntentByPaymentMethod } from "./confirmPaymentIntentByPaymentMethod";
import { addSourceToCustomer } from "./addSourceToCustomer";
import { deleteSourceFromCustomer } from "./deleteSourceFromCustomer";
import { getAllCards } from "./getAllCards";
import { getCustomer } from "./getCustomer";
import { setDefaultCard } from "./setDefaultCard";
import { addPaymentMethodToCustomer } from "./addPaymentMethodToCustomer";
import { deletePaymentMethodFromCustomer } from "./deletePaymentMethodFromCustomer";
import { getAllPaymentMethods } from "./getAllPaymentMethods";
import { setDefaultPaymentMethod } from "./setDefaultPaymentMethod";

/**
 * additional stripe methods
 */
export class StripeExtension {
  constructor(apiKey: string) {
    this._apiKey = apiKey;
  }
  public _apiKey: string;
  public confirmPaymentIntentByCard = confirmPaymentIntentByCard;
  public confirmPaymentIntentByPaymentMethod =
    confirmPaymentIntentByPaymentMethod;
  public addSourceToCustomer = addSourceToCustomer;
  public deleteSourceFromCustomer = deleteSourceFromCustomer;
  public getAllCards = getAllCards;
  public getCustomer = getCustomer;
  public setDefaultCard = setDefaultCard;
  public addPaymentMethodToCustomer = addPaymentMethodToCustomer;
  public deletePaymentMethodFromCustomer = deletePaymentMethodFromCustomer;
  public getAllPaymentMethods = getAllPaymentMethods;
  public setDefaultPaymentMethod = setDefaultPaymentMethod;
}
