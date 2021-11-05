import { confirmPaymentIntentByCard } from "./confirmPaymentIntentByCard";
import { addSourceToCustomer } from "./addSourceToCustomer";
import { deleteSourceFromCustomer } from "./deleteSourceFromCustomer";

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
}
