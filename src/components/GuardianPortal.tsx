import React, { useState } from 'react';
import { Student, InternalMessage } from '../types';
import { 
  User, 
  Award, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  CreditCard, 
  MessageSquare, 
  FileText, 
  Clock, 
  Send, 
  ChevronRight,
  ShieldCheck,
  Printer
} from 'lucide-react';
import { ReportCardModal } from './ReportCardModal';
import { calculateTermSummary } from '../utils/gradingUtils';

interface GuardianPortalProps {
  students: Student[];
  onSendInternalMessage?: (msg: InternalMessage) => void;
  onNavigateToMessages?: () => void;
}

export const GuardianPortal: React.FC<GuardianPortalProps> = ({ 
  students,
  onSendInternalMessage,
  onNavigateToMessages,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [showReportCard, setShowReportCard] = useState<boolean>(false);
  const [teacherMessage, setTeacherMessage] = useState<string>('');
  const [messageSent, setMessageSent] = useState<boolean>(false);

  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];

  if (!currentStudent) {
    return <div className="p-8 text-center text-slate-400">No student records found.</div>;
  }

  const studentSummary = calculateTermSummary(currentStudent.termResults.subjects);
  const displayGpa = currentStudent.termResults.gpa !== undefined ? currentStudent.termResults.gpa : studentSummary.gpa;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherMessage.trim()) return;

    if (onSendInternalMessage) {
      const newMsg: InternalMessage = {
        id: `MSG-${Date.now()}`,
        threadId: `TH-GRD-${currentStudent.id}-${Date.now().toString().slice(-4)}`,
        senderId: currentStudent.guardian.fatherCnic || `GRD-${currentStudent.id}`,
        senderName: `${currentStudent.guardian.fatherName} (Guardian)`,
        senderRole: 'guardian',
        recipientId: 'TCH-001',
        recipientName: `Class In-charge (${currentStudent.grade})`,
        recipientRole: 'teacher',
        category: 'inquiry',
        subject: `Guardian Note regarding ${currentStudent.fullName} (${currentStudent.grade})`,
        content: teacherMessage.trim(),
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'normal',
      };
      onSendInternalMessage(newMsg);
    }

    setMessageSent(true);
    setTeacherMessage('');
    setTimeout(() => setMessageSent(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white">
      {/* Guardian Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Indus Bright Future School Guardian Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome, {currentStudent.guardian.fatherName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Real-time academic performance dashboard, attendance alerts, and fee records for Adam Doki campus.
          </p>
        </div>

        {/* Child Selector */}
        <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 shrink-0">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Select Your Registered Child:
          </label>
          <div className="flex items-center gap-2 overflow-x-auto">
            {students.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStudentId(s.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedStudentId === s.id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 border border-emerald-400/50'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-800'
                }`}
              >
                <img src={s.avatarUrl} alt={s.fullName} className="w-6 h-6 rounded-full object-cover" />
                <span>{s.fullName.split(' ')[0]}</span>
                <span className="text-[10px] opacity-75">({s.grade})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Card */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Today's Attendance</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-400">
              {currentStudent.recentAttendanceStatus}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Overall Rate: <strong className="text-white">{currentStudent.attendancePercentage}%</strong>
            </p>
          </div>
        </div>

        {/* Academic Grade Card */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Academic Standing</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Award className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-black text-amber-300">
                {currentStudent.termResults.percentage}%
              </div>
              <div className="text-sm font-bold font-mono text-emerald-400">
                GPA {displayGpa.toFixed(2)}
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Grade <strong className="text-white">{currentStudent.termResults.overallGrade}</strong> · Class Rank: <strong className="text-emerald-400">#{currentStudent.termResults.classRank}</strong>
            </p>
          </div>
        </div>

        {/* Tuition Fee Card */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Monthly Tuition Status</span>
            <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <CreditCard className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className={`text-2xl font-black ${
              currentStudent.feeStatus.currentMonthStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {currentStudent.feeStatus.currentMonthStatus}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Monthly Dues: <strong className="text-white">PKR {currentStudent.feeStatus.monthlyTuition + currentStudent.feeStatus.transportCharges}</strong>
            </p>
          </div>
        </div>

        {/* Report Card CTA */}
        <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 border border-emerald-800/60 p-5 rounded-2xl shadow-lg flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-300">Term Progress Report</span>
            <h4 className="text-sm font-bold text-white mt-1">Mid-Term Transcript 2024</h4>
          </div>
          <button
            onClick={() => setShowReportCard(true)}
            className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow"
          >
            <FileText className="w-3.5 h-3.5" />
            View Official Report Card
          </button>
        </div>
      </div>

      {/* Main Student Diagnostic & Subject Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Subject Marks & Teacher Comments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                Recent Examination Subject Scores
              </h3>
              <button
                onClick={() => setShowReportCard(true)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                Full Transcript <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {currentStudent.termResults.subjects.map((sub, i) => {
                const pct = Math.round((sub.obtainedMarks / sub.maxMarks) * 100);
                return (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-bold text-white">{sub.subjectName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300 font-semibold">{sub.obtainedMarks} / {sub.maxMarks}</span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          sub.grade.includes('A') ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                          'bg-sky-950 text-sky-300 border border-sky-700'
                        }`}>
                          {sub.grade} ({pct}%)
                        </span>
                        <span className="text-[11px] font-mono text-emerald-400 font-bold bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                          GPA {sub.gpa !== undefined ? sub.gpa.toFixed(1) : (pct >= 85 ? '4.0' : pct >= 75 ? '3.7' : pct >= 65 ? '3.0' : '2.0')}
                        </span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-slate-700/60 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          pct >= 90 ? 'bg-emerald-400' : pct >= 80 ? 'bg-sky-400' : 'bg-amber-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-slate-400 italic">
                      Teacher Remark: "{sub.teacherRemarks}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Conduct & Teacher Advice */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <h4 className="font-bold text-white text-base">Class Teacher & Headmaster Notes</h4>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 space-y-2 text-xs sm:text-sm">
              <p className="text-slate-300 leading-relaxed">
                <strong>Academic Evaluation:</strong> {currentStudent.termResults.teacherRemarks}
              </p>
              <p className="text-slate-400 leading-relaxed">
                <strong>Discipline & Social Growth:</strong> {currentStudent.termResults.conduct}
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Fee Voucher & Message to Teacher */}
        <div className="space-y-6">
          {/* Fee Voucher Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-sky-400" />
              Tuition Fee Voucher & Receipts
            </h3>

            <div className="bg-slate-800/70 p-4 rounded-xl border border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Tuition Fee (Monthly):</span>
                <span>PKR {currentStudent.feeStatus.monthlyTuition}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Van / Transport Charges:</span>
                <span>PKR {currentStudent.feeStatus.transportCharges}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Annual Examination Fund:</span>
                <span>PKR {currentStudent.feeStatus.annualFunds}</span>
              </div>
              <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-sm text-white">
                <span>Total Amount:</span>
                <span className="text-emerald-400">
                  PKR {currentStudent.feeStatus.monthlyTuition + currentStudent.feeStatus.transportCharges}
                </span>
              </div>
              <div className="flex justify-between text-slate-400 pt-1">
                <span>Status:</span>
                <span className={`font-bold ${
                  currentStudent.feeStatus.currentMonthStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {currentStudent.feeStatus.currentMonthStatus}
                </span>
              </div>
              {currentStudent.feeStatus.lastPaymentReceiptNo && (
                <div className="text-[11px] text-slate-500 pt-1">
                  Verified Receipt: #{currentStudent.feeStatus.lastPaymentReceiptNo}
                </div>
              )}
            </div>

            <button
              onClick={() => alert(`Fee voucher receipt for ${currentStudent.fullName} (PKR ${currentStudent.feeStatus.monthlyTuition + currentStudent.feeStatus.transportCharges}) generated. Verified by Indus Bright Future School Accounts Office.`)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs border border-slate-700 transition-colors"
            >
              Download Fee Challan Slip
            </button>
          </div>

          {/* Quick Contact / Message Teacher */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              Direct Message to Class Teacher
            </h3>
            <p className="text-xs text-slate-400">
              Submit leave applications, medical notifications, or inquiry regarding your child's progress.
            </p>

            <form onSubmit={handleSendMessage} className="space-y-3">
              <textarea
                rows={3}
                required
                value={teacherMessage}
                onChange={e => setTeacherMessage(e.target.value)}
                placeholder="Write your note to the class teacher..."
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Send Inquiry Note
              </button>
              {messageSent && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-600 rounded-xl text-emerald-200 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 shadow-lg animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Inquiry note delivered to Class Teacher's inbox!</span>
                  </div>
                  {onNavigateToMessages && (
                    <button
                      type="button"
                      onClick={onNavigateToMessages}
                      className="text-[11px] underline text-emerald-300 hover:text-white font-bold cursor-pointer whitespace-nowrap"
                    >
                      Open Messages Hub →
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Report Card Modal */}
      {showReportCard && (
        <ReportCardModal 
          student={currentStudent} 
          onClose={() => setShowReportCard(false)} 
        />
      )}
    </div>
  );
};
