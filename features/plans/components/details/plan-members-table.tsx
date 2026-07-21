import React from "react";
import { Icon } from "@/components/ui/icon";

const members = [
  { name: "John Sanderson", id: "#GP-8821", date: "Oct 12, 2023", status: "ACTIVE", lastCheckin: "Today, 06:14 AM", initials: "JS" },
  { name: "Maya Patel", id: "#GP-8834", date: "Nov 05, 2023", status: "FREEZED", lastCheckin: "Feb 14, 2024", initials: "MP" },
  { name: "Arjun Kapoor", id: "#GP-8910", date: "Dec 20, 2023", status: "ACTIVE", lastCheckin: "Yesterday, 08:30 PM", initials: "AK" },
  { name: "Liam Wilson", id: "#GP-8945", date: "Jan 15, 2024", status: "ACTIVE", lastCheckin: "2 hours ago", initials: "LW" },
];

export const PlanMembersTable: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-atmospheric border border-outline-variant/10">
      <div className="px-8 py-6 flex justify-between items-center border-b border-outline-variant/10">
        <h2 className="text-xl font-black text-on-surface tracking-tighter">Enrolled Members</h2>
        <button className="flex items-center gap-2 text-[10px] font-black text-outline hover:text-primary transition-all tracking-widest uppercase">
          <Icon name="filter_list" size={16} />
          Filter
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50">
              <th className="px-8 py-5 text-[10px] font-black text-outline uppercase tracking-[0.2em]">Member</th>
              <th className="px-8 py-5 text-[10px] font-black text-outline uppercase tracking-[0.2em]">Join Date</th>
              <th className="px-8 py-5 text-[10px] font-black text-outline uppercase tracking-[0.2em]">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-outline uppercase tracking-[0.2em]">Last Activity</th>
              <th className="px-8 py-5 text-[10px] font-black text-outline uppercase tracking-[0.2em] text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/5">
            {members.map((member) => (
              <tr
                key={member.id}
                className="hover:bg-surface-container-low/30 transition-colors group/row cursor-pointer"
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-[10px] border border-primary/20 transition-transform group-hover/row:scale-110">
                      {member.initials}
                    </div>
                    <div>
                      <p className="font-bold text-on-surface text-sm group-hover/row:text-primary transition-colors">{member.name}</p>
                      <p className="text-[10px] text-outline font-bold tracking-widest">{member.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 text-xs font-bold text-on-surface-variant">{member.date}</td>
                <td className="px-8 py-5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest border capitalize ${member.status === 'ACTIVE'
                    ? 'bg-primary/10 text-primary border-primary/20'
                    : 'bg-tertiary/10 text-tertiary border-tertiary/20'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'ACTIVE' ? 'bg-primary' : 'bg-tertiary'}`}></span>
                    {member.status.toLowerCase()}
                  </span>
                </td>
                <td className="px-8 py-5 text-xs font-bold text-on-surface-variant">{member.lastCheckin}</td>
                <td className="px-8 py-5 text-right">
                  <button className="p-2 text-outline rounded-lg transition-colors active:scale-90">
                    <Icon className=" cursor-pointer" name="more_horiz" size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-8 py-5 bg-surface-container-low/30 border-t border-outline-variant/10 flex justify-between items-center">
        <p className="text-[10px] font-bold text-outline tracking-widest uppercase">Showing 4 of 124 members</p>
        <div className="flex items-center gap-2">
          <button className="p-2 text-on-surface-variant hover:bg-white rounded-lg transition-colors disabled:opacity-30 active:scale-90" disabled>
            <Icon name="chevron_left" size={20} />
          </button>
          <span className="px-4 text-xs font-black text-primary">1</span>
          <button className="p-2 text-on-surface-variant hover:bg-white rounded-lg transition-colors active:scale-90">
            <Icon name="chevron_right" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
