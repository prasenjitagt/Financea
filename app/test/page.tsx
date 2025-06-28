import CheckoutForm from "@/components/stripe/checkout";
import { stripe } from "@/lib/payments/stripe";

export default async function StripePaymentPage() {
    const calculateOrderAmount = (items: any) => {
        return 1400;
    };

    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount([{ id: "xl-tshirt" }]),
        currency: "eur",
        automatic_payment_methods: {
            enabled: true,
        },
    });

    const clientSecret = paymentIntent.client_secret;

    if (!clientSecret) {
        return <div>Error: Unable to initiate payment.</div>;
    }

    return (
        <div id="checkout">
            <CheckoutForm clientSecret={clientSecret} />
        </div>
    );
}
