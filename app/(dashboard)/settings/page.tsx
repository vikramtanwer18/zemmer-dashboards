"use client";

import React, { useState } from "react";
import { SettingsNav } from "@/features/settings/components/settings-nav";
import { SystemHealth } from "@/features/settings/components/system-health";
import { SettingsSection } from "@/features/settings/components/settings-section";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { CustomSelect } from "@/components/ui/custom-select";
import { useAppSelector } from "@/store/hooks";

export default function SettingsPage() {
  const [timezone, setTimezone] = useState("(GMT-05:00) Eastern Time (US & Canada)");
  const user = useAppSelector((state) => state.auth.user);
  const gymName = user?.gymName || user?.gym_name || "Apex Performance Center";
  const avatarUrl = user?.avatarUrl || user?.avatar_url;

  return (
    <div className="p-8 pb-12 max-w-[1200px] mx-auto min-h-screen flex flex-col font-['Inter'] antialiased tracking-tight">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight mb-1">Settings</h2>
          <p className="text-sm text-outline font-medium">Manage your gym profile and administrative preferences.</p>
        </div>
        <Button variant="primary" className="h-11 max-w-[200px] px-6 text-xs shadow-lg shadow-primary/20">
          <Icon name="save" size={18} />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 flex-1">
        {/* Left Column */}
        <div className="md:col-span-4 space-y-8">
          <SettingsNav />
          <SystemHealth />
        </div>

        {/* Right Column */}
        <div className="md:col-span-8 space-y-8">
          {/* Gym Info */}
          <SettingsSection
            title="Gym Info"
            description="Core details of your facility."
            icon="fitness_center"
          >
            <div className="space-y-8">
              {/* Logo Section */}
              <div className="flex items-center gap-6 pb-6 border-b border-outline-variant/10">
                <div className="w-24 h-24 rounded-3xl bg-surface-container-low flex items-center justify-center border-2 border-dashed border-outline-variant/20 overflow-hidden group cursor-pointer relative shadow-sm">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Logo" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="text-primary font-black text-3xl uppercase">{gymName.charAt(0)}</div>
                  )}
                  <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-[2px]">
                    <Icon name="upload" size={24} />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface">Facility Brand Logo</h4>
                  <p className="text-xs text-outline mt-1.5 font-medium leading-relaxed max-w-xs">Used for your public profile, member app, and invoices. SVG or PNG preferred.</p>
                  <button className="text-xs font-black text-primary mt-3 uppercase tracking-widest hover:underline transition-all">Replace Image</button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Gym Name</label>
                  <input
                    className="w-full h-12 px-4 rounded-2xl bg-surface-container-low/40 border border-outline-variant/10 focus:bg-surface-container-lowest focus:border-primary/50 transition-all outline-none font-medium text-sm text-on-surface"
                    type="text"
                    defaultValue={gymName}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Timezone</label>
                  <CustomSelect
                    value={timezone}
                    onChange={setTimezone}
                    options={[
                      { label: "(GMT-05:00) Eastern Time (US & Canada)", value: "(GMT-05:00) Eastern Time (US & Canada)" },
                      { label: "(GMT-08:00) Pacific Time (US & Canada)", value: "(GMT-08:00) Pacific Time (US & Canada)" },
                      { label: "(GMT+00:00) London, United Kingdom", value: "(GMT+00:00) London, United Kingdom" },
                    ]}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </SettingsSection>

          {/* Account */}
          <SettingsSection
            title="Account"
            description="Manage your personal administrative credentials."
            icon="person"
          >
            <div className="space-y-6">
               <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Administrator Name</label>
                  <input
                    className="w-full h-12 px-4 rounded-2xl bg-surface-container-low/40 border border-outline-variant/10 focus:bg-surface-container-lowest focus:border-primary/50 transition-all outline-none font-medium text-sm text-on-surface"
                    type="text"
                    defaultValue={user?.name || "Admin User"}
                  />
                </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Icon name="mail" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
                    <input
                      className="w-full h-12 pl-12 pr-4 rounded-2xl bg-surface-container-low/40 border border-outline-variant/10 focus:bg-surface-container-lowest focus:border-primary/50 transition-all outline-none font-medium text-sm text-on-surface"
                      type="email"
                      defaultValue={user?.email || "alex.rivera@gymos.com"}
                    />
                  </div>
                  <button className="h-12 px-8 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20">
                    Verify Email
                  </button>
                </div>
              </div>
            </div>
          </SettingsSection>

          {/* Danger Zone */}
          <section className="bg-error/5 border border-error/10 rounded-3xl p-8 shadow-sm group">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-error/10 flex items-center justify-center transition-transform group-hover:scale-110">
                <Icon name="warning" size={20} className="text-error" fill />
              </div>
              <h4 className="text-xl font-bold text-error tracking-tight">Advanced Actions</h4>
            </div>
            <p className="text-sm text-on-surface-variant mb-8 font-medium">These actions are permanent and cannot be undone. Exercise extreme caution.</p>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="w-auto border-error/20 text-error hover:bg-error/5 font-black uppercase tracking-widest px-6 h-11 text-[10px] rounded-xl">Archive Gym Data</Button>
              <Button variant="primary" className="w-auto bg-error text-white hover:shadow-lg hover:shadow-error/20 font-black uppercase tracking-widest px-6 h-11 text-[10px] active:scale-95 transition-all rounded-xl">Deactivate Account</Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
