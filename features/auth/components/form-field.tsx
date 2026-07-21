import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, id, ...props }) => {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input id={id} {...props} />
      </div>
    </div>
  );
};
