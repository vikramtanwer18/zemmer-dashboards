"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

interface OtpFormProps {
  length?: number;
  onSubmit: (code: string) => Promise<void> | void;
  onResend?: () => Promise<void> | void;
  submitting?: boolean;
  resending?: boolean;
  submitLabel?: string;
}

export const OtpForm: React.FC<OtpFormProps> = ({
  length = 6,
  onSubmit,
  onResend,
  submitting = false,
  resending = false,
  submitLabel = "Verify",
}) => {
  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length }, () => ""),
  );
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    setLocalError(null);
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!text) return;
    e.preventDefault();
    const next = Array.from({ length }, (_, i) => text[i] ?? "");
    setDigits(next);
    const focusIdx = Math.min(text.length, length - 1);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length !== length) {
      setLocalError(`Enter the full ${length}-digit code`);
      return;
    }
    await onSubmit(code);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <div
        className="flex justify-center gap-2 md:gap-3"
        aria-label="One-time password"
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            aria-label={`Digit ${index + 1}`}
            className={`w-12 h-14 md:w-14 md:h-16 text-center text-xl font-bold bg-surface-container-lowest border rounded-lg text-on-surface transition-all focus:outline-none ${
              localError
                ? "border-error ring-2 ring-error"
                : "border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20"
            }`}
          />
        ))}
      </div>

      {localError && (
        <p role="alert" className="text-xs font-semibold text-error text-center">
          {localError}
        </p>
      )}

      <div className="space-y-4">
        <Button type="submit" loading={submitting}>
          {submitting ? "Verifying…" : submitLabel}
          {!submitting && <Icon name="arrow_forward" size={20} />}
        </Button>

        {onResend && (
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => onResend()}
              disabled={resending}
              className="text-sm font-bold text-primary hover:text-primary-container transition-colors inline-flex items-center gap-2 group disabled:opacity-60"
            >
              {resending ? "Resending…" : "Resend Code"}
              <Icon
                name="refresh"
                size={18}
                className="group-hover:rotate-180 transition-transform duration-700"
              />
            </button>
          </div>
        )}
      </div>
    </form>
  );
};
