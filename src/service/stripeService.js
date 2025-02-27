import { loadStripe } from "@stripe/stripe-js";

const stripePromise =loadStripe(process.env.VUE_APP_PUBLISHABLE_KEY);

export const redirectToCheckout = async (sessionId) => {
    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId });
};
