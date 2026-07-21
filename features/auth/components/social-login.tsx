import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export const SocialLogin: React.FC = () => {
  return (
    <div className="mt-8 pt-8 border-t border-outline-variant/30">
      <div className="relative flex items-center justify-center mb-6">
        <span className="absolute bg-surface-container-lowest px-4 text-[10px] uppercase font-bold tracking-widest text-outline">
          Or secure access via
        </span>
        <div className="w-full h-[1px] bg-outline-variant/20"></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-11 font-semibold text-sm">
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Google
        </Button>
        <Button variant="outline" className="h-11 font-semibold text-sm">
          <Icon name="key" size={20} />
          SSO
        </Button>
      </div>
    </div>
  );
};
