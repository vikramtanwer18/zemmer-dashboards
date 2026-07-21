"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProgressStepper } from "@/features/onboarding/components/progress-stepper";
import { OnboardingCard } from "@/features/onboarding/components/onboarding-card";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="min-h-screen flex flex-col bg-surface relative overflow-x-hidden">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 relative">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-primary/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-secondary/5 rounded-full blur-[120px]"></div>
        </div>

        <div className="w-full max-w-5xl z-10 space-y-12">
          <div className="space-y-6">
            <ProgressStepper currentStep={currentStep} totalSteps={3} />

            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-on-surface mb-3 uppercase">
                {currentStep === 1 && "Configure Your Gym"}
                {currentStep === 2 && "Facility Details"}
                {currentStep === 3 && "Contact Info"}
              </h1>
              <p className="text-on-surface-variant text-sm md:text-base max-w-md mx-auto leading-relaxed">
                {currentStep === 1 && "Let's get the foundation of your digital workspace ready."}
                {currentStep === 2 && "Help us tailor the experience to your specific facility needs."}
                {currentStep === 3 && "Finalize your profile to start managing your members."}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-10">
            {/* Side Image (Desktop) */}
            <div className="hidden md:block w-full max-w-[450px] relative rounded-2xl overflow-hidden bg-surface-container-lowest/50 backdrop-blur-xl border border-white/10 ghost-border group">
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-high/80 via-transparent to-transparent z-10"></div>
              <img
                alt="Modern Gym Interior"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src="/gym-interior.png"
              />
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <div className="w-10 h-1 bg-primary rounded-full mb-3"></div>
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface/60 leading-tight">
                  Premium Gym Management <br /> Architecture
                </p>
              </div>
            </div>

            <div className="flex-1  max-w-xl">
              <OnboardingCard onStepChange={(step) => setCurrentStep(step)} />
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex justify-center items-center gap-8 opacity-30 grayscale transition-all hover:opacity-50">
            <img
              alt="Security Certification"
              className="h-5 w-auto"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBshpXt134BOXjXLvRyXpGDlxzJ7eC0DZD3jMUDYwUEkoSavGNP_eAvpY5TPaK95AZmd_MsamDVq15gIPSgSK5vSyuZCKRSfUXoC3rW8FQXJKWFVcE6jdAOXSbu9fwWOUEchgMEfy3wGHuSy7XHdptYLUvrWBBqLXmc-IAzGYSj0GR6LBmuhccE820gi4Mt4BX7-FYyqYpNNSRDE9_HHgC5RbDryXkFkIyJ6bJiqTUoyRnBSw1RcusZ6y6IfCqvsueAI18e02sdbw4"
            />
            <img
              alt="Cloud Partner"
              className="h-5 w-auto"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwINHqNiYGjwJcFHtO3roiOriB2ah0FjvfZduFm56Bnjso3b6JgHaRKaBRP0fr44ApSHjcfnNP490PM_3PMSAPXrsv6DPPh8LxN_hvUvPIVMyr3XvHjEdQ7ZX3LTCUnf3GBMa9QuEPggaXFeAUvWoBOmgFPH566Te3Jj6OiARt4PKnt7GlVHwEsfcryrEpG76lfaLrFymplrFdmnKVDdu5RHO7H3h5Hb6c9ZuqXwjT10eWidFzp4akYOahFKcTsSYyUwkrEzQIeUQ"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
