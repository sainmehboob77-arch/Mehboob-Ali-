import React, { useState } from 'react';
import { Teacher, Student } from '../types';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit3, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  Award, 
  Download, 
  Sparkles, 
  FileText, 
  ChevronRight, 
  Eye, 
  GraduationCap,
  MessageSquare,
  TrendingUp 
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { ReportCardModal } from './ReportCardModal';
import { StaffExamEntry } from './StaffExamEntry';
import { AttendanceAnalyticsDashboard } from './AttendanceAnalyticsDashboard';

interface StaffPortalProps {
  teachers: Teacher[];
  students: Student[];
  onAddTeacher: (teacher: Teacher) => void;
  onUpdateTeacher: (teacher: Teacher) => void;
  onRecordAttendance: (studentId: string, status: 'Present' | 'Absent' | 'Late') => void;
  onUpdateStudent: (student: Student) => void;
  onNavigateToAdmissions: () => void;
  onNavigateToMessages?: () => void;
}

export const StaffPortal: React.FC<StaffPortalProps> = ({
  teachers,
  students,
  onAddTeacher,
  onUpdateTeacher,
  onRecordAttendance,
  onUpdateStudent,
  onNavigateToAdmissions,
  onNavigateToMessages,
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'teachers' | 'analytics' | 'attendance' | 'examMarks' | 'aiRemarks'>('analytics');
  
  // Search & Filter
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState('All');
  const [teacherSearch, setTeacherSearch] = useState('');
  
  // Selected Student for View/Report
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [reportCardStudent, setReportCardStudent] = useState<Student | null>(null);

  // Add Teacher Form State
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [newTeacherData, setNewTeacherData] = useState<Partial<Teacher>>({
    name: '',
    designation: 'Subject Specialist',
    department: 'Science',
    qualification: 'M.Sc / B.Ed',
    experienceYears: 5,
    phone: '+92 300 0000000',
    email: '',
    address: 'Adam Doki, Sindh',
    assignedClasses: ['Grade 9', 'Grade 10'],
    subjects: ['Science'],
    status: 'Active',
  });

  // AI Remarks Generator State
  const [selectedStudentForAI, setSelectedStudentForAI] = useState<Student>(students[0]);
  const [generatedRemarks, setGeneratedRemarks] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // Filtered Students
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.rollNumber.includes(studentSearch) ||
      s.guardian.fatherName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.id.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesGrade = selectedGradeFilter === 'All' || s.grade === selectedGradeFilter;
    return matchesSearch && matchesGrade;
  });

  // Filtered Teachers
  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
    t.department.toLowerCase().includes(teacherSearch.toLowerCase()) ||
    t.subjects.some(sub => sub.toLowerCase().includes(teacherSearch.toLowerCase()))
  );

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    const createdTeacher: Teacher = {
      id: `TCH-${Date.now().toString().slice(-3)}`,
      name: newTeacherData.name || 'New Teacher',
      designation: newTeacherData.designation || 'Specialist',
      department: newTeacherData.department || 'Science',
      qualification: newTeacherData.qualification || 'M.Sc',
      experienceYears: Number(newTeacherData.experienceYears) || 3,
      phone: newTeacherData.phone || '+92 300 0000000',
      email: newTeacherData.email || 'faculty@indusbrightfuture.edu.pk',
      address: newTeacherData.address || 'Adam Doki',
      assignedClasses: newTeacherData.assignedClasses || ['Grade 9'],
      subjects: typeof newTeacherData.subjects === 'string' ? (newTeacherData.subjects as string).split(',') : ['General Science'],
      joiningDate: new Date().toISOString().split('T')[0],
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      status: 'Active',
    };
    onAddTeacher(createdTeacher);
    setShowAddTeacherModal(false);
  };

  const handleGenerateRemarks = async () => {
    if (!selectedStudentForAI) return;
    setAiLoading(true);
    setGeneratedRemarks('');
    try {
      const topSubject = selectedStudentForAI.termResults.subjects[0]?.subjectName || 'Mathematics';
      const weakSubject = selectedStudentForAI.termResults.subjects.find(s => s.obtainedMarks < 80)?.subjectName || 'English Composition';
      
      const res = await geminiService.generateReportRemarks({
        studentName: selectedStudentForAI.fullName,
        grade: selectedStudentForAI.grade,
        topSubject,
        weakSubject,
        conduct: selectedStudentForAI.termResults.conduct,
        attendance: `${selectedStudentForAI.attendancePercentage}%`,
      });
      setGeneratedRemarks(res.text);
    } catch (err: any) {
      console.error(err);
      setGeneratedRemarks('Error generating remarks. Please check server connection.');
    } finally {
      setAiLoading(false);
    }
  };

  const exportStudentsCSV = () => {
    const headers = ['ID,RollNumber,FullName,Gender,Grade,Section,DOB,FatherName,FatherPhone,Address,AttendanceRate,GradeAverage'];
    const rows = students.map(s => 
      `"${s.id}","${s.rollNumber}","${s.fullName}","${s.gender}","${s.grade}","${s.section}","${s.dateOfBirth}","${s.guardian.fatherName}","${s.guardian.primaryPhone}","${s.guardian.residentialAddress}","${s.attendancePercentage}%","${s.termResults.percentage}%"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IBFS_Students_Registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2">
            <Users className="w-4 h-4" /> Faculty & Administrative Academic Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Indus Bright Future School Staff Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Manage teacher profiles, student enrollment rosters, attendance records, and AI-assisted report remarks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onNavigateToMessages && (
            <button
              onClick={onNavigateToMessages}
              className="px-4 py-2.5 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-700 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
              title="Open Campus Communications & Notices Hub"
            >
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              Messages & Notices Hub
            </button>
          )}
          <button
            onClick={exportStudentsCSV}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Export Students (CSV)
          </button>
          <button
            onClick={onNavigateToAdmissions}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Admissions Desk
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'analytics' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
          Attendance Analytics & Trends
          <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-1.5 py-0.2 rounded font-mono">Recharts</span>
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'attendance' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Live Daily Attendance Marker
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'students' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Students Roster ({students.length})
        </button>
        <button
          onClick={() => setActiveTab('teachers')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'teachers' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Faculty & Teachers ({teachers.length})
        </button>
        <button
          onClick={() => setActiveTab('examMarks')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'examMarks' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-300" />
          Exam Marks & Grading Console
        </button>
        <button
          onClick={() => setActiveTab('aiRemarks')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'aiRemarks' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          Gemini AI Report Remarks
        </button>
      </div>

      {/* TAB 1: STUDENTS ROSTER */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
                placeholder="Search by student name, roll number, or father..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Filter Grade:</span>
              <select
                value={selectedGradeFilter}
                onChange={e => setSelectedGradeFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
              >
                <option value="All">All Grades (1 - 10)</option>
                <option value="Grade 1">Grade 1 (Primary)</option>
                <option value="Grade 2">Grade 2 (Primary)</option>
                <option value="Grade 3">Grade 3 (Primary)</option>
                <option value="Grade 4">Grade 4 (Primary)</option>
                <option value="Grade 5">Grade 5 (Primary)</option>
                <option value="Grade 6">Grade 6 (Middle)</option>
                <option value="Grade 7">Grade 7 (Middle)</option>
                <option value="Grade 8">Grade 8 (Middle)</option>
                <option value="Grade 9">Grade 9 (Matric Prep)</option>
                <option value="Grade 10">Grade 10 (Matric Board)</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Student ID / Roll</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Guardian Details</th>
                    <th className="py-3 px-4">Address</th>
                    <th className="py-3 px-4">Attendance</th>
                    <th className="py-3 px-4">Term Average</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono text-emerald-400 font-bold text-xs">{student.rollNumber}</div>
                        <div className="text-[10px] text-slate-500">{student.id}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img src={student.avatarUrl} alt={student.fullName} className="w-8 h-8 rounded-full object-cover shrink-0" />
                          <div>
                            <div className="font-bold text-white">{student.fullName}</div>
                            <div className="text-[10px] text-slate-400">{student.gender} • B-Form: {student.bFormNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded text-xs font-semibold">
                          {student.grade}-{student.section}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-white font-medium">{student.guardian.fatherName}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-sky-400" />
                          {student.guardian.primaryPhone}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300 text-xs max-w-[180px] truncate">
                        {student.guardian.residentialAddress}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${student.attendancePercentage >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {student.attendancePercentage}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-amber-300">
                          {student.termResults.percentage}%
                        </div>
                        <div className="text-[10px] text-emerald-400 font-mono font-semibold">
                          GPA {student.termResults.gpa !== undefined ? student.termResults.gpa.toFixed(1) : '3.8'} ({student.termResults.overallGrade})
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onNavigateToMessages && (
                            <button
                              onClick={onNavigateToMessages}
                              className="p-1.5 text-indigo-300 hover:text-indigo-200 bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-800 rounded-lg text-xs"
                              title="Message Student / Guardian in Communications Hub"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedGradeFilter(student.grade);
                              setActiveTab('examMarks');
                            }}
                            className="p-1.5 text-amber-300 hover:text-amber-200 bg-amber-950/60 hover:bg-amber-900 border border-amber-800 rounded-lg text-xs"
                            title="Input / Edit Marks & GPA"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setViewingStudent(student)}
                            className="p-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg text-xs"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setReportCardStudent(student)}
                            className="p-1.5 text-emerald-300 hover:text-emerald-200 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 rounded-lg text-xs"
                            title="Generate Official Report Card"
                          >
                            <Award className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEACHERS DIRECTORY */}
      {activeTab === 'teachers' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={teacherSearch}
                onChange={e => setTeacherSearch(e.target.value)}
                placeholder="Search teachers by name, subject, or department..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              onClick={() => setShowAddTeacherModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow"
            >
              <UserPlus className="w-4 h-4" /> Add New Teacher
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map(teacher => (
              <div key={teacher.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition-all">
                <div className="flex items-start gap-4">
                  <img src={teacher.avatarUrl} alt={teacher.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shrink-0" />
                  <div>
                    <h4 className="font-bold text-base text-white">{teacher.name}</h4>
                    <p className="text-xs text-emerald-400 font-medium">{teacher.designation}</p>
                    <span className="inline-block mt-1 text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                      {teacher.id}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800 pt-3">
                  <div><strong>Department:</strong> {teacher.department}</div>
                  <div><strong>Qualification:</strong> {teacher.qualification}</div>
                  <div><strong>Experience:</strong> {teacher.experienceYears} Years</div>
                  <div><strong>Subjects:</strong> {teacher.subjects.join(', ')}</div>
                  {teacher.isClassTeacherOf && (
                    <div className="text-emerald-300 font-semibold">
                      Class Incharge: {teacher.isClassTeacherOf}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 pt-1 text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-sky-400" />
                    <span>{teacher.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span className="truncate">{teacher.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">{teacher.address}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: ATTENDANCE ANALYTICS DASHBOARD (RECHARTS) */}
      {activeTab === 'analytics' && (
        <AttendanceAnalyticsDashboard
          students={students}
          teachers={teachers}
          onNavigateToMarker={() => setActiveTab('attendance')}
        />
      )}

      {/* TAB 3: DAILY ATTENDANCE MARKER */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Daily Student Attendance Recording
                </h3>
                <p className="text-xs text-slate-400">
                  Mark daily student attendance. Attendance percentage automatically syncs with Guardian Portal.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="px-3.5 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  View Analytics & Trends
                </button>
                <div className="text-xs text-slate-400 font-medium">
                  Date: <strong className="text-white">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Roll</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Overall %</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4 text-right">Quick Mark Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {students.map(s => (
                    <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-emerald-400 font-bold">{s.rollNumber}</td>
                      <td className="py-3 px-4 font-semibold text-white">{s.fullName}</td>
                      <td className="py-3 px-4">{s.grade}-{s.section}</td>
                      <td className="py-3 px-4 font-bold">{s.attendancePercentage}%</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          s.recentAttendanceStatus === 'Present' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                          s.recentAttendanceStatus === 'Late' ? 'bg-amber-950 text-amber-300 border border-amber-700' :
                          'bg-rose-950 text-rose-300 border border-rose-700'
                        }`}>
                          {s.recentAttendanceStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onRecordAttendance(s.id, 'Present')}
                            className="px-2.5 py-1 bg-emerald-600/30 hover:bg-emerald-600/60 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold"
                          >
                            Present
                          </button>
                          <button
                            onClick={() => onRecordAttendance(s.id, 'Late')}
                            className="px-2.5 py-1 bg-amber-600/30 hover:bg-amber-600/60 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold"
                          >
                            Late
                          </button>
                          <button
                            onClick={() => onRecordAttendance(s.id, 'Absent')}
                            className="px-2.5 py-1 bg-rose-600/30 hover:bg-rose-600/60 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-semibold"
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GEMINI AI REMARKS GENERATOR */}
      {activeTab === 'aiRemarks' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-bold text-white">Gemini AI Report Card Remarks Generator</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Generate individualized, pedagogical, and motivating remarks for student transcripts based on their subject performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Student</label>
                <select
                  value={selectedStudentForAI.id}
                  onChange={e => {
                    const found = students.find(s => s.id === e.target.value);
                    if (found) setSelectedStudentForAI(found);
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.rollNumber}) - {s.grade}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2 text-xs">
                <div className="font-bold text-white text-sm">{selectedStudentForAI.fullName}</div>
                <div>Grade: {selectedStudentForAI.grade} • Average: {selectedStudentForAI.termResults.percentage}%</div>
                <div>Attendance: {selectedStudentForAI.attendancePercentage}%</div>
                <div>Top Subject: {selectedStudentForAI.termResults.subjects[0]?.subjectName}</div>
                <div>Conduct: {selectedStudentForAI.termResults.conduct}</div>
              </div>

              <button
                type="button"
                disabled={aiLoading}
                onClick={handleGenerateRemarks}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                {aiLoading ? 'Generating Pedagogical Remarks...' : 'Generate 3 AI Remark Options'}
              </button>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider">AI Generated Remark Variations</h4>
                {generatedRemarks ? (
                  <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                    {generatedRemarks}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic py-8 text-center">
                    Select a student and click "Generate AI Remark Options" to preview tailored feedback.
                  </p>
                )}
              </div>

              {generatedRemarks && (
                <div className="pt-3 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedRemarks);
                      alert('Remarks copied to clipboard!');
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EXAM MARKS & GRADING CONSOLE */}
      {activeTab === 'examMarks' && (
        <StaffExamEntry
          students={students}
          onUpdateStudent={onUpdateStudent}
          onViewReportCard={(student) => setReportCardStudent(student)}
        />
      )}

      {/* View Student Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Full Student Bio-Data & Guardian Record</h3>
              <button onClick={() => setViewingStudent(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
              <div><span className="text-slate-400">Full Name:</span> <strong>{viewingStudent.fullName}</strong></div>
              <div><span className="text-slate-400">Student ID:</span> {viewingStudent.id}</div>
              <div><span className="text-slate-400">Class & Section:</span> {viewingStudent.grade} - {viewingStudent.section}</div>
              <div><span className="text-slate-400">Roll Number:</span> {viewingStudent.rollNumber}</div>
              <div><span className="text-slate-400">Father Name:</span> {viewingStudent.guardian.fatherName}</div>
              <div><span className="text-slate-400">Father CNIC:</span> {viewingStudent.guardian.fatherCnic}</div>
              <div><span className="text-slate-400">Phone:</span> {viewingStudent.guardian.primaryPhone}</div>
              <div><span className="text-slate-400">WhatsApp:</span> {viewingStudent.guardian.whatsappNumber}</div>
              <div className="col-span-2"><span className="text-slate-400">Address:</span> {viewingStudent.guardian.residentialAddress}</div>
            </div>
            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setViewingStudent(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Teacher Modal */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateTeacher} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Add New Faculty Record</h3>
              <button type="button" onClick={() => setShowAddTeacherModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Teacher Full Name *</label>
                <input
                  type="text"
                  required
                  value={newTeacherData.name}
                  onChange={e => setNewTeacherData({ ...newTeacherData, name: e.target.value })}
                  placeholder="e.g. Sir Naveed Ali Shah"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Designation</label>
                  <input
                    type="text"
                    value={newTeacherData.designation}
                    onChange={e => setNewTeacherData({ ...newTeacherData, designation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    value={newTeacherData.department}
                    onChange={e => setNewTeacherData({ ...newTeacherData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Qualification</label>
                  <input
                    type="text"
                    value={newTeacherData.qualification}
                    onChange={e => setNewTeacherData({ ...newTeacherData, qualification: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newTeacherData.phone}
                    onChange={e => setNewTeacherData({ ...newTeacherData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subjects Taught (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Mathematics, Physics"
                  onChange={e => setNewTeacherData({ ...newTeacherData, subjects: e.target.value.split(',') })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddTeacherModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
              >
                Save Teacher
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Report Card Modal */}
      {reportCardStudent && (
        <ReportCardModal
          student={reportCardStudent}
          onClose={() => setReportCardStudent(null)}
        />
      )}
    </div>
  );
};
