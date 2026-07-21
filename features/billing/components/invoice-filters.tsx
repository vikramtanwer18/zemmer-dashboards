import React from "react";
import { Icon } from "@/components/ui/icon";
import { FormInput } from "@/components/ui/form-input";
import { CustomSelect } from "@/components/ui/custom-select";

interface InvoiceFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
}

export const InvoiceFilters: React.FC<InvoiceFiltersProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
}) => {
  return (
    <div className="p-6 border-b border-outline-variant/10 flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full">
        <FormInput
          placeholder="Search invoices, members, or IDs..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          icon="search"
          className="w-full"
        />
      </div>
      <div className="flex items-center gap-3 w-full md:w-auto">
        <CustomSelect
          value={status}
          onChange={onStatusChange}
          options={[
            { label: "All Statuses", value: "" },
            { label: "Pending", value: "PENDING" },
            { label: "Paid", value: "PAID" },
            { label: "Overdue", value: "OVERDUE" },
          ]}
          className="w-full md:w-[200px]"
        />
      </div>
    </div>
  );
};
