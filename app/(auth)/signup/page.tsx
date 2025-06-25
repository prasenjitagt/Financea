"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import "@/app/globals.css";
import { signIn } from "next-auth/react";
import axios from "axios";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setEmailError("Invalid Email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/auth/signup", {
        username: fullName,
        email: email,
        password: password,
      });

      if (response.data.user) {
        const signInResult = await signIn("credentials", {
          email: email,
          password: password,
          redirect: true,
          callbackUrl: "/",
        });

        if (signInResult?.error) {
          throw new Error("Login failed");
        }
      } else {
        throw new Error("Signup failed");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen font-['Archivo'] ">
      <div className="bg-white rounded-lg shadow-none w-[358px] p-6 relative border">
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

        <h2 className="text-2xl font-sans mb-1">Sign up</h2>
        <p className="text-sm text-gray-600 mb-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#5E84EC] font-normal">
            Log in
          </Link>
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="full-name"
              className="block text-sm font-medium mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="full-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5C2FA8] font-normal text-sm"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className={` font-normal text-sm w-full p-2.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#000000] ${emailError ? "border-red-700" : "border-gray-300"}`}
              placeholder="example@gmail.com"
              required
            />
            {emailError && (
              <p className="text-red-700 text-xs mt-1">{emailError}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className=" font-normal text-sm w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#000000] pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-500 ">
              Use 8 or more characters with a mix of letters, numbers & symbols
            </p>
          </div>
          <button
            type="submit"
            className="w-full h-10 bg-[#5E84EC] text-white text-sm font-normal rounded-md hover:bg-[#7292e9] transition-colors"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <div className="gap-6 flex flex-col mt-6">
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
    </div>
  );
}
