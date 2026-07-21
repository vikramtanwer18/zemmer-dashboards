"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { InsightBox } from "./insight-box";

interface OnboardingCardProps {
  onStepChange: (step: number) => void;
}

export const OnboardingCard: React.FC<OnboardingCardProps> = ({ onStepChange }) => {
  const [step, setStep] = useState(1);

  const timezones = [
    { label: "Pacific Standard Time (PST)", value: "PST" },
    { label: "Eastern Standard Time (EST)", value: "EST" },
    { label: "Greenwich Mean Time (GMT)", value: "GMT" },
    { label: "Central European Time (CET)", value: "CET" },
    { label: "Indian Standard Time (IST)", value: "IST" },
  ];

  const gymTypes = [
    { label: "Commercial Gym", value: "commercial" },
    { label: "Boutique Studio", value: "boutique" },
    { label: "CrossFit Box", value: "crossfit" },
    { label: "Personal Training Studio", value: "pt" },
  ];

  const handleNext = () => {
    if (step < 3) {
      const nextStep = step + 1;
      setStep(nextStep);
      onStepChange(nextStep);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      const prevStep = step - 1;
      setStep(prevStep);
      onStepChange(prevStep);
    }
  };

  return (
    <div className="bg-surface-container-lowest/70 h-full backdrop-blur-xl rounded-2xl shadow-atmospheric p-6 md:p-10 relative ghost-border border border-white/10">
      {/* Performance Pulse Decorative Element */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
            <div className="space-y-2">
              <label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant">
                Gym Name
              </label>
              <Input icon="store" placeholder="e.g. Iron & Grit Fitness" />
            </div>

            <div className="space-y-2">
              <label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant">
                Timezone
              </label>
              <Select icon="schedule" options={timezones} />
            </div>

            <InsightBox>
              Your timezone settings will be used for automated class scheduling and member renewal notifications.
            </InsightBox>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
            <div className="space-y-2">
              <label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant">
                Facility Type
              </label>
              <Select icon="fitness_center" options={gymTypes} />
            </div>

            <div className="space-y-2">
              <label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant">
                Estimated Capacity
              </label>
              <Input icon="groups" type="number" placeholder="e.g. 500" />
            </div>

            <InsightBox>
              Knowing your capacity helps us optimize your member management and class booking limits.
            </InsightBox>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
            <div className="space-y-2">
              <label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant">
                Primary Contact Number
              </label>
              <Input icon="call" placeholder="+1 (555) 000-0000" />
            </div>

            <div className="space-y-2">
              <label className="block text-[0.75rem] font-bold uppercase tracking-widest text-on-surface-variant">
                Gym Location
              </label>
              <Input icon="location_on" placeholder="123 Fitness Ave, New York" />
            </div>

            <InsightBox>
              This information will be displayed on your member invoices and gym profile page.
            </InsightBox>
          </div>
        )}

        <div className="pt-4 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className={`px-4 py-2 text-sm font-bold transition-all ${step === 1 ? "opacity-0 pointer-events-none" : "text-on-surface-variant hover:text-on-surface"
              }`}
          >
            Back
          </button>
          <Button
            onClick={handleNext}
            className="px-8 md:px-10 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
          >
            {step === 3 ? "Complete Setup" : "Next Step"}
            <Icon name={step === 3 ? "check" : "arrow_forward"} size={18} />
          </Button>
        </div>
      </form>
    </div>
  );
};
