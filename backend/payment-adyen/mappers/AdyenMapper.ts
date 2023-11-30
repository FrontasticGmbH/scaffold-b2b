import { SessionResponse, PaymentDetailsResponse } from '../Session';

export class AdyenMapper {
  static adyenSessionResponseToSessionResponse(sessionResponse: SessionResponse) {
    return sessionResponse;
  }

  static adyenPaymentDetailsToDetails(paymentDetails: PaymentDetailsResponse) {
    return paymentDetails;
  }
}
