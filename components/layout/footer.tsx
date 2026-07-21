import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    { label: "Terms of Service", href: "#" },
    { label: "Security", href: "#" },

  ];

  return (
    <footer className="w-full px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-4 bg-transparent mt-auto">
      <div className="font-inter text-[12px] font-medium tracking-wide text-on-surface/40">
        © {currentYear} GymOS Performance Systems. Engineered for Excellence.
      </div>
      <div className="flex gap-6">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="font-inter text-[12px] font-medium tracking-wide text-on-surface/40 hover:text-on-surface transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
};
