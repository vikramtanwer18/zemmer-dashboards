import React from "react";
import { Icon } from "@/components/ui/icon";
import { RegistrationForm } from "./registration-form";
import Link from "next/link";

export const AuthCard: React.FC = () => {
  return (
    <div className="relative z-10 w-full max-w-[420px] bg-surface-container-lowest rounded-2xl shadow-atmospheric ghost-border overflow-hidden p-8 md:p-10">
      {/* Identity Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-lg mb-6 shadow-lg shadow-primary/20">
          <Icon name="fitness_center" fill className="text-on-primary" />
        </div>
        <h1 className="text-[28px] font-extrabold text-on-surface tracking-tight leading-tight mb-2">
          Create your gym account
        </h1>
        <p className="text-on-surface-variant text-sm font-medium">
          Run your gym, not spreadsheets
        </p>
      </div>

      <RegistrationForm />

      {/* Card Footer */}
      <div className="mt-8 pt-8 border-t border-surface-container-low text-center">
        <p className="text-sm font-medium text-on-surface-variant">
          Already have an account? 
          <Link 
            href="/login" 
            className="text-primary hover:underline underline-offset-4 decoration-2 font-bold ml-1 transition-all"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
