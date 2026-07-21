"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";

interface NavItemProps {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
  variant?: "default" | "error";
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  icon,
  label,
  active,
  variant = "default",
}) => {
  const baseStyles =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm group";
  const variants = {
    default: active
      ? "bg-primary/10 text-primary font-bold shadow-[inset_4px_0_0_0_currentColor]"
      : "text-on-surface-variant hover:bg-surface-container-highest/50",
    error: "text-error hover:bg-error-container/20 font-semibold",
  };

  return (
    <Link href={href} className={`${baseStyles} ${variants[variant]}`}>
      <Icon 
        name={icon} 
        fill={active} 
        size={22} 
        className={`${active ? 'text-primary' : 'text-outline group-hover:text-on-surface'}`} 
      />
      <span>{label}</span>
      {active && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
      )}
    </Link>
  );
};

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin/dashboard", icon: "dashboard", label: "Dashboard" },
    { href: "/admin/earnings", icon: "payments", label: "Earnings" },
    { href: "/admin/analytics", icon: "monitoring", label: "Analytics" },
    { href: "/admin/gym-owners", icon: "manage_accounts", label: "Gym Owners" },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-surface font-['Inter'] antialiased tracking-tight text-sm p-4 flex flex-col gap-2 z-50 border-r border-outline-variant/30">
      <div className="flex items-center gap-3 px-2 mb-8 mt-2">
        <div className="w-11 h-11 bg-primary-container rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/10">
          <Icon name="shield" fill size={26} />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tighter text-on-surface uppercase leading-none">
            GymOS <span className="text-primary text-[10px] align-top bg-primary/10 px-1.5 py-0.5 rounded ml-1">HQ</span>
          </h1>
          <p className="text-[10px] text-outline font-bold uppercase tracking-widest mt-1">
            Admin Control
          </p>
        </div>
      </div>

      <div className="px-4 mb-2">
        <p className="text-[10px] font-bold text-outline uppercase tracking-[0.2em]">Administration</p>
      </div>

      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            {...item}
            active={isActive(item.href)}
          />
        ))}
      </nav>

      <div className="mt-auto pt-4 flex flex-col gap-1 border-t border-outline-variant/20">
        <NavItem href="/admin/settings" icon="settings" label="System Settings" />
        <NavItem href="/logout" icon="logout" label="Logout" variant="error" />
      </div>

      <div className="mt-6 p-4 bg-surface-container-low rounded-2xl border ghost-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-bold text-on-surface">System Optimal</span>
        </div>
        <p className="text-[10px] text-on-surface-variant leading-relaxed">
          v2.4.1 Production Build
        </p>
      </div>
    </aside>
  );
};
