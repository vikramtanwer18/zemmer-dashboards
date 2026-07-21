import React from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

const members = [
  { name: "James Davenport", id: "#99283", initials: "JD", membership: "Elite Annual", status: "Checked-in", time: "06:52 AM", color: "bg-secondary-fixed text-on-secondary-fixed" },
  { name: "Sarah Lopez", id: "#99102", initials: "SL", membership: "Basic Monthly", status: "Awaiting", time: "-- : --", color: "bg-tertiary-fixed text-on-tertiary-fixed" },
  { name: "Michael Chen", id: "#99544", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop", membership: "Premium Pass", status: "Awaiting", time: "-- : --" },
];

export const MemberAttendanceTable: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest rounded-3xl shadow-atmospheric overflow-hidden border border-outline-variant/10">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low border-b border-outline-variant/5">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Member</th>
              <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Membership</th>
              <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Check-in Time</th>
              <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/5">
            {members.map((member, idx) => (
              <tr key={idx} className="hover:bg-surface-container-low/30 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    {member.avatar ? (
                      <img src={member.avatar} className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-sm" alt={member.name} />
                    ) : (
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center font-black text-xs shadow-sm ${member.color}`}>
                        {member.initials}
                      </div>
                    )}
                    <div>
                      <p className="font-black text-on-surface tracking-tight italic">{member.name}</p>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tight opacity-70">ID: {member.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-surface-container text-on-secondary-container text-[10px] font-black rounded-lg uppercase tracking-tight">
                    {member.membership}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    member.status === 'Checked-in' ? 'bg-green-100 text-green-700' : 'bg-surface-container text-on-surface-variant opacity-60'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${member.status === 'Checked-in' ? 'bg-green-500' : 'bg-outline-variant'}`}></span>
                    {member.status}
                  </div>
                </td>
                <td className="px-8 py-5 text-xs font-black text-on-surface-variant italic">
                  {member.time}
                </td>
                <td className="px-8 py-5 text-right">
                  {member.status === 'Checked-in' ? (
                    <button className="p-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-colors">
                      <Icon name="more_vert" size={20} />
                    </button>
                  ) : (
                    <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-95 transition-all">
                      <Icon name="how_to_reg" size={16} />
                      Mark Attendance
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      <div className="px-8 py-5 bg-surface-container-low flex items-center justify-between">
        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Showing 3 of 18 members</p>
        <div className="flex gap-2">
          <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-container-highest text-primary transition-all hover:scale-105 active:scale-95">
            <Icon name="chevron_left" size={20} />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary text-on-primary font-black text-xs transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
            1
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-container-highest text-primary font-black text-xs transition-all hover:scale-105 active:scale-95">
            2
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-container-highest text-primary transition-all hover:scale-105 active:scale-95">
            <Icon name="chevron_right" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
