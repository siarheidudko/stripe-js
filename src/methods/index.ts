import { confirmPaymentIntentByCard } from "./confirmPaymentIntentByCard";
import { addSourceToCustomer } from "./addSourceToCustomer";
import { deleteSourceFromCustomer } from "./deleteSourceFromCustomer";

/**
 * additional stripe methods
 */
export class AdditionalMethods {
  public confirmPaymentIntentByCard = confirmPaymentIntentByCard;
  public addSourceToCustomer = addSourceToCustomer;
  public deleteSourceFromCustomer = deleteSourceFromCustomer;
}
