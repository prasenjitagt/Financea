"use client";

import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ImSpinner2 } from "react-icons/im";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { loginSchema, LoginSchemaType } from "@/lib/helpers/validations";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(prev => !prev);
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginSchemaType) {
    setIsLoading(true);
    setError(null);

    console.log('Attempting login with:', data); // Debug log

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      console.log('SignIn result:', result); // Debug log

      if (result?.error) {
        // More specific error handling
        if (result.error === "CredentialsSignin") {
          setError("Invalid email or password");
        } else {
          setError(result.error);
        }
      } else {
        console.log('Login successful, redirecting to:', callbackUrl);
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error('Login error:', error); // Debug log
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative md:mt-10 mt-8">
      <div className="p-6">
        <button className="absolute top-5 right-4">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4L4 12"
              stroke="#000"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 4L12 12"
              stroke="#000"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="flex justify-center mb-6 py-2">
          <Image src="/FinanceaLogo.png" alt="Financea Logo" width={170} height={60} />
        </div>

        <h2 className="text-2xl font-semibold mb-1">Log in</h2>
        <p className="text-lg text-gray-600 mb-4">
          Create an account?{" "}
          <Link href="/signup" className="text-[#5C2FA8] font-medium text-lg">
            Sign up
          </Link>
        </p>
        <Form {...form}>

          <form onSubmit={form.handleSubmit(onSubmit)} >

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel className="block text-xl mb-1 md:py-2">Email address</FormLabel>
                  <FormControl>
                    <input
                      placeholder="example@gmail.com"
                      type="email"
                      {...field}
                      className="w-full p-2.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#5C2FA8]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-10">
                  <FormLabel className="block text-xl mb-1 md:py-2">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••"
                        {...field}
                        className="w-full p-2.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#5C2FA8] pr-10"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            {error && (
              <p className="text-sm font-medium text-destructive">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="default"
              className="w-full h-[45px] bg-[#5C2FA8] text-xl font-semibold text-white py-4 rounded-md hover:bg-purple-700 transition-colors"
              disabled={isLoading}>
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <ImSpinner2 className="w-6 h-6 animate-spin text-center text-gray-50" />
                </div>
              ) : "Log In"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}