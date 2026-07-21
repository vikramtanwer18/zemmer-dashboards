import React from "react";

interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="mb-8 text-center">
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2 block">
        Step {currentStep} of {totalSteps}
      </span>
      <div className="flex gap-2 h-1 w-full max-w-xs mx-auto mb-6">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-full ${
              i < currentStep ? "bg-primary" : "bg-surface-container-highest"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
