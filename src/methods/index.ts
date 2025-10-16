import { confirmPaymentIntentByCard } from "./confirmPaymentIntentByCard.js";
import { confirmPaymentIntentByPaymentMethod } from "./confirmPaymentIntentByPaymentMethod.js";
import { addSourceToCustomer } from "./addSourceToCustomer.js";
import { deleteSourceFromCustomer } from "./deleteSourceFromCustomer.js";
import { getAllCards } from "./getAllCards.js";
import { getCustomer } from "./getCustomer.js";
import { setDefaultCard } from "./setDefaultCard.js";
import { getDefaultCard } from "./getDefaultCard.js";
import { addPaymentMethodToCustomer } from "./addPaymentMethodToCustomer.js";
import { deletePaymentMethodFromCustomer } from "./deletePaymentMethodFromCustomer.js";
import { getAllPaymentMethods } from "./getAllPaymentMethods.js";
import { setDefaultPaymentMethod } from "./setDefaultPaymentMethod.js";

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
  public getDefaultCard = getDefaultCard;
  public addPaymentMethodToCustomer = addPaymentMethodToCustomer;
  public deletePaymentMethodFromCustomer = deletePaymentMethodFromCustomer;
  public getAllPaymentMethods = getAllPaymentMethods;
  public setDefaultPaymentMethod = setDefaultPaymentMethod;
}
