import React from 'react';
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from '../ui/separator';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { useForm } from 'react-hook-form';
import { createClientFormType, createClientZodSchema } from '@/lib/zod/create_client_zod_schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { CurrencyEnum } from '../invoices/create_invoice_form';



export default function CreateClientForm() {

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
        //     try {
        //       if (!formValues || !formValues.items || formValues.items.length === 0) {
        //         console.error("Items are missing or not an array!");

        //         Swal.fire({
        //           title: "Error!",
        //           text: "Items are missing or Unexpected Error!",
        //           icon: "error",
        //           confirmButtonText: "OK",
        //         });

        //         return; // important to stop further execution
        //       }

        //       const invoiceNumber = formValues.invoiceNumber;

        //       const duplicateCheckResponse = await axios.get<DuplicateCheckResponse>(
        //         `${check_invoice_number_route}?invoiceNumber=${invoiceNumber}`
        //       );

        //       if (duplicateCheckResponse.data.exists) {
        //         Swal.fire({
        //           title: "Error!",
        //           text: "Invoice number already exists! Please choose a unique invoice number.",
        //           icon: "error",
        //           confirmButtonText: "OK",
        //         });
        //         return; // Stop execution if duplicate is found
        //       }

        //       const result = await axios.post(create_new_invoice_route, formValues);

        //       if (result.status === 200) {
        //         Swal.fire({
        //           title: "Success!",
        //           text: "Invoice Created Successfully",
        //           icon: "success",
        //           confirmButtonText: "OK",
        //         });

        //         form.reset();
        //       }
        //     } catch (error) {
        //       console.error("Error submitting invoice:", error);

        //       let errorMessage = "Failed to create invoice";

        //       if (error instanceof AxiosError) {
        //         // Type-safe access to Axios error properties
        //         errorMessage =
        //           error.response?.data?.message || error.message || errorMessage;
        //       } else if (error instanceof Error) {
        //         errorMessage = error.message;
        //       }

        //       Swal.fire({
        //         title: "Error!",
        //         text: errorMessage,
        //         icon: "error",
        //         confirmButtonText: "OK",
        //       });
        //     }
    }




    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <DialogContent className="w-[457px]">
                    <DialogHeader>
                        <DialogTitle className=' flex items-center justify-center h-[28px]'>New Client</DialogTitle>
                        <Separator />
                        {/* <DialogDescription>
                        Make changes to your profile here. Click save when you&apos;re
                        done.
                    </DialogDescription> */}
                    </DialogHeader>
                    <div className="">

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
                                                className="pl-10" // Add left padding to avoid overlapping the icon
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
                                    <FormLabel className="text-[#747474]">Email Address</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <MdOutlineMarkEmailRead className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#747474] text-xl" />
                                            <Input
                                                type='email'
                                                placeholder='Add Email'
                                                className="pl-10" // Add left padding to avoid overlapping the icon
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Currency</FormLabel>

                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-[163px] cursor-pointer">
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
                        /> */}

                        {/* Additional Details */}
                        <section>

                        </section>

                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>


                <footer>

                </footer>
            </form>

        </Form>

    )
}
