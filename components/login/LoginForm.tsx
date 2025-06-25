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
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { loginSchema, LoginSchemaType } from "@/lib/helpers/validations";
import Link from "next/link";
import { Card } from "../ui/card";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
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

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl,
      });

      console.log("SignIn result:", result); // Debug log

      if (result?.error) {
        // More specific error handling
        if (result.error === "CredentialsSignin") {
          setError("Invalid email or password");
        } else {
          setError(result.error);
        }
      } else {
        console.log("Login successful, redirecting to:", callbackUrl);
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error("Login error:", error); // Debug log
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[400px] relative shadow-none ">
        <div className="p-6  flex flex-col gap-6">
          <button className="absolute top-4 right-4">
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
          <div>
            <h2 className="text-2xl font-sans mb-1">Log in</h2>
            <p className="text-sm dark:text-gray-100 ">
              Create an account?{" "}
              <Link href="/signup" className="text-[#5E84EC] text-sm">
                Sign up
              </Link>
            </p>
          </div>

          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="font-normal text-sm">
                        Email address
                      </FormLabel>
                      <FormControl>
                        <input
                          placeholder="example@gmail.com"
                          type="email"
                          {...field}
                          className="w-full p-2.5 border font-normal text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-[#000000]"
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
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="font-normal text-sm">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••"
                            {...field}
                            className="w-full p-2.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#000000] pr-10 font-normal text-sm"
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer"
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
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
                  className="w-full h-10 bg-[#5E84EC] font-regular text-white rounded-md hover:bg-[#7292e9] transition-colors mt-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <ImSpinner2 className="w-6 h-6 animate-spin text-center text-gray-50" />
                    </div>
                  ) : (
                    "Log In"
                  )}
                </Button>
              </form>
            </Form>
          </div>
          <div className="gap-6 flex flex-col">
            <div className=" flex items-center gap-2">
              {" "}
              <div className=" flex-1 h-px bg-gray-300"></div>{" "}
              <p className="text-xs text-gray-400 text-center">
                Or log in with your email
              </p>
              <div className=" flex-1 h-px bg-gray-300"></div>
            </div>
            <div className="border hover:bg-gray-50 p-2 w-full flex justify-center rounded-md">
              <Image
                src="/Google.png"
                alt="Google Logo"
                width={24}
                height={20}
                className="inline mr-2"
              />
              Continue with Google
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
