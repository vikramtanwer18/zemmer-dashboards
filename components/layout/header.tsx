import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const Header: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        <Link 
          href="/" 
          className="text-2xl font-black tracking-tighter text-on-surface pointer-events-auto"
        >
          GymOS
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          <Link href="#" className="text-sm uppercase font-semibold text-on-surface-variant hover:text-primary transition-colors">
            Support
          </Link>
          <Link href="#" className="text-sm uppercase font-semibold text-on-surface-variant hover:text-primary transition-colors">
            Privacy
          </Link>
          <Button variant="primary" className="h-10 px-5 text-xs w-auto">
            Sign In
          </Button>
        </div>
      </div>
    </nav>
  );
};
