import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <div className="ml-72 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 pt-16">
          {children}
        </main>
      </div>
    </div>
  );
}
