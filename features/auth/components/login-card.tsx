import React from "react";
import { LoginForm } from "./login-form";
import { SocialLogin } from "./social-login";
import Link from "next/link";

export const LoginCard: React.FC = () => {
  return (
    <div className="w-full max-w-[440px]">
      <div className="flex flex-col  mt-8 items-center mb-10">

        <h1 className="text-[2.75rem] font-bold tracking-tighter text-on-surface leading-tight text-center">
          Welcome back
        </h1>
        <p className="text-on-surface-variant font-medium mt-2">
          Enter your credentials to continue
        </p>
      </div>

      <div className="bg-surface-container-lowest ghost-border rounded-xl p-8 shadow-atmospheric">
        <LoginForm />
        <SocialLogin />
      </div>

      <p className="text-center mt-8 text-sm font-medium text-on-surface-variant">
        New to the ecosystem?
        <Link href="/register" className="text-primary font-bold hover:underline ml-1">
          Create account
        </Link>
      </p>
    </div>
  );
};
