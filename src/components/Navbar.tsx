import React, { useState } from 'react';
import { RoleView, SchoolNotice } from '../types';
import { 
  GraduationCap, 
  School, 
  Users, 
  BookOpen, 
  Sparkles, 
  Bell, 
  FileText, 
  MapPin, 
  Phone, 
  Calendar,
  X,
  CheckCircle2,
  AlertCircle,
  Library,
  Award,
  MessageSquare
} from 'lucide-react';

interface NavbarProps {
  currentRole: RoleView;
  onSelectRole: (role: RoleView) => void;
  notices: SchoolNotice[];
  pendingAdmissionsCount: number;
  unreadMessagesCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onSelectRole,
  notices,
  pendingAdmissionsCount,
  unreadMessagesCount,
}) => {
  const [showNoticesModal, setShowNoticesModal] = useState(false);

  const navItems: { id: RoleView; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'public', label: 'School Website', icon: <School className="w-4 h-4" /> },
    { 
      id: 'admissions', 
      label: 'Admissions & Apply', 
      icon: <FileText className="w-4 h-4" />,
      badge: pendingAdmissionsCount > 0 ? pendingAdmissionsCount : undefined
    },
    { id: 'staff', label: 'Staff & Admin', icon: <Users className="w-4 h-4" /> },
    { id: 'guardian', label: 'Parents & Guardians', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'student', label: 'Academic & Timetable', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'results', label: 'Exam Results & GPA', icon: <Award className="w-4 h-4 text-amber-400" /> },
    { 
      id: 'messages', 
      label: 'Internal Messages', 
      icon: <MessageSquare className="w-4 h-4 text-emerald-400" />,
      badge: unreadMessagesCount && unreadMessagesCount > 0 ? unreadMessagesCount : undefined
    },
    { id: 'library', label: 'E-Library & PDFs', icon: <Library className="w-4 h-4 text-emerald-400" /> },
    { id: 'gemini-lab', label: 'Gemini AI Counselor', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
  ];

  return (
    <>
      {/* Top Banner with Contact & Location */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            Adam Doki Campus, Sindh, Pakistan
          </span>
          <span className="hidden sm:inline-block text-slate-600">|</span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <Phone className="w-3.5 h-3.5 text-sky-400" />
            +92 243 552109 / +92 300 2894101
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Admissions Open 2024-25
          </span>
          <span className="hidden md:flex items-center gap-1 text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Academic Session 2024-2025
          </span>
        </div>
      </div>

      {/* Main Brand Header */}
      <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl sticky top-0 z-40 border-b border-indigo-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3.5">
            {/* Logo and Identity */}
            <div 
              onClick={() => onSelectRole('public')}
              className="flex items-center gap-3.5 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-indigo-700 p-0.5 shadow-lg shadow-emerald-900/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                    Indus Bright Future School
                  </h1>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Adam Doki
                  </span>
                </div>
                <p className="text-xs text-indigo-200/80 font-medium">
                  Nurturing Minds • Building Future Leaders along the Indus
                </p>
              </div>
            </div>

            {/* Quick Actions Right Side */}
            <div className="flex items-center gap-2.5">
              {/* Notice Board Button */}
              <button
                onClick={() => setShowNoticesModal(true)}
                className="relative p-2 rounded-lg bg-indigo-900/40 hover:bg-indigo-900/70 border border-indigo-700/40 text-indigo-200 transition-colors flex items-center gap-1.5 text-xs font-medium"
                title="School Circulars & Notifications"
              >
                <Bell className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">Notice Board</span>
                {notices.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 font-bold rounded-full text-[10px] flex items-center justify-center">
                    {notices.length}
                  </span>
                )}
              </button>

              {/* Online Apply CTA */}
              <button
                onClick={() => onSelectRole('admissions')}
                className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-md shadow-emerald-900/40 transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                Online Admission
              </button>
            </div>
          </div>

          {/* Navigation Role Tabs */}
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none border-t border-indigo-900/30">
            {navItems.map((item) => {
              const active = currentRole === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectRole(item.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                      : 'text-indigo-200/90 hover:text-white hover:bg-indigo-900/40'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="bg-amber-400 text-slate-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Notices Modal */}
      {showNoticesModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-white animate-in fade-in zoom-in duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/20 text-amber-300 rounded-lg">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Official School Notice Board</h3>
                  <p className="text-xs text-slate-400">Circulars, Date Sheets & Emergency Notifications</p>
                </div>
              </div>
              <button
                onClick={() => setShowNoticesModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              {notices.map((notice) => (
                <div 
                  key={notice.id}
                  className={`p-4 rounded-xl border ${
                    notice.isImportant 
                      ? 'bg-amber-950/20 border-amber-800/60' 
                      : 'bg-slate-800/40 border-slate-700/60'
                  } transition-all`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      notice.category === 'Examination' ? 'bg-purple-900/60 text-purple-300 border border-purple-700/50' :
                      notice.category === 'Administrative' ? 'bg-blue-900/60 text-blue-300 border border-blue-700/50' :
                      notice.category === 'Sports & Events' ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {notice.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {notice.date}
                    </span>
                  </div>
                  <h4 className="font-semibold text-white text-sm sm:text-base flex items-center gap-2">
                    {notice.isImportant && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
                    {notice.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    {notice.content}
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-700/40 flex items-center justify-between text-xs text-slate-400">
                    <span>Audience: <strong className="text-slate-300">{notice.targetAudience}</strong></span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Official Circular
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex justify-end">
              <button
                onClick={() => setShowNoticesModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
              >
                Close Notice Board
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
