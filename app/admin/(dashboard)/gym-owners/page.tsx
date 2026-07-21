"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { 
  fetchAdminGyms, 
  updateAdminGym, 
  deleteAdminGym 
} from "@/store/slices/adminAnalytics.slice";
import { PageLoader } from "@/components/ui/states";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { toast } from "sonner";

export default function AdminGymOwnersPage() {
  const dispatch = useAppDispatch();
  const { gyms, loading } = useAppSelector((state) => state.adminAnalytics);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // States for actions
  const [targetGym, setTargetGym] = useState<any | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminGyms());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredGyms = useMemo(() => {
    return gyms.filter((owner: any) => {
      const matchesSearch = 
        owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        owner.gym.toLowerCase().includes(searchQuery.toLowerCase()) ||
        owner.location.toLowerCase().includes(searchQuery.toLowerCase());
      
    const isCurrentlyActive = owner.status?.toUpperCase() === "ACTIVE";
    const matchesStatus = statusFilter === "All" || 
      (statusFilter === "Active" && isCurrentlyActive) ||
      (statusFilter === "Suspended" && owner.status?.toUpperCase() === "SUSPENDED");
      
      return matchesSearch && matchesStatus;
    });
  }, [gyms, searchQuery, statusFilter]);

  const handleDeleteClick = (gym: any) => {
    setTargetGym(gym);
    setIsDeleteDialogOpen(true);
    setOpenMenuId(null);
  };

  const handleSuspendToggle = async (gym: any) => {
    const isCurrentlyActive = gym.status?.toUpperCase() === "ACTIVE";
    const newStatus = isCurrentlyActive ? "SUSPENDED" : "ACTIVE";
    
    toast.promise(
      dispatch(updateAdminGym({ id: gym.id, data: { status: newStatus } })).unwrap(),
      {
        loading: `${isCurrentlyActive ? "Suspending" : "Activating"} gym...`,
        success: () => {
          dispatch(fetchAdminGyms());
          return `Gym ${isCurrentlyActive ? "suspended" : "activated"} successfully`;
        },
        error: "Action failed"
      }
    );
    setOpenMenuId(null);
  };

  const handleDeleteConfirm = async () => {
    setIsSubmitting(true);
    const action = await dispatch(deleteAdminGym(targetGym.id));
    setIsSubmitting(false);
    if (deleteAdminGym.fulfilled.match(action)) {
      toast.success("Gym deleted successfully");
      setIsDeleteDialogOpen(false);
      dispatch(fetchAdminGyms());
    } else {
      toast.error("Failed to delete gym");
    }
  };

  if (loading && gyms.length === 0) return <PageLoader />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Gym Owners</h1>
          <p className="text-on-surface-variant text-sm mt-1">Directory of partner relationships and access control.</p>
        </div>
        <button className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2">
          <Icon name="person_add" size={18} />
          Register Owner
        </button>
      </div>

      <div className="flex items-center gap-4 bg-surface-container-lowest p-3 rounded-2xl border ghost-border shadow-atmospheric">
        <div className="flex-1 relative">
          <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
          <input 
            type="text" 
            placeholder="Search owners, brands, or locations..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-low border-none rounded-xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-on-surface"
          />
        </div>
        <div className="flex items-center gap-2">
          {["All", "Active", "Suspended"].map((status) => (
            <button 
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === status 
                ? "bg-primary text-white shadow-md shadow-primary/20" 
                : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGyms.map((owner: any, i: number) => (
          <div key={i} className="bg-surface-container-lowest p-6 rounded-2xl border ghost-border shadow-atmospheric group hover:border-primary/30 transition-all duration-300 relative">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface font-black text-lg border ghost-border group-hover:bg-primary group-hover:text-white transition-all">
                {owner.initial}
              </div>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                owner.status?.toUpperCase() === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {owner.status || 'ACTIVE'}
              </span>
            </div>
            
            <h3 className="text-base font-bold text-on-surface">{owner.name}</h3>
            <p className="text-xs font-bold text-primary mt-0.5">{owner.gym}</p>
            
            <div className="flex items-center gap-2 text-outline mt-4 text-[10px] font-bold uppercase tracking-wider">
              <Icon name="location_on" size={14} />
              <span>{owner.location}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-outline-variant/10">
              <div>
                <p className="text-[9px] text-outline font-black uppercase tracking-widest">Members</p>
                <p className="text-sm font-bold text-on-surface mt-0.5">{owner.members}</p>
              </div>
              <div>
                <p className="text-[9px] text-outline font-black uppercase tracking-widest">Revenue</p>
                <p className="text-sm font-bold text-on-surface mt-0.5">{owner.revenue}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Link 
                href={`/admin/gym-owners/${owner.id}`}
                className="flex-1 py-2 bg-surface-container-low text-on-surface-variant rounded-lg text-xs font-bold hover:text-on-surface hover:bg-surface-container-high transition-all text-center flex items-center justify-center"
              >
                View Account
              </Link>
              <div className="relative">
                <button 
                  onClick={() => setOpenMenuId(openMenuId === owner.id ? null : owner.id)}
                  className={`p-2 rounded-lg transition-all ${
                    openMenuId === owner.id 
                    ? "bg-primary text-white" 
                    : "bg-surface-container-low text-outline hover:text-on-surface"
                  }`}
                >
                  <Icon name="more_horiz" size={20} />
                </button>

                {openMenuId === owner.id && (
                  <div 
                    ref={menuRef}
                    className="absolute right-0 bottom-full mb-2 w-48 bg-surface-container-lowest border ghost-border rounded-xl shadow-atmospheric z-[100] animate-in slide-in-from-bottom-2 fade-in duration-200"
                  >
                    <div className="p-1.5 space-y-1">
                      <button 
                        onClick={() => handleSuspendToggle(owner)}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all flex items-center gap-2"
                      >
                        <Icon name={owner.status?.toUpperCase() === 'ACTIVE' ? "block" : "check_circle"} size={16} />
                        {owner.status?.toUpperCase() === 'ACTIVE' ? "Suspend Partner" : "Activate Partner"}
                      </button>
                      <div className="h-[1px] bg-outline-variant/10 mx-2 my-1" />
                      <button 
                        onClick={() => handleDeleteClick(owner)}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-rose-500 hover:bg-rose-50 transition-all flex items-center gap-2"
                      >
                        <Icon name="delete" size={16} />
                        Delete Partner
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredGyms.length === 0 && (
          <div className="col-span-full py-20 text-center animate-in fade-in duration-700">
            <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-4 border border-outline-variant/20">
              <Icon name="search_off" size={32} className="text-outline" />
            </div>
            <h3 className="text-on-surface font-bold">No owners found</h3>
            <p className="text-on-surface-variant text-sm mt-1">Try adjusting your search or filters.</p>
            {(searchQuery || statusFilter !== "All") && (
              <button 
                onClick={() => { setSearchQuery(""); setStatusFilter("All"); }}
                className="mt-4 text-primary text-xs font-bold uppercase tracking-widest hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      <ConfirmationDialog 
        isOpen={isDeleteDialogOpen} 
        onClose={() => setIsDeleteDialogOpen(false)} 
        onConfirm={handleDeleteConfirm}
        title="Delete Partner?"
        description="This will permanently delete the gym and all associated data. This action cannot be undone."
        variant="danger"
        loading={isSubmitting}
      />
    </div>
  );
}
