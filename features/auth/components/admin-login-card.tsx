import React from "react";
import { AdminLoginForm } from "./admin-login-form";
import Link from "next/link";

export const AdminLoginCard: React.FC = () => {
  return (
    <div className="w-full max-w-[440px]">
      <div className="flex flex-col mt-8 items-center mb-10">
        <h1 className="text-[2.75rem] font-bold tracking-tighter text-on-surface leading-tight text-center">
          Admin Portal
        </h1>
        <p className="text-on-surface-variant font-medium mt-2">
          Secure access for administrators
        </p>
      </div>

      <div className="bg-surface-container-lowest ghost-border rounded-xl p-8 shadow-atmospheric">
        <AdminLoginForm />
      </div>

      <p className="text-center mt-8 text-sm font-medium text-on-surface-variant">
        Not an admin?
        <Link href="/login" className="text-primary font-bold hover:underline ml-1">
          Return to Member Login
        </Link>
      </p>
    </div>
  );
};
