"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { 
  fetchAdminGymDetails, 
  updateAdminGym, 
  deleteAdminGym 
} from "@/store/slices/adminAnalytics.slice";
import { PageLoader } from "@/components/ui/states";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { toast } from "sonner";

export default function GymOwnerDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedGym, loading, error } = useAppSelector((state) => state.adminAnalytics);

  // States for Confirmation Dialogs
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchAdminGymDetails(id as string));
    }
  }, [dispatch, id]);

  const handleSuspendToggle = async () => {
    const isCurrentlyActive = selectedGym.status?.toUpperCase() === "ACTIVE";
    const newStatus = isCurrentlyActive ? "SUSPENDED" : "ACTIVE";
    
    setIsSubmitting(true);
    const action = await dispatch(updateAdminGym({ id: id as string, data: { status: newStatus } }));
    setIsSubmitting(false);
    
    if (updateAdminGym.fulfilled.match(action)) {
      toast.success(`Gym ${isCurrentlyActive ? "suspended" : "activated"} successfully`);
      setIsSuspendDialogOpen(false);
      dispatch(fetchAdminGymDetails(id as string));
    } else {
      toast.error("Action failed");
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    const action = await dispatch(deleteAdminGym(id as string));
    setIsSubmitting(false);
    if (deleteAdminGym.fulfilled.match(action)) {
      toast.success("Gym deleted successfully");
      router.push("/admin/gym-owners");
    } else {
      toast.error("Failed to delete gym");
    }
  };

  if (loading && !selectedGym) return <PageLoader />;
  if (error) return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-4">
        <Icon name="error" className="text-rose-500" size={32} />
      </div>
      <h2 className="text-xl font-bold text-on-surface">Error Loading Details</h2>
      <p className="text-on-surface-variant mt-2">{error}</p>
      <button 
        onClick={() => router.back()}
        className="mt-6 bg-primary text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20"
      >
        Go Back
      </button>
    </div>
  );

  if (!selectedGym) return null;

  const isCurrentlyActive = selectedGym.status?.toUpperCase() === "ACTIVE";
  const isSuspended = selectedGym.status?.toUpperCase() === "SUSPENDED";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary transition-all"
        >
          <Icon name="arrow_back" size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">{selectedGym.name}</h1>
          <p className="text-on-surface-variant text-sm mt-0.5">Partner Profile & Network Performance</p>
        </div>
        <div className="ml-auto flex gap-3">
          <button className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2">
            <Icon name="contact_mail" size={18} />
            Contact Owner
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface-container-lowest p-8 rounded-2xl border ghost-border shadow-atmospheric">
            <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
              <Icon name="info" className="text-primary" size={20} />
              Owner Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-outline font-black uppercase tracking-widest">Full Name</p>
                  <p className="text-sm font-bold text-on-surface mt-1">{selectedGym.owner.email?.split('@')[0] || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-outline font-black uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-bold text-on-surface mt-1">{selectedGym.owner.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-outline font-black uppercase tracking-widest">Phone Number</p>
                  <p className="text-sm font-bold text-on-surface mt-1">{selectedGym.owner.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-outline font-black uppercase tracking-widest">Gym Location</p>
                  <p className="text-sm font-bold text-on-surface mt-1">{selectedGym.address}, {selectedGym.city}</p>
                </div>
                <div>
                  <p className="text-[10px] text-outline font-black uppercase tracking-widest">Subscription Plan</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-black uppercase tracking-tighter">
                      {selectedGym.plan.name}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-outline font-black uppercase tracking-widest">Partner Since</p>
                  <p className="text-sm font-bold text-on-surface mt-1">{new Date(selectedGym.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-2xl border ghost-border shadow-atmospheric">
            <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
              <Icon name="analytics" className="text-primary" size={20} />
              Platform Usage
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Total Members', value: selectedGym.stats.members, icon: 'group', color: 'bg-emerald-50 text-emerald-600' },
                { label: 'Staff Users', value: selectedGym.stats.staff, icon: 'badge', color: 'bg-indigo-50 text-indigo-600' },
                { label: 'Monthly Classes', value: selectedGym.stats.classes, icon: 'event', color: 'bg-amber-50 text-amber-600' },
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-xl bg-surface-container-low/50 border ghost-border">
                  <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                    <Icon name={stat.icon} size={20} />
                  </div>
                  <p className="text-[10px] text-outline font-black uppercase tracking-widest">{stat.label}</p>
                  <p className="text-xl font-black text-on-surface mt-1">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-on-surface p-8 rounded-2xl text-surface shadow-atmospheric">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-surface/50">Account Status</h3>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold">Status</span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${!isSuspended ? 'bg-emerald-400 text-on-surface' : 'bg-rose-400 text-white'}`}>
                {selectedGym.status}
              </span>
            </div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold">Network Access</span>
              <span className={`text-xs font-black uppercase ${!isSuspended ? 'text-emerald-400' : 'text-rose-400'}`}>
                {!isSuspended ? 'Unrestricted' : 'Suspended'}
              </span>
            </div>
            <button 
              onClick={() => setIsSuspendDialogOpen(true)}
              className={`w-full mt-4 py-3 border rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${
                isCurrentlyActive 
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white'
              }`}
            >
              {isCurrentlyActive ? 'Suspend Partner' : 'Activate Partner'}
            </button>
            <button 
              onClick={() => setIsDeleteDialogOpen(true)}
              className="w-full mt-3 py-3 border border-rose-500/10 text-rose-500/50 rounded-xl text-[10px] font-bold hover:text-rose-500 transition-all uppercase tracking-widest"
            >
              Delete Permanently
            </button>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-2xl border ghost-border shadow-atmospheric">
            <h3 className="text-sm font-bold text-on-surface mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { label: 'Profile Updated', time: '2 days ago' },
                { label: 'Plan Upgrade', time: '1 month ago' },
                { label: 'Billing Payment', time: '1 month ago' },
              ].map((log, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-outline-variant/10 last:border-0">
                  <span className="text-xs font-bold text-on-surface">{log.label}</span>
                  <span className="text-[10px] text-outline font-bold uppercase">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Suspend Confirmation */}
      <ConfirmationDialog 
        isOpen={isSuspendDialogOpen}
        onClose={() => setIsSuspendDialogOpen(false)}
        onConfirm={handleSuspendToggle}
        title={isCurrentlyActive ? "Suspend Partner Account?" : "Activate Partner Account?"}
        description={isCurrentlyActive 
          ? "This will temporarily disable the partner's access to the platform. They will not be able to log in or manage their gym until activated." 
          : "This will restore the partner's access to the platform."
        }
        confirmLabel={isCurrentlyActive ? "Suspend Now" : "Activate Now"}
        variant={isCurrentlyActive ? "danger" : "primary"}
        loading={isSubmitting}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Permanently Delete Partner?"
        description="This action is IRREVERSIBLE. All data associated with this gym, including members, staff, and financial records, will be permanently deleted from our servers."
        confirmLabel="Delete Forever"
        variant="danger"
        loading={isSubmitting}
      />
    </div>
  );
}
