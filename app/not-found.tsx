import React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export default function NotFound() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-8">
      {/* Brand Header */}
      <header className="fixed top-0 left-0 w-full flex items-center justify-between px-8 h-20 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
        <div className="text-2xl font-black tracking-tighter text-on-surface flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
            <Icon name="fitness_center" size={18} fill />
          </div>
          GymOS
        </div>
        <div className="flex gap-4">
          <button className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-outline hover:text-primary transition-all">
            <Icon name="help_outline" size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center w-full max-w-2xl px-6 text-center z-10 pt-16">
        {/* Visual Container */}
        <div className="bg-surface-container-lowest p-6 rounded-[2.5rem] shadow-atmospheric mb-10 relative border border-outline-variant/10 group">
          <div className="absolute -top-4 -right-4 h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-on-primary shadow-xl shadow-primary/25 z-20 transition-transform group-hover:rotate-12">
            <Icon name="bolt" size={24} fill />
          </div>

          <div className="relative rounded-2xl overflow-hidden aspect-video">
            <img
              className="w-full h-[250px] object-cover transition-transform duration-1000 group-hover:scale-105"
              alt="404 Gym Space"
              src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/20 to-transparent"></div>
          </div>
        </div>

        {/* Copy */}
        <div className="space-y-4 mb-10">
          <h2 className="text-4xl font-black text-on-surface tracking-tighter leading-tight">Routine not found.</h2>
          <p className="text-sm text-outline font-medium leading-relaxed max-w-md mx-auto">
            The page you're looking for has been re-racked or moved to another section. Don't let this miss break your momentum—let's get you back to training.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/"
            className="h-12 px-8 bg-primary text-on-primary rounded-xl font-bold text-xs tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-95"
          >
            <Icon name="dashboard" size={18} fill />
            Go to Dashboard
          </Link>
          <button className="h-12 px-8 bg-surface-container-low text-on-surface rounded-xl font-bold text-xs tracking-widest hover:bg-white border border-outline-variant/10 transition-all flex items-center gap-2 active:scale-95">
            Contact Support
            <Icon name="arrow_forward" size={18} />
          </button>
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="fixed bottom-12 left-12 hidden lg:flex flex-col gap-2 opacity-10 pointer-events-none">
        <div className="h-1.5 w-24 bg-primary rounded-full"></div>
        <div className="h-1.5 w-16 bg-primary rounded-full"></div>
        <div className="h-1.5 w-32 bg-primary rounded-full"></div>
      </div>

      <div className="fixed -bottom-24 -right-24 transform opacity-[0.02] pointer-events-none select-none">
        <Icon name="monitoring" size={400} fill />
      </div>

      {/* Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
    </div>
  );
}
