"use client";

import { useState, FormEvent } from "react";
import {
    PaymentElement,
    useStripe,
    useElements,
    Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { Button } from "../ui/button";

// Load the Stripe public key
const stripePublicSecretKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripePublicSecretKey) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined.");
}

const stripePromise = loadStripe(stripePublicSecretKey);

function PaymentForm() {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: "http://localhost:3000/success",
            },
        });

        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message ?? "Payment failed.");
            } else {
                setMessage("An unexpected error occurred.");
            }
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "accordion" as const,
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" options={paymentElementOptions} />
            <Button disabled={isLoading || !stripe || !elements} id="submit">
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner">Loading..</div> : "Pay now"}
                </span>
            </Button>
            {message && <div id="payment-message">{message}</div>}
        </form>
    );
}

interface CheckoutFormProps {
    clientSecret: string;
}

export default function CheckoutForm({ clientSecret }: CheckoutFormProps) {
    const appearance = {
        theme: "stripe" as const,
    };

    const options: StripeElementsOptions = {
        clientSecret,
        appearance,
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            <PaymentForm />
        </Elements>
    );
}

