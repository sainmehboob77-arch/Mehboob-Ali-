import React, { useState, useMemo } from 'react';
import { Student, SubjectScore } from '../types';
import { 
  Award, 
  Search, 
  Save, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  FileText, 
  Calendar, 
  RefreshCw, 
  Sparkles, 
  User, 
  Filter, 
  Layers,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { 
  calculateSubjectGradeAndGpa, 
  calculateTermSummary, 
  getDefaultSubjectsForGrade, 
  AVAILABLE_EXAM_TERMS, 
  GRADING_SCALE 
} from '../utils/gradingUtils';

interface StaffExamEntryProps {
  students: Student[];
  onUpdateStudent: (student: Student) => void;
  onViewReportCard?: (student: Student) => void;
}

export const StaffExamEntry: React.FC<StaffExamEntryProps> = ({
  students,
  onUpdateStudent,
  onViewReportCard,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('Grade 9');
  const [selectedTermId, setSelectedTermId] = useState<string>(AVAILABLE_EXAM_TERMS[0].id);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Filter students for the selected class
  const classStudents = useMemo(() => {
    return students.filter(s => s.grade === selectedGrade);
  }, [students, selectedGrade]);

  // Set initial selected student when grade changes
  const activeStudent = useMemo(() => {
    if (selectedStudentId) {
      const found = students.find(s => s.id === selectedStudentId);
      if (found) return found;
    }
    return classStudents[0] || students[0];
  }, [students, selectedStudentId, classStudents]);

  // Local editable draft state for the active student's marks
  const [subjectsDraft, setSubjectsDraft] = useState<SubjectScore[]>([]);
  const [conductDraft, setConductDraft] = useState<string>('');
  const [teacherRemarksDraft, setTeacherRemarksDraft] = useState<string>('');
  const [classRankDraft, setClassRankDraft] = useState<number>(1);
  const [lastLoadedStudentId, setLastLoadedStudentId] = useState<string>('');

  // New custom subject input state
  const [newSubjectName, setNewSubjectName] = useState<string>('');
  const [newSubjectMaxMarks, setNewSubjectMaxMarks] = useState<number>(100);
  const [showAddSubjectForm, setShowAddSubjectForm] = useState<boolean>(false);

  // Sync draft when selected student changes
  if (activeStudent && activeStudent.id !== lastLoadedStudentId) {
    setLastLoadedStudentId(activeStudent.id);
    setSubjectsDraft(
      activeStudent.termResults.subjects && activeStudent.termResults.subjects.length > 0
        ? [...activeStudent.termResults.subjects]
        : getDefaultSubjectsForGrade(activeStudent.grade).map(sub => ({
            subjectName: sub.subjectName,
            maxMarks: sub.maxMarks,
            obtainedMarks: 75,
            grade: 'A',
            gpa: 3.7,
            teacherRemarks: 'Active participation and good conceptual grasp.',
          }))
    );
    setConductDraft(activeStudent.termResults.conduct || 'Exemplary behavioral conduct and leadership.');
    setTeacherRemarksDraft(
      activeStudent.termResults.teacherRemarks ||
      'Dedicated student with strong academic focus. Recommended for competitive science contests.'
    );
    setClassRankDraft(activeStudent.termResults.classRank || 1);
  }

  // Real-time calculation of draft results
  const liveSummary = useMemo(() => {
    return calculateTermSummary(subjectsDraft);
  }, [subjectsDraft]);

  // Update mark for a specific subject
  const handleMarkChange = (index: number, newObtained: number) => {
    setSubjectsDraft(prev => {
      const updated = [...prev];
      const target = updated[index];
      const safeObtained = Math.max(0, Math.min(newObtained, target.maxMarks));
      const { grade, gpa } = calculateSubjectGradeAndGpa(safeObtained, target.maxMarks);

      updated[index] = {
        ...target,
        obtainedMarks: safeObtained,
        grade,
        gpa,
      };
      return updated;
    });
  };

  // Update max marks for a specific subject
  const handleMaxMarksChange = (index: number, newMax: number) => {
    setSubjectsDraft(prev => {
      const updated = [...prev];
      const target = updated[index];
      const safeMax = Math.max(10, newMax);
      const safeObtained = Math.min(target.obtainedMarks, safeMax);
      const { grade, gpa } = calculateSubjectGradeAndGpa(safeObtained, safeMax);

      updated[index] = {
        ...target,
        maxMarks: safeMax,
        obtainedMarks: safeObtained,
        grade,
        gpa,
      };
      return updated;
    });
  };

  // Update remarks for a specific subject
  const handleSubjectRemarkChange = (index: number, remarks: string) => {
    setSubjectsDraft(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        teacherRemarks: remarks,
      };
      return updated;
    });
  };

  // Remove a subject
  const handleRemoveSubject = (index: number) => {
    if (subjectsDraft.length <= 1) {
      alert('A report card must have at least 1 subject.');
      return;
    }
    setSubjectsDraft(prev => prev.filter((_, i) => i !== index));
  };

  // Add new subject
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    const { grade, gpa } = calculateSubjectGradeAndGpa(75, newSubjectMaxMarks);
    const newSubject: SubjectScore = {
      subjectName: newSubjectName.trim(),
      maxMarks: newSubjectMaxMarks,
      obtainedMarks: Math.round(newSubjectMaxMarks * 0.75),
      grade,
      gpa,
      teacherRemarks: 'Good performance in subject evaluations.',
    };

    setSubjectsDraft(prev => [...prev, newSubject]);
    setNewSubjectName('');
    setShowAddSubjectForm(false);
  };

  // Reset to default standard curriculum subjects for this student's grade
  const handleLoadDefaultCurriculum = () => {
    if (!activeStudent) return;
    if (window.confirm(`Load default curriculum subjects for ${activeStudent.grade}? This will replace current subjects in draft.`)) {
      const defaultSubs = getDefaultSubjectsForGrade(activeStudent.grade).map(sub => {
        const { grade, gpa } = calculateSubjectGradeAndGpa(75, sub.maxMarks);
        return {
          subjectName: sub.subjectName,
          maxMarks: sub.maxMarks,
          obtainedMarks: Math.round(sub.maxMarks * 0.75),
          grade,
          gpa,
          teacherRemarks: 'Consistent conceptual understanding.',
        };
      });
      setSubjectsDraft(defaultSubs);
    }
  };

  // Save changes to student record
  const handleSaveStudentMarks = () => {
    if (!activeStudent) return;

    const termObj = AVAILABLE_EXAM_TERMS.find(t => t.id === selectedTermId) || AVAILABLE_EXAM_TERMS[0];
    const summary = calculateTermSummary(subjectsDraft);

    const updatedStudent: Student = {
      ...activeStudent,
      termResults: {
        termName: termObj.name,
        academicYear: termObj.academicYear,
        subjects: summary.enrichedSubjects,
        totalMarks: summary.totalMarks,
        obtainedMarks: summary.obtainedMarks,
        percentage: summary.percentage,
        overallGrade: summary.overallGrade,
        gpa: summary.gpa,
        classRank: classRankDraft,
        conduct: conductDraft,
        teacherRemarks: teacherRemarksDraft,
        headmasterSignature: 'Sir Ghulam Mustafa Solangi (Principal)',
      },
    };

    onUpdateStudent(updatedStudent);
    setSaveSuccessMessage(`Examination marks & GPA (${summary.gpa.toFixed(2)}) updated for ${activeStudent.fullName}!`);
    setTimeout(() => setSaveSuccessMessage(null), 4000);
  };

  const GRADES_LIST = [
    'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
    'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-1">
              <Award className="w-4 h-4" /> Academic Examination Results Registry
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Student Marks Entry & GPA Calculation Console
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Input obtained marks per subject. Letter grades and cumulative GPA (out of 4.00) are automatically computed according to the Sindh Board evaluation standard.
            </p>
          </div>

          {/* Term Selector */}
          <div className="bg-slate-800/90 border border-slate-700 p-2.5 rounded-2xl shrink-0">
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Exam Session / Term:
            </label>
            <select
              value={selectedTermId}
              onChange={e => setSelectedTermId(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {AVAILABLE_EXAM_TERMS.map(term => (
                <option key={term.id} value={term.id}>
                  {term.name} ({term.academicYear})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grade Selector Row */}
        <div className="pt-2 border-t border-slate-800 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5 text-emerald-400" /> Class:
          </span>
          {GRADES_LIST.map(grade => {
            const isSelected = selectedGrade === grade;
            return (
              <button
                key={grade}
                onClick={() => {
                  setSelectedGrade(grade);
                  setSelectedStudentId('');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 ring-2 ring-emerald-400/40'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {grade}
              </button>
            );
          })}
        </div>
      </div>

      {/* Success Notification Alert */}
      {saveSuccessMessage && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-emerald-950/40 border border-emerald-500 animate-fadeIn">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </div>
          <span className="text-xs text-emerald-200">Database Synced</span>
        </div>
      )}

      {/* Main Workspace: Left (Students Roster in Selected Class) + Right (Mark Sheet Input Form) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Student List in Class (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Students in {selectedGrade}
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                {classStudents.length} Students
              </span>
            </div>

            {classStudents.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No students enrolled in {selectedGrade}. Select another class or enroll students.
              </div>
            ) : (
              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {classStudents.map(student => {
                  const isSelected = activeStudent?.id === student.id;
                  const currentGpa = student.termResults.gpa !== undefined 
                    ? student.termResults.gpa 
                    : calculateTermSummary(student.termResults.subjects).gpa;

                  return (
                    <div
                      key={student.id}
                      onClick={() => setSelectedStudentId(student.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                        isSelected
                          ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500/40'
                          : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={student.avatarUrl}
                          alt={student.fullName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold truncate text-white">
                            {student.fullName}
                          </h4>
                          <p className="text-[10px] text-slate-400 truncate">
                            Roll #{student.rollNumber} · {student.section}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold font-mono text-emerald-400 block">
                          GPA {currentGpa.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Grade {student.termResults.overallGrade}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Mark Sheet Editor (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {activeStudent ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
              {/* Student Header & Live Calculated GPA Overview */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="flex items-center gap-3.5">
                  <img
                    src={activeStudent.avatarUrl}
                    alt={activeStudent.fullName}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shadow"
                  />
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      {activeStudent.fullName}
                    </h3>
                    <p className="text-xs text-slate-400">
                      ID: <span className="font-mono text-slate-200">{activeStudent.id}</span> · Roll: <strong className="text-emerald-400">{activeStudent.rollNumber}</strong> · Class: {activeStudent.grade} ({activeStudent.section})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onViewReportCard && (
                    <button
                      onClick={() => onViewReportCard(activeStudent)}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-emerald-400" />
                      Preview Report Card
                    </button>
                  )}
                  <button
                    onClick={handleSaveStudentMarks}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/60 transition-all cursor-pointer hover:scale-[1.02]"
                  >
                    <Save className="w-4 h-4" />
                    Save & Update Marks
                  </button>
                </div>
              </div>

              {/* Real-time Calculated Metrics Preview Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Cumulative GPA (4.0)
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                    {liveSummary.gpa.toFixed(2)}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Total Score
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-white font-mono">
                    {liveSummary.obtainedMarks} <span className="text-xs text-slate-400 font-normal">/ {liveSummary.totalMarks}</span>
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Aggregate %
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-teal-400 font-mono">
                    {liveSummary.percentage}%
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Calculated Grade
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                    Grade {liveSummary.overallGrade}
                  </span>
                </div>
              </div>

              {/* Subject Marks Entry Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-400" /> Subject Marks & Remarks
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleLoadDefaultCurriculum}
                      className="px-2.5 py-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 rounded-lg hover:bg-emerald-900/60 transition-colors cursor-pointer"
                    >
                      Reset to Standard Curriculum
                    </button>
                    <button
                      onClick={() => setShowAddSubjectForm(prev => !prev)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-white bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                      Add Subject
                    </button>
                  </div>
                </div>

                {/* Add Subject Collapsible Form */}
                {showAddSubjectForm && (
                  <form onSubmit={handleAddSubject} className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Subject Name:
                      </label>
                      <input
                        type="text"
                        value={newSubjectName}
                        onChange={e => setNewSubjectName(e.target.value)}
                        placeholder="e.g. Computer Science Practical"
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div className="w-28">
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Max Marks:
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="200"
                        value={newSubjectMaxMarks}
                        onChange={e => setNewSubjectMaxMarks(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="flex items-end gap-2 pt-4">
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddSubjectForm(false)}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Marks Entry Grid */}
                <div className="overflow-x-auto rounded-2xl border border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-bold">
                        <th className="py-2.5 px-3">Subject Name</th>
                        <th className="py-2.5 px-2 text-center w-20">Max Marks</th>
                        <th className="py-2.5 px-2 text-center w-28">Obtained Marks</th>
                        <th className="py-2.5 px-2 text-center w-16">Grade</th>
                        <th className="py-2.5 px-2 text-center w-16">GPA</th>
                        <th className="py-2.5 px-3">Subject Teacher Remarks</th>
                        <th className="py-2.5 px-2 text-center w-10">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {subjectsDraft.map((sub, index) => {
                        const { grade, gpa } = calculateSubjectGradeAndGpa(sub.obtainedMarks, sub.maxMarks);
                        const pct = Math.round((sub.obtainedMarks / sub.maxMarks) * 100);

                        return (
                          <tr key={index} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-2 px-3 font-semibold text-white">
                              {sub.subjectName}
                            </td>

                            <td className="py-2 px-2 text-center">
                              <input
                                type="number"
                                min="10"
                                max="200"
                                value={sub.maxMarks}
                                onChange={e => handleMaxMarksChange(index, Number(e.target.value))}
                                className="w-16 px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-center text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
                              />
                            </td>

                            <td className="py-2 px-2 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <input
                                  type="number"
                                  min="0"
                                  max={sub.maxMarks}
                                  value={sub.obtainedMarks}
                                  onChange={e => handleMarkChange(index, Number(e.target.value))}
                                  className="w-16 px-2 py-1 bg-slate-800 border border-emerald-500/60 rounded-lg text-xs font-bold text-center text-white font-mono focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                                />
                                <span className="text-[10px] text-slate-400 font-mono">({pct}%)</span>
                              </div>
                            </td>

                            <td className="py-2 px-2 text-center">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                grade.includes('A') ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                                grade.includes('B') ? 'bg-teal-950 text-teal-300 border border-teal-700' :
                                grade.includes('C') ? 'bg-sky-950 text-sky-300 border border-sky-700' :
                                'bg-rose-950 text-rose-300 border border-rose-700'
                              }`}>
                                {grade}
                              </span>
                            </td>

                            <td className="py-2 px-2 text-center font-bold font-mono text-emerald-400">
                              {gpa.toFixed(1)}
                            </td>

                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={sub.teacherRemarks}
                                onChange={e => handleSubjectRemarkChange(index, e.target.value)}
                                placeholder="Enter specific observations..."
                                className="w-full px-2.5 py-1 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                              />
                            </td>

                            <td className="py-2 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveSubject(index)}
                                className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                                title="Remove Subject"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-emerald-950/40 font-bold border-t-2 border-emerald-600 text-white">
                        <td className="py-3 px-3 uppercase">Total / Calculated Result</td>
                        <td className="py-3 px-2 text-center font-mono">{liveSummary.totalMarks}</td>
                        <td className="py-3 px-2 text-center font-mono text-emerald-400 text-sm font-black">
                          {liveSummary.obtainedMarks} ({liveSummary.percentage}%)
                        </td>
                        <td className="py-3 px-2 text-center text-emerald-400">
                          Grade {liveSummary.overallGrade}
                        </td>
                        <td className="py-3 px-2 text-center font-mono text-emerald-400 text-sm font-black">
                          {liveSummary.gpa.toFixed(2)}
                        </td>
                        <td colSpan={2} className="py-3 px-3 text-xs text-emerald-300 font-medium">
                          {liveSummary.statusMessage}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Extra Student Assessment Fields: Rank, Conduct & Teacher Remarks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Class Rank / Position:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={classRankDraft}
                    onChange={e => setClassRankDraft(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Moral Conduct & Character:
                  </label>
                  <input
                    type="text"
                    value={conductDraft}
                    onChange={e => setConductDraft(e.target.value)}
                    placeholder="e.g. Exemplary discipline, respectful towards peers and faculty."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Headmaster & Class Teacher Remarks:
                  </label>
                  <textarea
                    rows={2}
                    value={teacherRemarksDraft}
                    onChange={e => setTeacherRemarksDraft(e.target.value)}
                    placeholder="Overall comprehensive advice for the student's report card..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
              </div>

              {/* Bottom Action Row */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  Auto-calculated scale: <strong className="text-white">Sindh BISE 4.0 GPA</strong>
                </div>
                <button
                  onClick={handleSaveStudentMarks}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/60 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <Save className="w-4 h-4" />
                  Save Student Marks & Recalculate GPA
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-400">
              Please select a student from the class roster.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
