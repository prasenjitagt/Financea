import React, { Suspense } from 'react'
import LoginForm from "@/components/login/LoginForm";
import "@/app/globals.css";

const Login = () => {
  return (
    <div className="font-['Archivo'] flex justify-center items-center">
      <Suspense fallback={<div>Loading login form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}

export default Login