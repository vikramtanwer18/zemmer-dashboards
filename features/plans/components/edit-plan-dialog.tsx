"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

interface EditPlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  planData?: {
    name: string;
    price: number;
    duration: number;
    freezeDays: number;
  };
}

export const EditPlanDialog: React.FC<EditPlanDialogProps> = ({ 
  isOpen, 
  onClose,
  planData
}) => {
  const [freezeDays, setFreezeDays] = useState(planData?.freezeDays ?? 7);

  const data = planData ?? { name: "Elite Performance Pro", price: 129, duration: 30, freezeDays: 7 };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header 
        title="Edit Membership Plan" 
        description="Configure the parameters for your elite tier plans." 
      />
      <Modal.Body>
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          {/* Plan Name */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Plan Name</label>
            <div className="relative">
              <input 
                className="w-full bg-surface-container-lowest border-0 focus:ring-2 focus:ring-primary rounded-2xl py-4 px-5 text-on-surface font-bold placeholder:text-outline-variant outline outline-variant/15 transition-all" 
                type="text" 
                defaultValue={data.name}
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-primary opacity-40">
                <Icon name="label" size={20} />
              </div>
            </div>
          </div>

          {/* Price & Duration Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Price (USD)</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-on-surface-variant opacity-60">$</span>
                <input 
                  className="w-full bg-surface-container-lowest border-0 focus:ring-2 focus:ring-primary rounded-2xl py-4 pl-10 pr-5 text-on-surface font-bold outline outline-variant/15 transition-all" 
                  type="number" 
                  defaultValue={data.price}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Duration (days)</label>
              <div className="relative">
                <input 
                  className="w-full bg-surface-container-lowest border-0 focus:ring-2 focus:ring-primary rounded-2xl py-4 px-5 text-on-surface font-bold outline outline-variant/15 transition-all" 
                  type="number" 
                  defaultValue={data.duration}
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-on-surface-variant opacity-60 uppercase">Days</span>
              </div>
            </div>
          </div>

          {/* Freeze Days Counter */}
          <div className="bg-surface-container-low p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant">Freeze Days</label>
                <p className="text-[10px] text-on-surface-variant/70 mt-1 font-bold">Maximum pause duration allowed.</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={() => setFreezeDays(Math.max(0, freezeDays - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm text-primary active:scale-95 transition-transform border border-outline-variant/10"
                >
                  <Icon name="remove" size={20} />
                </button>
                <span className="text-xl font-black w-8 text-center">{freezeDays}</span>
                <button 
                  type="button"
                  onClick={() => setFreezeDays(freezeDays + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-on-primary shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                >
                  <Icon name="add" size={20} />
                </button>
              </div>
            </div>
          </div>

          <Modal.Footer>
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 py-4 bg-surface-container-high text-primary font-bold rounded-2xl hover:bg-surface-container-highest border-none"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              className="flex-1 py-4 font-bold rounded-2xl shadow-lg shadow-primary/20"
            >
              Save Plan
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
};
