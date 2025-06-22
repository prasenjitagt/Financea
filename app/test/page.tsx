"use client";

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { createClientFormType, createClientZodSchema } from '@/lib/zod/create_client_zod_schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AiOutlineUser } from 'react-icons/ai';
import { MdOutlineMarkEmailRead } from 'react-icons/md';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CurrencyEnum, DuplicateCheckResponse } from '@/components/invoices/create_invoice_form';
import Swal from 'sweetalert2';
import axios, { AxiosError } from 'axios';
import { check_client_email_route, check_invoice_number_route, clients_route } from '@/lib/helpers/api-endpoints';




export default function Test() {
    const [isAddtionalInfoOpen, setIsAddtionalInfoOpen] = useState<boolean>(false);

    const form = useForm<createClientFormType>({
        resolver: zodResolver(createClientZodSchema),
        defaultValues: {
            clientName: "",
            companyName: "",
            email: "",
            mobile: 0,
            address: "",
            country: "",
            state: "",
            postal: "",
            note: "",
            website: "",
            isClientActive: true,
            userId: "",
            currency: "INR"
        }
    });

    async function onSubmit(formValues: createClientFormType) {
        try {
            console.log("Hello");

            if (!formValues) {
                console.error("Items are missing in create client form");

                Swal.fire({
                    title: "Error!",
                    text: "Items are missing or Unexpected Error!",
                    icon: "error",
                    confirmButtonText: "OK",
                });

                return; // important to stop further execution
            }

            const clientEmail = formValues.email;

            const duplicateCheckResponse = await axios.get<DuplicateCheckResponse>(
                `${check_client_email_route}?email=${clientEmail}`
            );

            if (duplicateCheckResponse.data.exists) {
                Swal.fire({
                    title: "Error!",
                    text: "Email ID already exists!",
                    icon: "error",
                    confirmButtonText: "OK",
                });
                return; // Stop execution if duplicate is found
            }

            const result = await axios.post(clients_route, formValues);

            if (result.status === 200) {
                Swal.fire({
                    title: "Success!",
                    text: "Client Saved Successfully",
                    icon: "success",
                    confirmButtonText: "OK",
                });

                form.reset();
            }
        } catch (error) {
            console.error("Error submitting invoice:", error);

            let errorMessage = "Failed to Save Client";

            if (error instanceof AxiosError) {
                // Type-safe access to Axios error properties
                errorMessage =
                    error.response?.data?.message || error.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            Swal.fire({
                title: "Error!",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "OK",
            });
        }


    }

    function handleNumberInputFocus(
        e: React.FocusEvent<HTMLInputElement>,
        defaultValue: number
    ) {
        if (e.target.value === `${defaultValue}`) {
            e.target.value = "";
        }
    }

    function handleNumberInputBlur(
        e: React.FocusEvent<HTMLInputElement>,
        onChange: (value: number) => void,
        defaultValue: number
    ) {
        if (e.target.value === "") {
            e.target.value = "0";
            onChange(defaultValue);
        }
    }

    return (
        <div className=' h-full flex items-center justify-center'>
            <Card className="w-[450px]">
                <CardHeader className=' flex items-center justify-center '>
                    New Client
                </CardHeader>
                <Separator />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent>



                            <div className=" text-[#747474]">

                                {/* Client Name */}
                                <FormField
                                    control={form.control}
                                    name="clientName"
                                    render={({ field }) => (
                                        <FormItem className='mb-5'>
                                            <FormLabel className="text-[#747474]">Client Name</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <AiOutlineUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#747474] text-xl" />
                                                    <Input
                                                        type='text'
                                                        placeholder='Enter Client Name'
                                                        className="pl-10 text-black"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className='mb-5'>
                                            <FormLabel >Email Address</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <MdOutlineMarkEmailRead className="absolute left-3 top-1/2 transform -translate-y-1/2  text-xl" />
                                                    <Input
                                                        type='email'
                                                        placeholder='Add Email'
                                                        className="pl-10 text-black"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Currency */}
                                <FormField
                                    control={form.control}
                                    name="currency"
                                    render={({ field }) => (
                                        <FormItem

                                        >
                                            <FormLabel>Currency</FormLabel>

                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="text-black w-[163px] cursor-pointer">
                                                        <SelectValue placeholder="Select Currency" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.values(CurrencyEnum).map((currency) => (
                                                        <SelectItem key={currency} value={currency}>
                                                            {currency}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Additional Details */}
                                <section className="mt-5">
                                    <div className='flex items-center justify-center'>
                                        <p
                                            className={`${isAddtionalInfoOpen ? "invisible" : ""} w-fit text-blue-700 cursor-pointer text-sm `}

                                            onClick={() => setIsAddtionalInfoOpen(true)}
                                        >
                                            Add additional details
                                        </p>
                                    </div>
                                    <div className={`${isAddtionalInfoOpen ? "" : "hidden"}`}>

                                        <p className='text-black text-center mb-2' >Additional Information</p>
                                        {/* Mobile */}
                                        <FormField
                                            control={form.control}
                                            name="mobile"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Mobile Number</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="pl-10 text-black"
                                                            placeholder="+91xxxxxxxxx0"
                                                            type="text" // Use "text" to fully control input
                                                            inputMode="decimal" // Shows numeric keyboard on mobile
                                                            {...field}
                                                            onFocus={(e) => handleNumberInputFocus(e, 0)}
                                                            onBlur={(e) =>
                                                                handleNumberInputBlur(e, field.onChange, 0)
                                                            }
                                                            onKeyDown={(e) => {
                                                                const allowedKeys = [
                                                                    "Backspace",
                                                                    "Tab",
                                                                    "Delete",
                                                                    "ArrowLeft",
                                                                    "ArrowRight",
                                                                    "Home",
                                                                    "End",
                                                                ];

                                                                if (
                                                                    allowedKeys.includes(e.key) ||
                                                                    e.ctrlKey ||
                                                                    e.metaKey
                                                                ) {
                                                                    return;
                                                                }

                                                                const isDigit = /^[0-9]$/.test(e.key);
                                                                const isDot = e.key === ".";

                                                                if (!isDigit && !isDot) {
                                                                    e.preventDefault();
                                                                }

                                                                // Only one dot allowed
                                                                if (isDot && e.currentTarget.value.includes(".")) {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />






                                        <div className='mt-3 flex items-center justify-center'>
                                            <p
                                                className="w-fit   text-blue-700 cursor-pointer text-sm "

                                                onClick={() => setIsAddtionalInfoOpen(false)}
                                            >
                                                Close additional details
                                            </p>
                                        </div>
                                    </div>

                                </section>

                            </div>

                        </CardContent>

                        <div className='my-5'>
                            <Separator />
                        </div>

                        <CardFooter className=" justify-center">
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                                className="w-[170px] bg-[#5E84EC] hover:bg-[#7895e3]"
                            >
                                {form.formState.isSubmitting ? "Sending..." : "Send now"}
                            </Button>
                        </CardFooter>



                    </form>

                </Form>
            </Card>
        </div >
    )
}
