import { z } from "zod";

export const createClientZodSchema = z.object({
    clientName: z
        .string({ required_error: "Client Name is required" })
        .min(1, "Client Name is required"),

    email: z
        .string({ required_error: "Email is required" })
        .email("Please enter a valid email address."),

    currency: z
        .enum(["INR", "USD"], {
            required_error: "Currency is required",
        }),


    companyName: z
        .string().min(1, "Company Name is required").optional(),

    mobile: z
        .string()
        .optional(),

    address: z
        .string()
        .min(1, "Address is required")
        .optional(),

    postal: z
        .string()
        .min(6, "Postal code must be at least 6 characters")
        .optional(),


    state: z
        .string()
        .min(1, "State is required")
        .optional(),

    country: z
        .string()
        .min(1, "Country is required")
        .optional(),

    note: z
        .string()
        .optional(),

    website: z
        .string()
        .url("Website must be a valid URL")
        .optional(),

    isClientActive: z
        .boolean({ required_error: "Client status is required" }),




});

export type createClientFormType = z.infer<typeof createClientZodSchema>;
