import { z } from "zod";

export const createClientZodSchema = z.object({
    clientName: z
        .string({ required_error: "Client Name is required" })
        .min(1, "Client Name is required"),

    companyName: z
        .string({ required_error: "Company Name is required" })
        .min(1, "Company Name is required"),

    email: z
        .string({ required_error: "Email is required" })
        .email("Please enter a valid email address."),

    mobile: z
        .coerce
        .number({ required_error: "Mobile number is required" })
        .refine((val) => val.toString().length === 10, {
            message: "Mobile number must be exactly 10 digits",
        }),

    address: z
        .string({ required_error: "Address is required" })
        .min(1, "Address is required"),

    postal: z
        .string({ required_error: "Postal code is required" })
        .min(6, "Postal code must be at least 6 characters"),

    state: z
        .string({ required_error: "State is required" })
        .min(1, "State is required"),

    country: z
        .string({ required_error: "Country is required" })
        .min(1, "Country is required"),

    note: z
        .string()
        .optional(),

    website: z
        .string({ required_error: "Website is required" })
        .url("Website must be a valid URL"),

    isClientActive: z
        .boolean({ required_error: "Client status is required" }),

    userId: z
        .string({ required_error: "User ID is required" }),
    currency: z
        .enum(["INR", "USD"], {
            required_error: "Currency is required",
        }),


});

export type createClientFormType = z.infer<typeof createClientZodSchema>;
