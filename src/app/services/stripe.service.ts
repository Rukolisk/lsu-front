import { Injectable } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private stripePromise = loadStripe(
    'pk_test_pk_test_51Sd9RERBECMusmGfAyV9jTGhgfTFreOaF7jZKNbV0Dvu1tlsSHfHrXcwxWM1mvTTNAUm1Epu3FcH6L12YouaUMtV00ihd1xcWC'
  ); // ta clé publique test

  async pay() {
    const stripe = await this.stripePromise;

    // Session de test uniquement pour le POC
    const sessionId = 'cs_test_XXXXXXXXXXXXXXXXXXXX'; // tu peux créer une session Checkout test sur ton dashboard Stripe

    if (stripe) {
      window.location.href = `https://buy.stripe.com/test_4gM4gBbq77EWda480E1gs01`;
    }
  }
}
