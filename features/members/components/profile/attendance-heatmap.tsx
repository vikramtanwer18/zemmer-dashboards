import React from "react";

export const AttendanceHeatmap: React.FC = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  // Fake intensity data (0-3)
  const data = [
    [3, 1, 0, 3], // MON
    [2, 3, 1, 0], // TUE
    [0, 2, 3, 2], // WED
    [3, 1, 0, 3], // THU
    [2, 3, 1, 0], // FRI
    [0, 1, 1, 0], // SAT
    [0, 0, 0, 0], // SUN
  ];

  const getColor = (intensity: number) => {
    switch (intensity) {
      case 3: return "bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.2)]";
      case 2: return "bg-primary/60";
      case 1: return "bg-primary/20";
      default: return "bg-surface-container-low/40";
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-atmospheric border border-outline-variant/10 group">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <h3 className="text-[10px] font-black text-outline tracking-[0.2em] uppercase">Attendance Density</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-outline font-black tracking-widest uppercase">Sparse</span>
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-surface-container-low/40"></div>
            <div className="w-2.5 h-2.5 rounded-sm bg-primary/20"></div>
            <div className="w-2.5 h-2.5 rounded-sm bg-primary/60"></div>
            <div className="w-2.5 h-2.5 rounded-sm bg-primary"></div>
          </div>
          <span className="text-[10px] text-outline font-black tracking-widest uppercase">Dense</span>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-4 px-2">
        {days.map((day, dayIdx) => (
          <div key={day} className="space-y-4">
            {data[dayIdx].map((intensity, i) => (
              <div 
                key={i} 
                className={`w-full aspect-square rounded-lg transition-all hover:scale-110 cursor-pointer border border-white/5 ${getColor(intensity)}`}
              />
            ))}
            <p className="text-center text-[10px] font-black text-outline tracking-widest uppercase">{day}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
