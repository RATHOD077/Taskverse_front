import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api/api';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';

export default function EmpCalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // April 2026 for demo or new Date()
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Current date logic: new Date()
    setCurrentDate(new Date());
    
    const fetchCalendarEvents = async () => {
      try {
        const res = await api.get('/dashboard/emp-calendar');
        if (res.data.success) {
          setEvents(res.data.events);
        }
      } catch (err) {
        console.error('Error fetching calendar events', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCalendarEvents();
  }, []);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const setToday = () => {
    setCurrentDate(new Date());
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const numDays = daysInMonth(currentYear, currentMonth);
  const firstDay = firstDayOfMonth(currentYear, currentMonth);
  
  // padding for previous month days
  const prevMonthDays = daysInMonth(currentYear, currentMonth - 1);
  const paddingDays = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    paddingDays.push({ day: prevMonthDays - i, isCurrentMonth: false });
  }
  
  const monthDays = [];
  for (let i = 1; i <= numDays; i++) {
    monthDays.push({ day: i, isCurrentMonth: true });
  }

  // Padding for next month
  const totalSlots = 42; // 6 rows * 7 days
  const nextMonthPadding = totalSlots - (paddingDays.length + monthDays.length);
  const postPaddingDays = [];
  for (let i = 1; i <= nextMonthPadding; i++) {
    postPaddingDays.push({ day: i, isCurrentMonth: false });
  }

  const allCalendarDays = [...paddingDays, ...monthDays, ...postPaddingDays];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Filter valid future events for the right sidebar
  const upcomingEvents = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return events
      .filter(e => e.date >= todayStr)
      .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
      .slice(0, 5);
  }, [events]);

  const thisMonthStats = useMemo(() => {
    const thisMonthEvents = events.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
    return {
        total: thisMonthEvents.length,
        hearings: thisMonthEvents.filter(e => e.type === 'Hearing').length,
        projects: thisMonthEvents.filter(e => e.type === 'Project').length,
        tasks: thisMonthEvents.filter(e => e.type === 'Task').length,
    };
  }, [events, currentMonth, currentYear]);

  // Color mapping similar to image
  const getEventStyle = (type) => {
    switch (type) {
        case 'Task': return "bg-green-100/50 text-green-700 border-green-200 border";
        case 'Hearing': return "bg-red-100/50 text-red-700 border-red-200 border";
        case 'Project': return "bg-blue-100/50 text-blue-700 border-blue-200 border";
        default: return "bg-orange-100/50 text-orange-700 border-orange-200 border";
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
        case 'Task': return <CheckCircle2 size={10} className="mr-1 inline-block" />;
        case 'Project': return <CalendarIcon size={10} className="mr-1 inline-block" />;
        case 'Hearing': return <Clock size={10} className="mr-1 inline-block" />;
        default: return null;
    }
  }

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-100 shadow-sm col-span-1 lg:col-span-12 mt-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Calendar</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side: Calendar Grid */}
        <div className="flex-1 border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm">
            {/* Header controls inside calendar section */}
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-4">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                        <button onClick={prevMonth} className="p-2 hover:bg-slate-50 border-r border-slate-200 text-slate-600">
                            <ChevronLeft size={16} />
                        </button>
                        <button onClick={nextMonth} className="p-2 hover:bg-slate-50 border-r border-slate-200 text-slate-600">
                            <ChevronRight size={16} />
                        </button>
                        <button onClick={setToday} className="px-4 py-1.5 text-xs font-semibold hover:bg-slate-50 text-slate-700">
                            Today
                        </button>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight ml-2">
                        {monthNames[currentMonth]} {currentYear}
                    </h3>
                </div>
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm text-xs font-semibold">
                    <button className="px-4 py-1.5 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">Month</button>
                    <button className="px-4 py-1.5 border-l border-slate-200 text-slate-600 hover:bg-slate-50">Week</button>
                    <button className="px-4 py-1.5 border-l border-slate-200 text-slate-600 hover:bg-slate-50">Day</button>
                </div>
            </div>

            {/* Calendar Grid Container */}
            <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
                {dayNames.map(day => (
                    <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 tracking-wider">
                        {day}
                    </div>
                ))}
            </div>
            
            <div className="grid grid-cols-7 grid-rows-6 auto-rows-fr h-[600px]">
                {allCalendarDays.map((dateObj, idx) => {
                    const cellDateStr = dateObj.isCurrentMonth
                        ? `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dateObj.day).padStart(2, '0')}`
                        : '';
                    
                    const dayEvents = dateObj.isCurrentMonth
                        ? events.filter(e => e.date === cellDateStr)
                        : [];

                    const isToday = cellDateStr === (new Date().toISOString().split('T')[0]);

                    return (
                        <div key={idx} className={`p-2 border-b border-r border-slate-100 min-h-[100px] flex flex-col ${!dateObj.isCurrentMonth ? 'bg-slate-50/30' : 'bg-white'}`}>
                            <div className="flex justify-between items-center mb-1">
                                <span className={`text-sm font-semibold rounded-full w-7 h-7 flex items-center justify-center ${
                                    isToday ? 'bg-blue-500 text-white' : (dateObj.isCurrentMonth ? 'text-slate-700' : 'text-slate-400')
                                }`}>
                                    {dateObj.day}
                                </span>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-1 mt-1 pr-1 custom-scrollbar">
                                {dayEvents.map(evt => (
                                    <div key={evt.id} className={`text-[0.65rem] p-1.5 rounded-md leading-tight truncate font-medium ${getEventStyle(evt.type)}`} title={evt.title}>
                                        {getEventIcon(evt.type)}
                                        {evt.title}
                                        {evt.extendedProps?.caseTitle && (
                                            <div className="text-[0.55rem] opacity-80 mt-0.5 truncate">{evt.extendedProps.caseTitle}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Right Side: Sidebars like in the image */}
        <div className="w-full lg:w-72 flex flex-col gap-6">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <h4 className="font-bold text-slate-800 text-[1rem] mb-4 tracking-tight">Upcoming Events</h4>
                <div className="space-y-4">
                    {upcomingEvents.length > 0 ? upcomingEvents.map(evt => (
                        <div key={evt.id} className="flex gap-3 relative">
                            <div className="mt-1 w-2 h-2 rounded-full absolute left-0" style={{ backgroundColor: evt.type === 'Task' ? '#22c55e' : (evt.type === 'Hearing' ? '#ef4444' : '#3b82f6') }} />
                            <div className="pl-4 border-l-2 border-slate-100 pb-2">
                                <div className="flex items-center gap-2 mb-1">
                                    {getEventIcon(evt.type)}
                                    <span className="font-bold text-[0.75rem] text-slate-800">{evt.title}</span>
                                    <span className="bg-slate-100 border border-slate-200 text-slate-500 text-[0.55rem] font-bold px-1.5 rounded ml-auto">{evt.type}</span>
                                </div>
                                <p className="text-[0.65rem] text-slate-400 font-medium">
                                    {evt.date} - {evt.time}
                                </p>
                                {evt.extendedProps?.caseTitle && (
                                    <p className="text-[0.65rem] text-blue-500 font-semibold mt-0.5">{evt.extendedProps.caseTitle}</p>
                                )}
                            </div>
                        </div>
                    )) : (
                        <p className="text-[0.75rem] text-slate-500 italic p-2">No upcoming events.</p>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <h4 className="font-bold text-slate-800 text-[1rem] mb-4 tracking-tight">This Month</h4>
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-[0.75rem]">
                        <span className="text-slate-600 font-semibold">Total Events</span>
                        <span className="font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{thisMonthStats.total}</span>
                    </div>
                    <div className="flex justify-between items-center text-[0.75rem]">
                        <span className="text-slate-600 font-semibold">Hearings</span>
                        <span className="font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{thisMonthStats.hearings}</span>
                    </div>
                    <div className="flex justify-between items-center text-[0.75rem]">
                        <span className="text-slate-600 font-semibold">Tasks/Projects</span>
                        <span className="font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{thisMonthStats.tasks + thisMonthStats.projects}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #e2e8f0;
            border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
