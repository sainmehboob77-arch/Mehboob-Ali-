import React, { useState, useMemo } from 'react';
import { Student } from '../types';
import { 
  Award, 
  Search, 
  Printer, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  User, 
  GraduationCap, 
  Calendar, 
  Sparkles, 
  BarChart3, 
  Layers, 
  Filter, 
  TrendingUp, 
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Download
} from 'lucide-react';
import { ReportCardModal } from './ReportCardModal';
import { 
  calculateTermSummary, 
  AVAILABLE_EXAM_TERMS, 
  GRADING_SCALE 
} from '../utils/gradingUtils';

interface ExamResultsModuleProps {
  students: Student[];
  onNavigateToStaffEntry?: () => void;
  initialStudentId?: string;
}

export const ExamResultsModule: React.FC<ExamResultsModuleProps> = ({
  students,
  onNavigateToStaffEntry,
  initialStudentId,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudentId || (students[0]?.id ?? '')
  );
  const [selectedTermId, setSelectedTermId] = useState<string>(AVAILABLE_EXAM_TERMS[0].id);
  const [showReportCardModal, setShowReportCardModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'transcript' | 'analytics' | 'gradingScale'>('transcript');

  // Filter student list
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesGrade = selectedGrade === 'All' || s.grade === selectedGrade;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        s.fullName.toLowerCase().includes(q) ||
        s.rollNumber.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.guardian.fatherName.toLowerCase().includes(q);
      return matchesGrade && matchesSearch;
    });
  }, [students, selectedGrade, searchQuery]);

  // Selected student
  const activeStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentId) || filteredStudents[0] || students[0];
  }, [students, selectedStudentId, filteredStudents]);

  // Calculated Term Summary
  const termSummary = useMemo(() => {
    if (!activeStudent) return null;
    return calculateTermSummary(activeStudent.termResults.subjects);
  }, [activeStudent]);

  const selectedTermObj = AVAILABLE_EXAM_TERMS.find(t => t.id === selectedTermId) || AVAILABLE_EXAM_TERMS[0];

  const handleQuickDownloadPdf = () => {
    if (!activeStudent || !termSummary) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to generate and print your official Report Card.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${activeStudent.fullName} - Report Card (${selectedTermObj.name})</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; padding: 20px; line-height: 1.4; }
          .header { border-bottom: 2px solid #065f46; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
          .school-title { font-size: 22px; font-weight: 800; color: #064e3b; text-transform: uppercase; }
          .sub { font-size: 11px; color: #64748b; }
          .badge { background: #dcfce7; color: #166534; border: 1px solid #86efac; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold; }
          .meta-grid { width: 100%; border-collapse: collapse; margin-bottom: 18px; font-size: 12px; }
          .meta-grid td { padding: 6px 8px; border: 1px solid #e2e8f0; background: #f8fafc; }
          .marks-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px; }
          .marks-table th { background: #f1f5f9; padding: 8px; border: 1px solid #cbd5e1; text-align: left; font-weight: bold; }
          .marks-table td { padding: 6px 8px; border: 1px solid #e2e8f0; }
          .total-row { background: #ecfdf5; font-weight: bold; color: #064e3b; border-top: 2px solid #059669; }
          .obs-box { border: 1px solid #e2e8f0; background: #f8fafc; padding: 10px; border-radius: 6px; font-size: 11px; margin-bottom: 20px; }
          .signatures { margin-top: 35px; display: flex; justify-content: space-between; text-align: center; font-size: 11px; }
          .sig-line { width: 180px; border-top: 1px solid #94a3b8; padding-top: 4px; font-weight: bold; }
          .footer { margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 8px; font-size: 9px; color: #94a3b8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="school-title">Indus Bright Future School</div>
            <div class="sub">Adam Doki Campus, Sindh • Registered with Education & Literacy Dept, Govt of Sindh</div>
          </div>
          <div class="badge">OFFICIAL TRANSCRIPT & REPORT CARD</div>
        </div>

        <table class="meta-grid">
          <tr>
            <td><strong>Student Name:</strong> ${activeStudent.fullName}</td>
            <td><strong>Roll Number:</strong> ${activeStudent.rollNumber}</td>
            <td><strong>Student ID:</strong> ${activeStudent.id}</td>
          </tr>
          <tr>
            <td><strong>Class / Grade:</strong> ${activeStudent.grade} (${activeStudent.section})</td>
            <td><strong>Father's Name:</strong> ${activeStudent.guardian.fatherName}</td>
            <td><strong>Session / Term:</strong> ${selectedTermObj.name}</td>
          </tr>
          <tr>
            <td><strong>Attendance:</strong> ${activeStudent.attendancePercentage}%</td>
            <td><strong>Class Rank:</strong> #${activeStudent.termResults.classRank} in Class</td>
            <td><strong>Cumulative GPA:</strong> ${termSummary.gpa.toFixed(2)} / 4.00 (${termSummary.overallGrade})</td>
          </tr>
        </table>

        <table class="marks-table">
          <thead>
            <tr>
              <th>Subject Name</th>
              <th style="text-align:center;">Max Marks</th>
              <th style="text-align:center;">Marks Obtained</th>
              <th style="text-align:center;">Percentage</th>
              <th style="text-align:center;">Grade</th>
              <th style="text-align:center;">GPA Points</th>
              <th>Observations</th>
            </tr>
          </thead>
          <tbody>
            ${termSummary.enrichedSubjects.map(sub => `
              <tr>
                <td><strong>${sub.subjectName}</strong></td>
                <td style="text-align:center;">${sub.maxMarks}</td>
                <td style="text-align:center; font-weight:bold;">${sub.obtainedMarks}</td>
                <td style="text-align:center;">${Math.round((sub.obtainedMarks / sub.maxMarks) * 100)}%</td>
                <td style="text-align:center;"><strong>${sub.grade}</strong></td>
                <td style="text-align:center; font-weight:bold;">${sub.gpa ? sub.gpa.toFixed(1) : '0.0'}</td>
                <td style="font-size:11px; font-style:italic;">${sub.teacherRemarks || 'Satisfactory progress'}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td>AGGREGATE / TOTAL</td>
              <td style="text-align:center;">${termSummary.totalMarks}</td>
              <td style="text-align:center; font-size:13px;">${termSummary.obtainedMarks}</td>
              <td style="text-align:center; font-size:13px;">${termSummary.percentage}%</td>
              <td style="text-align:center; font-size:13px;">Grade ${termSummary.overallGrade}</td>
              <td style="text-align:center; font-size:13px;">${termSummary.gpa.toFixed(2)}</td>
              <td style="font-size:11px;">${termSummary.statusMessage}</td>
            </tr>
          </tfoot>
        </table>

        <div class="obs-box">
          <p><strong>Principal & Faculty Advice:</strong> "${activeStudent.termResults.teacherRemarks || 'Consistent dedication observed. Keep striving for academic excellence.'}"</p>
          <p style="margin-top: 4px;"><strong>Character & Conduct:</strong> ${activeStudent.termResults.conduct || 'Exemplary behavioral record throughout the academic term.'}</p>
        </div>

        <div class="signatures">
          <div>
            <div class="sig-line">Class In-charge</div>
            <div>Madam Farhat Shaikh</div>
          </div>
          <div>
            <div class="sig-line">Controller of Examinations</div>
            <div>Sir Abdul Jabbar</div>
          </div>
          <div>
            <div class="sig-line">Headmaster / Principal</div>
            <div>Sir Ghulam Mustafa Solangi</div>
          </div>
        </div>

        <div class="footer">
          Generated via Indus Bright Future School E-Results Portal • Adam Doki Campus • Official Document
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 border border-emerald-500/20 shadow-2xl p-6 sm:p-10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 -mb-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Award className="w-5 h-5" />
              </span>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300">
                <span>Indus Bright Future School Adam Doki</span>
                <span>·</span>
                <span className="text-emerald-400">Examinations & Grading Registry</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Academic Exam Results & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">Official Report Cards</span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Transparent term assessment records with automatically calculated letter grades (A-1 to F) and cumulative GPAs (out of 4.00) in accordance with the Sindh Board (BISE) curriculum standards.
            </p>
          </div>

          {/* Quick Actions / Jump to Staff */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {onNavigateToStaffEntry && (
              <button
                onClick={onNavigateToStaffEntry}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <FileText className="w-4 h-4" />
                Staff Marks Entry Portal
              </button>
            )}
            <button
              onClick={() => setShowReportCardModal(true)}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-emerald-500/40 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4" />
              Print Report Card
            </button>
          </div>
        </div>

        {/* Exam Term Selector Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-300">Select Exam Session:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {AVAILABLE_EXAM_TERMS.map(term => {
              const isSelected = selectedTermId === term.id;
              return (
                <button
                  key={term.id}
                  onClick={() => setSelectedTermId(term.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 ring-2 ring-emerald-400/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                  }`}
                >
                  {term.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Layout: Search & Student Selection (Left) + Performance & Transcript (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Student Roster & Filters (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                Find Student Report
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {filteredStudents.length} Students
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name, roll no, or ID..."
                className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Grade Filter Pills */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Class / Grade:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {['All', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'].map(g => (
                  <button
                    key={g}
                    onClick={() => setSelectedGrade(g)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      selectedGrade === g
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Student List */}
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No students match the criteria.
                </div>
              ) : (
                filteredStudents.map(student => {
                  const isSelected = activeStudent?.id === student.id;
                  const sSummary = calculateTermSummary(student.termResults.subjects);
                  return (
                    <div
                      key={student.id}
                      onClick={() => setSelectedStudentId(student.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md'
                          : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={student.avatarUrl}
                          alt={student.fullName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-600 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold truncate text-white">
                            {student.fullName}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate">
                            Roll #{student.rollNumber} · {student.grade} ({student.section})
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold font-mono text-emerald-400">
                          GPA {sSummary.gpa.toFixed(1)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Grade {sSummary.overallGrade}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Transcript, GPA Cards & Analysis (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {activeStudent && termSummary ? (
            <>
              {/* Comprehensive Top Summary Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={activeStudent.avatarUrl}
                      alt={activeStudent.fullName}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-md"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-black text-white">
                          {activeStudent.fullName}
                        </h2>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                          {activeStudent.grade} - {activeStudent.section}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Father's Name: <strong className="text-slate-200">{activeStudent.guardian.fatherName}</strong> · Roll No: <span className="font-mono text-emerald-400 font-bold">{activeStudent.rollNumber}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleQuickDownloadPdf}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Download clean printable A4 format"
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      PDF Download
                    </button>
                    <button
                      onClick={() => setShowReportCardModal(true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                    >
                      <Printer className="w-4 h-4" />
                      Official Report Card
                    </button>
                  </div>
                </div>

                {/* Key Metrics Row: GPA, Percentage, Grade, Position */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Cumulative GPA */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-800/60 text-center space-y-1">
                    <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
                      Cumulative GPA
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                      {termSummary.gpa.toFixed(2)}
                      <span className="text-xs text-emerald-400 font-normal"> / 4.0</span>
                    </div>
                    <span className="text-[10px] text-emerald-400/80 font-medium block">
                      Scale: 4.00 (Weighted)
                    </span>
                  </div>

                  {/* Overall Percentage */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-950/80 to-slate-900 border border-teal-800/60 text-center space-y-1">
                    <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider block">
                      Total Percentage
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                      {termSummary.percentage}%
                    </div>
                    <span className="text-[10px] text-teal-400/80 font-medium block">
                      {termSummary.obtainedMarks} / {termSummary.totalMarks} Marks
                    </span>
                  </div>

                  {/* Calculated Grade */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/80 to-slate-900 border border-amber-800/60 text-center space-y-1">
                    <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                      Board Grade
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                      Grade {termSummary.overallGrade}
                    </div>
                    <span className="text-[10px] text-amber-300/80 font-medium block">
                      {termSummary.statusMessage.split(' ')[0]}
                    </span>
                  </div>

                  {/* Class Position */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-indigo-800/60 text-center space-y-1">
                    <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
                      Class Position
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                      #{activeStudent.termResults.classRank}
                    </div>
                    <span className="text-[10px] text-indigo-300/80 font-medium block">
                      In Class {activeStudent.grade}
                    </span>
                  </div>
                </div>

                {/* Sub-tabs: Transcript vs Analytics vs Grading Scale */}
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <button
                    onClick={() => setActiveTab('transcript')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                      activeTab === 'transcript'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Subject-Wise Transcript
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                      activeTab === 'analytics'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    Performance Analytics
                  </button>
                  <button
                    onClick={() => setActiveTab('gradingScale')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                      activeTab === 'gradingScale'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Grading & GPA Scale
                  </button>
                </div>

                {/* TAB 1: SUBJECT-WISE TRANSCRIPT */}
                {activeTab === 'transcript' && (
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                            <th className="py-3 px-3">Subject Name</th>
                            <th className="py-3 px-2 text-center">Max Marks</th>
                            <th className="py-3 px-2 text-center">Marks Obtained</th>
                            <th className="py-3 px-2 text-center">Score %</th>
                            <th className="py-3 px-2 text-center">Grade</th>
                            <th className="py-3 px-2 text-center">GPA (4.0)</th>
                            <th className="py-3 px-3">Teacher Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80">
                          {termSummary.enrichedSubjects.map((sub, idx) => {
                            const pct = Math.round((sub.obtainedMarks / sub.maxMarks) * 100);
                            return (
                              <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                                <td className="py-3 px-3 font-semibold text-white">
                                  {sub.subjectName}
                                </td>
                                <td className="py-3 px-2 text-center font-mono text-slate-400">
                                  {sub.maxMarks}
                                </td>
                                <td className="py-3 px-2 text-center font-mono font-bold text-white">
                                  {sub.obtainedMarks}
                                </td>
                                <td className="py-3 px-2 text-center font-mono">
                                  <span className={`font-bold ${
                                    pct >= 80 ? 'text-emerald-400' :
                                    pct >= 60 ? 'text-teal-400' :
                                    pct >= 40 ? 'text-amber-400' : 'text-rose-400'
                                  }`}>
                                    {pct}%
                                  </span>
                                </td>
                                <td className="py-3 px-2 text-center">
                                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                    sub.grade.includes('A') ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                                    sub.grade.includes('B') ? 'bg-teal-950 text-teal-300 border border-teal-700' :
                                    sub.grade.includes('C') ? 'bg-sky-950 text-sky-300 border border-sky-700' :
                                    'bg-rose-950 text-rose-300 border border-rose-700'
                                  }`}>
                                    {sub.grade}
                                  </span>
                                </td>
                                <td className="py-3 px-2 text-center font-mono font-bold text-emerald-400">
                                  {sub.gpa ? sub.gpa.toFixed(1) : '0.0'}
                                </td>
                                <td className="py-3 px-3 text-slate-400 text-[11px] italic">
                                  {sub.teacherRemarks || 'Active subject engagement'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="border-t-2 border-emerald-500/60 bg-emerald-950/30 font-bold text-white">
                            <td className="py-3 px-3 uppercase">Total / Cumulative</td>
                            <td className="py-3 px-2 text-center font-mono">{termSummary.totalMarks}</td>
                            <td className="py-3 px-2 text-center font-mono text-emerald-400 text-sm font-black">{termSummary.obtainedMarks}</td>
                            <td className="py-3 px-2 text-center font-mono text-emerald-400 text-sm font-black">{termSummary.percentage}%</td>
                            <td className="py-3 px-2 text-center text-emerald-300 font-bold">Grade {termSummary.overallGrade}</td>
                            <td className="py-3 px-2 text-center font-mono text-emerald-400 text-sm font-black">{termSummary.gpa.toFixed(2)}</td>
                            <td className="py-3 px-3 text-xs text-emerald-300 font-medium">{termSummary.statusMessage}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Faculty Remarks Box */}
                    <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                        Headmaster & Class Teacher Assessment:
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed italic">
                        "{activeStudent.termResults.teacherRemarks || 'Consistent revision and disciplined coursework displayed. Candidate is prepared for next academic level.'}"
                      </p>
                      <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-700/60">
                        <span>Conduct: <strong className="text-slate-200">{activeStudent.termResults.conduct || 'Exemplary'}</strong></span>
                        <span>Attendance: <strong className="text-emerald-400">{activeStudent.attendancePercentage}%</strong></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: ANALYTICS & VISUAL PROGRESS */}
                {activeTab === 'analytics' && (
                  <div className="space-y-5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Subject Proficiency Visual Meter
                    </h4>
                    <div className="space-y-3">
                      {termSummary.enrichedSubjects.map((sub, i) => {
                        const pct = Math.round((sub.obtainedMarks / sub.maxMarks) * 100);
                        return (
                          <div key={i} className="space-y-1.5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-white">{sub.subjectName}</span>
                              <span className="font-mono text-slate-300">
                                {sub.obtainedMarks} / {sub.maxMarks} ({pct}%) · Grade {sub.grade} (GPA {sub.gpa?.toFixed(1)})
                              </span>
                            </div>
                            <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  pct >= 85 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                                  pct >= 75 ? 'bg-emerald-500' :
                                  pct >= 65 ? 'bg-sky-500' :
                                  pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${Math.min(100, Math.max(5, pct))}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 3: GRADING SCALE KEY */}
                {activeTab === 'gradingScale' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Official Sindh BISE & School Grading Criteria
                      </h4>
                      <span className="text-xs text-emerald-400 font-semibold">4.0 Scale System</span>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-800">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-800 text-slate-300 text-[11px] font-bold">
                            <th className="py-2.5 px-3">Percentage Range</th>
                            <th className="py-2.5 px-3">Letter Grade</th>
                            <th className="py-2.5 px-3">Grade Point (GPA)</th>
                            <th className="py-2.5 px-3">Standard Academic Remark</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {GRADING_SCALE.map((item, index) => (
                            <tr key={index} className="hover:bg-slate-800/40">
                              <td className="py-2.5 px-3 font-mono text-slate-300">
                                {item.minPercentage}% – {item.maxPercentage}%
                              </td>
                              <td className="py-2.5 px-3">
                                <span className={`px-2 py-0.5 rounded font-bold text-xs ${item.colorClass}`}>
                                  Grade {item.grade}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 font-bold font-mono text-white">
                                {item.gpa.toFixed(1)}
                              </td>
                              <td className="py-2.5 px-3 text-slate-300">
                                {item.description}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-400">
              Please select a student from the left panel to inspect their exam report card.
            </div>
          )}
        </div>
      </div>

      {/* Official Report Card Modal */}
      {showReportCardModal && activeStudent && (
        <ReportCardModal
          student={activeStudent}
          onClose={() => setShowReportCardModal(false)}
        />
      )}
    </div>
  );
};
