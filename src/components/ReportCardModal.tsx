import React from 'react';
import { Student } from '../types';
import { Printer, X, Award, CheckCircle, ShieldCheck, GraduationCap, Sparkles } from 'lucide-react';
import { calculateTermSummary, GRADING_SCALE } from '../utils/gradingUtils';

interface ReportCardModalProps {
  student: Student;
  onClose: () => void;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({ student, onClose }) => {
  const result = student.termResults;
  const summary = calculateTermSummary(result.subjects);
  const displayGpa = result.gpa !== undefined ? result.gpa : summary.gpa;
  const displayOverallGrade = result.overallGrade || summary.overallGrade;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white text-slate-900 rounded-2xl max-w-4xl w-full my-8 shadow-2xl overflow-hidden border border-slate-300 print:shadow-none print:border-none print:m-0 print:max-w-none">
        {/* Modal Action Bar (Hidden in Print) */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm sm:text-base">Official Progress Report Card & Transcript</h3>
            <span className="bg-emerald-800 text-emerald-200 text-xs px-2 py-0.5 rounded font-mono">
              GPA: {displayGpa.toFixed(2)} / 4.00
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document */}
        <div className="p-8 sm:p-12 space-y-6 print:p-6 print:space-y-4">
          {/* Official Letterhead */}
          <div className="border-b-2 border-emerald-800 pb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white flex items-center justify-center p-2 shadow">
                <GraduationCap className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-emerald-900 uppercase">
                  Indus Bright Future School
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-slate-700">
                  Adam Doki Campus, Sindh, Pakistan
                </p>
                <p className="text-[11px] text-slate-500">
                  Registered under Education & Literacy Dept, Govt of Sindh • Affiliated with Board of Intermediate & Secondary Education
                </p>
              </div>
            </div>

            <div className="text-right border-l-2 border-slate-200 pl-4">
              <div className="bg-emerald-50 text-emerald-900 font-bold px-3 py-1 rounded text-xs border border-emerald-200">
                OFFICIAL REPORT CARD
              </div>
              <div className="text-xs text-slate-600 mt-1 font-medium">{result.termName}</div>
              <div className="text-[11px] text-slate-500">Session: {result.academicYear}</div>
            </div>
          </div>

          {/* Student Bio-data Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Student Name:</span>
              <span className="font-bold text-slate-900 text-sm">{student.fullName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Registration / Roll:</span>
              <span className="font-mono font-bold text-emerald-700">{student.id} ({student.rollNumber})</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Class & Section:</span>
              <span className="font-bold text-slate-900">{student.grade} - {student.section}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Father's Name:</span>
              <span className="font-bold text-slate-900">{student.guardian.fatherName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Attendance Rate:</span>
              <span className="font-bold text-emerald-700">{student.attendancePercentage}%</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Class Rank / Position:</span>
              <span className="font-bold text-teal-700">#{result.classRank} in Class</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Cumulative GPA:</span>
              <span className="font-bold text-emerald-800 text-sm font-mono">{displayGpa.toFixed(2)} / 4.00</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Overall Grade:</span>
              <span className="font-bold text-emerald-900 text-sm font-mono">Grade {displayOverallGrade}</span>
            </div>
            <div className="col-span-2 sm:col-span-4">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Residential Address:</span>
              <span className="text-slate-700 truncate block">{student.guardian.residentialAddress}</span>
            </div>
          </div>

          {/* Subject Assessment Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <th className="py-2.5 px-3">Subject Name</th>
                  <th className="py-2.5 px-3 text-center">Max Marks</th>
                  <th className="py-2.5 px-3 text-center">Marks Obtained</th>
                  <th className="py-2.5 px-3 text-center">Percentage</th>
                  <th className="py-2.5 px-3 text-center">Grade</th>
                  <th className="py-2.5 px-3 text-center">GPA (4.0)</th>
                  <th className="py-2.5 px-3">Teacher Observations & Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {summary.enrichedSubjects.map((sub, i) => {
                  const pct = Math.round((sub.obtainedMarks / sub.maxMarks) * 100);
                  return (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-semibold text-slate-900">{sub.subjectName}</td>
                      <td className="py-2 px-3 text-center text-slate-600 font-mono">{sub.maxMarks}</td>
                      <td className="py-2 px-3 text-center font-bold text-slate-900 font-mono">{sub.obtainedMarks}</td>
                      <td className="py-2 px-3 text-center text-slate-700 font-medium font-mono">{pct}%</td>
                      <td className="py-2 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          sub.grade.includes('A') ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                          sub.grade.includes('B') ? 'bg-sky-100 text-sky-800 border border-sky-300' :
                          sub.grade.includes('C') ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                          'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}>
                          {sub.grade}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center font-bold font-mono text-slate-800">
                        {sub.gpa ? sub.gpa.toFixed(1) : '0.0'}
                      </td>
                      <td className="py-2 px-3 text-slate-600 text-[11px] italic">{sub.teacherRemarks || 'Satisfactory participation'}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-emerald-50 font-bold text-slate-900 border-t-2 border-emerald-700">
                  <td className="py-3 px-3">TOTAL / AGGREGATE</td>
                  <td className="py-3 px-3 text-center font-mono">{summary.totalMarks}</td>
                  <td className="py-3 px-3 text-center text-emerald-800 text-sm font-black font-mono">{summary.obtainedMarks}</td>
                  <td className="py-3 px-3 text-center text-emerald-800 text-sm font-black font-mono">{summary.percentage}%</td>
                  <td className="py-3 px-3 text-center text-emerald-900 text-sm font-black">{displayOverallGrade}</td>
                  <td className="py-3 px-3 text-center text-emerald-900 text-sm font-black font-mono">{displayGpa.toFixed(2)}</td>
                  <td className="py-3 px-3 text-xs text-emerald-900 font-semibold">{summary.statusMessage}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Conduct & Teacher Observations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="font-bold text-slate-800 block text-[10px] uppercase tracking-wider">Moral Conduct & Character:</span>
              <p className="text-slate-700 leading-relaxed">{result.conduct || 'Exemplary discipline and respectful behavior towards peers and faculty.'}</p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="font-bold text-slate-800 block text-[10px] uppercase tracking-wider">Class Teacher & Principal Remarks:</span>
              <p className="text-slate-700 leading-relaxed italic">"{result.teacherRemarks || 'Demonstrates keen enthusiasm in coursework. Advised to maintain consistent study revision schedule.'}"</p>
            </div>
          </div>

          {/* BISE Grading Scale Legend */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-600 space-y-1">
            <span className="font-bold uppercase tracking-wider text-slate-700 block">Sindh Board & School Grading Key:</span>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {GRADING_SCALE.map((g, idx) => (
                <span key={idx} className="flex items-center gap-1">
                  <strong>Grade {g.grade}:</strong> {g.minPercentage}%-{g.maxPercentage}% (GPA {g.gpa.toFixed(1)})
                </span>
              ))}
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-8 grid grid-cols-3 gap-6 text-center text-xs">
            <div>
              <div className="border-b border-slate-400 pb-1 font-semibold text-slate-800">Madam Farhat Shaikh</div>
              <span className="text-[10px] text-slate-500 uppercase mt-1 block">Class In-charge</span>
            </div>
            <div>
              <div className="border-b border-slate-400 pb-1 font-semibold text-slate-800">Sir Abdul Jabbar</div>
              <span className="text-[10px] text-slate-500 uppercase mt-1 block">Controller of Examinations</span>
            </div>
            <div>
              <div className="border-b border-slate-400 pb-1 font-semibold text-emerald-900">Sir Ghulam Mustafa Solangi</div>
              <span className="text-[10px] text-slate-500 uppercase mt-1 block">Headmaster / Principal</span>
            </div>
          </div>

          {/* Footer watermark note */}
          <div className="pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400">
            This transcript is electronically computed & verified by Indus Bright Future School Academic Management System • Adam Doki, Sindh
          </div>
        </div>
      </div>
    </div>
  );
};
