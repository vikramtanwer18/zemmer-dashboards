"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/icon";

interface ModalContextProps {
  isOpen: boolean;
  close: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("Modal components must be wrapped in <Modal />");
  return context;
}

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  maxWidth?: string;
}

export const Modal = ({ children, isOpen, onClose, maxWidth = "max-w-2xl" }: ModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <ModalContext.Provider value={{ isOpen, close: onClose }}>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={onClose}
        />
        <div className={`relative w-full ${maxWidth} bg-surface-container-lowest rounded-[1rem] shadow-2xl flex flex-col max-h-[calc(100vh-2rem)] overflow-hidden border border-white/20`}>
          {children}
        </div>
      </div>
    </ModalContext.Provider>,
    document.body
  );
};

Modal.Header = function ModalHeader({ title, description }: { title: string; description?: string }) {
  const { close } = useModal();
  return (
    <div className="px-6 md:px-10 pt-8 md:pt-10 pb-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-3xl font-black tracking-tighter text-on-surface">{title}</h3>
          {description && <p className="text-on-surface-variant text-sm mt-1 font-medium">{description}</p>}
        </div>
        <button
          onClick={close}
          className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors"
        >
          <Icon name="close" size={24} />
        </button>
      </div>
    </div>
  );
};

Modal.Body = function ModalBody({ children }: { children: React.ReactNode }) {
  return <div className="px-6 md:px-10 pb-8 md:pb-10 flex-1 overflow-y-auto">{children}</div>;
};

Modal.Footer = function ModalFooter({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-4 pt-4">{children}</div>;
};
