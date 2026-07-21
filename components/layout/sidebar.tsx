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
    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm";
  const variants = {
    default: active
      ? "bg-primary/10 text-primary font-bold shadow-[inset_3px_0_0_0_currentColor]"
      : "text-on-surface-variant hover:bg-surface-container-highest/50",
    error: "text-error hover:bg-error-container/20 font-semibold",
  };

  return (
    <Link href={href} className={`${baseStyles} ${variants[variant]}`}>
      <Icon name={icon} fill={active} size={22} />
      <span>{label}</span>
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
    { href: "/members", icon: "group", label: "Members" },
    { href: "/leads", icon: "contact_phone", label: "Leads" },
    { href: "/schedule", icon: "calendar_month", label: "Operations" },
    { href: "/staff", icon: "badge", label: "Staff" },
    { href: "/plans", icon: "card_membership", label: "Plans" },
    { href: "/billing", icon: "payments", label: "Billing" },
    { href: "/analytics", icon: "monitoring", label: "Analytics" },
    { href: "/settings", icon: "settings", label: "Settings" },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-surface font-['Inter'] antialiased tracking-tight text-sm p-4 flex flex-col gap-2 z-50 border-r border-slate-200">
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-white">
          <Icon name="fitness_center" fill />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tighter text-on-surface uppercase leading-none">
            GymOS
          </h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
            Management Portal
          </p>
        </div>
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

      <div className="mt-auto pt-4 flex flex-col gap-1 border-t border-slate-200/50">
        <NavItem href="/logout" icon="logout" label="Logout" variant="error" />
      </div>
    </aside>
  );
};
