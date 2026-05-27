import { loadStripe } from "@stripe/stripe-js";

const VITE_STRIPE_PUBLISHABLE_KEY =
  "pk_test_51Tbcxd0nfGbSkgQzTijr5KF9BddBJ3l412v3uep8ELhxGG588oZaZ0tjeLVRhUysiYjLC0uQkkgtuBDTRKMupPoT00Ufvv6gkS";
export const stripePromise = loadStripe(VITE_STRIPE_PUBLISHABLE_KEY);
