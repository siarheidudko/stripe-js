import { confirmPaymentIntentByCard } from "./confirmPaymentIntentByCard";
import { addSourceToCustomer } from "./addSourceToCustomer";
import { deleteSourceFromCustomer } from "./deleteSourceFromCustomer";
import { getAllCards } from "./getAllCards";
import { getCustomer } from "./getCustomer";
import { setDefaultCard } from "./setDefaultCard";

/**
 * additional stripe methods
 */
export class RemedyProductStripe {
  constructor(apiKey: string) {
    this._apiKey = apiKey;
  }
  public _apiKey: string;
  public confirmPaymentIntentByCard = confirmPaymentIntentByCard;
  public addSourceToCustomer = addSourceToCustomer;
  public deleteSourceFromCustomer = deleteSourceFromCustomer;
  public getAllCards = getAllCards;
  public getCustomer = getCustomer;
  public setDefaultCard = setDefaultCard;
}
