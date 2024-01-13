import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51OV5WXDtJMUZfyWcOuRtt6O8rKemTbLaax24GyBKPcsN3IsFe04TmnoIAJe1FBvk6JTJZY264xoxl3B01kaMWnHX00j2JHfUOm',
);

export const bookTour = async (tourId) => {
  try {
    const session = await axios(
      `/api/bookings/checkout-session/${tourId}`,
    );
    // console.log(session);
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
