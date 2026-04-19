import React from 'react';
import EmpCalendarWidget from './EmpCalendarWidget';

export default function EmpCalendarPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden font-sans text-slate-900 bg-[#fcfcfc]">
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-6 text-slate-900 tracking-tight">Full Calendar</h1>
        <div className="w-full">
          <EmpCalendarWidget />
        </div>
      </div>
    </div>
  );
}
