import React, { useState, useEffect } from 'react';
import { DayTimetable, TimetablePeriod, Teacher } from '../types';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  User, 
  MapPin, 
  Printer, 
  Edit3, 
  Plus, 
  Trash2, 
  Save, 
  Coffee, 
  CheckCircle2, 
  Filter, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface TimetableViewerProps {
  timetables: Record<string, DayTimetable[]>;
  teachers: Teacher[];
  isAdmin?: boolean;
  onUpdateTimetable?: (grade: string, updatedDays: DayTimetable[]) => void;
}

export const DEFAULT_GRADES = [
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10'
];
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export const TimetableViewer: React.FC<TimetableViewerProps> = ({
  timetables: initialTimetables,
  teachers,
  isAdmin = false,
  onUpdateTimetable,
}) => {
  const [activeGrade, setActiveGrade] = useState<string>('Grade 1');
  const [viewMode, setViewMode] = useState<'weekly' | 'daily' | 'teacher'>('weekly');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [selectedTeacherFilter, setSelectedTeacherFilter] = useState<string>('All');
  
  // Local schedule state for edits
  const [scheduleData, setScheduleData] = useState<Record<string, DayTimetable[]>>(initialTimetables);

  useEffect(() => {
    if (initialTimetables && Object.keys(initialTimetables).length > 0) {
      setScheduleData(initialTimetables);
    }
  }, [initialTimetables]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editModalPeriod, setEditModalPeriod] = useState<{
    day: string;
    periodIndex: number;
    period: TimetablePeriod;
  } | null>(null);

  // Current grade's timetable
  const currentGradeTimetable = scheduleData[activeGrade] || scheduleData['Grade 10'] || [];

  const handleSavePeriod = (updatedPeriod: TimetablePeriod) => {
    if (!editModalPeriod) return;
    const { day, periodIndex } = editModalPeriod;

    const updatedGradeDays = currentGradeTimetable.map(d => {
      if (d.day === day) {
        const updatedPeriods = [...d.periods];
        updatedPeriods[periodIndex] = updatedPeriod;
        return { ...d, periods: updatedPeriods };
      }
      return d;
    });

    const newAllSchedules = {
      ...scheduleData,
      [activeGrade]: updatedGradeDays,
    };

    setScheduleData(newAllSchedules);
    if (onUpdateTimetable) {
      onUpdateTimetable(activeGrade, updatedGradeDays);
    }
    setEditModalPeriod(null);
  };

  // Filter periods for the selected day in daily view
  const currentDaySchedule = currentGradeTimetable.find(d => d.day === selectedDay)?.periods || [];

  // Teacher Schedule extraction
  const getTeacherPeriods = (teacherName: string) => {
    const results: { day: string; period: TimetablePeriod; grade: string }[] = [];
    Object.entries(scheduleData).forEach(([grade, days]) => {
      days.forEach(d => {
        d.periods.forEach(p => {
          if (!p.isBreak && p.teacherName.toLowerCase().includes(teacherName.toLowerCase())) {
            results.push({ day: d.day, period: p, grade });
          }
        });
      });
    });
    return results;
  };

  return (
    <div className="space-y-6 text-white">
      {/* Header & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Calendar className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Official School Timetable & Bell Schedule
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Indus Bright Future School Adam Doki • Academic Session 2024-2025 • Daily 08:00 AM - 01:30 PM
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 flex text-xs font-semibold">
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'weekly' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Weekly Grid
            </button>
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'daily' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Daily Timeline
            </button>
            <button
              onClick={() => setViewMode('teacher')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'teacher' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Teacher Schedule
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Print Schedule for Classroom Bulletin"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print Timetable</span>
          </button>
        </div>
      </div>

      {/* Grade Selector & Filters */}
      {viewMode !== 'teacher' && (
        <div className="space-y-2 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Select Class / Grade Timetable:
              </span>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                Active: {activeGrade}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Primary (1-5)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400"></span> Middle (6-8)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Matric (9-10)</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-thin">
            {DEFAULT_GRADES.map(grade => {
              const gradeNum = parseInt(grade.replace('Grade ', ''));
              const isPrimary = gradeNum <= 5;
              const isMiddle = gradeNum >= 6 && gradeNum <= 8;
              const isSelected = activeGrade === grade;

              return (
                <button
                  key={grade}
                  onClick={() => setActiveGrade(grade)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 ring-2 ring-emerald-400/50'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    isPrimary ? 'bg-amber-400' : isMiddle ? 'bg-sky-400' : 'bg-emerald-400'
                  }`} />
                  {grade}
                </button>
              );
            })}
          </div>

          {viewMode === 'daily' && (
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {DAYS_OF_WEEK.map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    selectedDay === day 
                      ? 'bg-sky-600 text-white' 
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 1: WEEKLY GRID */}
      {viewMode === 'weekly' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-950 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
                  <th className="py-3 px-4 w-32">Day</th>
                  <th className="py-3 px-3">Period 1<div className="text-[10px] text-slate-500 font-normal">08:00 - 08:45</div></th>
                  <th className="py-3 px-3">Period 2<div className="text-[10px] text-slate-500 font-normal">08:45 - 09:30</div></th>
                  <th className="py-3 px-3">Period 3<div className="text-[10px] text-slate-500 font-normal">09:30 - 10:15</div></th>
                  <th className="py-3 px-3 bg-amber-950/20 text-amber-300">Recess Break<div className="text-[10px] text-amber-500/80 font-normal">10:15 - 10:55</div></th>
                  <th className="py-3 px-3">Period 4<div className="text-[10px] text-slate-500 font-normal">10:55 - 11:40</div></th>
                  <th className="py-3 px-3">Period 5<div className="text-[10px] text-slate-500 font-normal">11:40 - 12:25</div></th>
                  <th className="py-3 px-3">Period 6<div className="text-[10px] text-slate-500 font-normal">12:25 - 01:15</div></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {currentGradeTimetable.map((dayPlan) => (
                  <tr key={dayPlan.day} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white bg-slate-950/40 border-r border-slate-800">
                      {dayPlan.day}
                      {dayPlan.day === 'Friday' && (
                        <div className="text-[10px] text-emerald-400 font-normal mt-0.5">Jummah Early Dismissal</div>
                      )}
                    </td>
                    {dayPlan.periods.map((period, idx) => (
                      <td 
                        key={idx} 
                        className={`py-2 px-2.5 align-top border-r border-slate-800/50 ${
                          period.isBreak ? 'bg-amber-950/15' : ''
                        }`}
                      >
                        <div 
                          onClick={() => setEditModalPeriod({ day: dayPlan.day, periodIndex: idx, period })}
                          className={`p-2 rounded-xl transition-all h-full flex flex-col justify-between cursor-pointer border ${
                            period.isBreak 
                              ? 'bg-amber-950/30 border-amber-800/40 text-amber-300' 
                              : period.subject.includes('Math')
                                ? 'bg-blue-950/40 border-blue-800/50 hover:border-blue-500'
                                : period.subject.includes('Physics') || period.subject.includes('Science')
                                  ? 'bg-emerald-950/40 border-emerald-800/50 hover:border-emerald-500'
                                  : period.subject.includes('Chemistry')
                                    ? 'bg-orange-950/40 border-orange-800/50 hover:border-orange-500'
                                    : period.subject.includes('Computer') || period.subject.includes('Robotics')
                                      ? 'bg-cyan-950/40 border-cyan-800/50 hover:border-cyan-500'
                                      : 'bg-slate-800/70 border-slate-700/60 hover:border-slate-500'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-slate-100 text-[12px] leading-tight flex items-center justify-between">
                              <span>{period.subject}</span>
                              {isAdmin && <Edit3 className="w-3 h-3 text-slate-400 hover:text-white" />}
                            </div>
                            {!period.isBreak && (
                              <div className="text-[11px] text-slate-300 font-medium mt-1 truncate">
                                {period.teacherName}
                              </div>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1.5 flex items-center justify-between">
                            <span className="flex items-center gap-0.5">
                              <MapPin className="w-2.5 h-2.5 text-slate-400" />
                              {period.roomNumber}
                            </span>
                            {period.isBreak && (
                              <Coffee className="w-3.5 h-3.5 text-amber-400" />
                            )}
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: DAILY TIMELINE */}
      {viewMode === 'daily' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sky-400" />
              Schedule for {selectedDay} • {activeGrade}
            </h3>
            <span className="text-xs text-slate-400">Total {currentDaySchedule.length} Sessions</span>
          </div>

          <div className="space-y-3">
            {currentDaySchedule.map((p, idx) => (
              <div 
                key={idx}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  p.isBreak 
                    ? 'bg-amber-950/20 border-amber-800/60 text-amber-300' 
                    : 'bg-slate-800/60 border-slate-700 text-white hover:bg-slate-800 transition-colors'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    p.isBreak ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {p.isBreak ? <Coffee className="w-4 h-4" /> : `P${idx + 1}`}
                  </div>
                  <div>
                    <div className="font-bold text-sm sm:text-base text-white">{p.subject}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-sky-400" />
                        {p.timeRange}
                      </span>
                      {!p.isBreak && (
                        <span className="flex items-center gap-1 text-slate-300">
                          <User className="w-3.5 h-3.5 text-emerald-400" />
                          {p.teacherName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {p.roomNumber}
                  </span>
                  <button
                    onClick={() => setEditModalPeriod({ day: selectedDay, periodIndex: idx, period: p })}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 text-xs flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: TEACHER SCHEDULE */}
      {viewMode === 'teacher' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-400" />
                Teacher Weekly Lecture Registry
              </h3>
              <p className="text-xs text-slate-400">
                Cross-referenced schedule to monitor faculty classroom presence across grades.
              </p>
            </div>

            <select
              value={selectedTeacherFilter}
              onChange={e => setSelectedTeacherFilter(e.target.value)}
              className="px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Faculty Members</option>
              {teachers.map(t => (
                <option key={t.id} value={t.name}>{t.name} ({t.department})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teachers
              .filter(t => selectedTeacherFilter === 'All' || t.name === selectedTeacherFilter)
              .map(t => {
                const assignedSlots = getTeacherPeriods(t.name);
                return (
                  <div key={t.id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={t.avatarUrl} alt={t.name} className="w-11 h-11 rounded-full object-cover border border-slate-600" />
                      <div>
                        <h4 className="font-bold text-white text-sm">{t.name}</h4>
                        <p className="text-xs text-emerald-400">{t.designation} • {t.department}</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-700/60 pt-2 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Assigned Classes & Periods</div>
                      <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                        {assignedSlots.map((slot, idx) => (
                          <div key={idx} className="p-2 rounded bg-slate-900/80 text-xs flex items-center justify-between">
                            <div>
                              <strong className="text-slate-200">{slot.day}</strong> • <span className="text-slate-400">{slot.period.timeRange}</span>
                              <div className="text-emerald-300 text-[11px]">{slot.period.subject} ({slot.grade})</div>
                            </div>
                            <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                              {slot.period.roomNumber}
                            </span>
                          </div>
                        ))}
                        {assignedSlots.length === 0 && (
                          <div className="text-xs text-slate-500 py-2">
                            Assigned to administrative / general curriculum duties.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Edit Period Modal */}
      {editModalPeriod && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl text-white space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white">Update Timetable Slot</h3>
                <p className="text-xs text-slate-400">{activeGrade} • {editModalPeriod.day}</p>
              </div>
              <button
                onClick={() => setEditModalPeriod(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subject Name</label>
                <input
                  type="text"
                  value={editModalPeriod.period.subject}
                  onChange={e => setEditModalPeriod({
                    ...editModalPeriod,
                    period: { ...editModalPeriod.period, subject: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assigned Teacher</label>
                <input
                  type="text"
                  value={editModalPeriod.period.teacherName}
                  onChange={e => setEditModalPeriod({
                    ...editModalPeriod,
                    period: { ...editModalPeriod.period, teacherName: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Time Range</label>
                <input
                  type="text"
                  value={editModalPeriod.period.timeRange}
                  onChange={e => setEditModalPeriod({
                    ...editModalPeriod,
                    period: { ...editModalPeriod.period, timeRange: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Classroom / Lab Room</label>
                <input
                  type="text"
                  value={editModalPeriod.period.roomNumber}
                  onChange={e => setEditModalPeriod({
                    ...editModalPeriod,
                    period: { ...editModalPeriod.period, roomNumber: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditModalPeriod(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSavePeriod(editModalPeriod.period)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
