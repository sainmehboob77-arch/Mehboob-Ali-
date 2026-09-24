import { Teacher, Student, CourseBook, StudyPlan, DayTimetable, SchoolNotice, AdmissionsApplication, InternalMessage } from '../types';
import { INITIAL_TEACHERS, INITIAL_STUDENTS, INITIAL_COURSE_BOOKS, INITIAL_STUDY_PLANS, INITIAL_TIMETABLES, INITIAL_NOTICES, INITIAL_ADMISSIONS } from '../data/initialData';
import { INITIAL_MESSAGES } from '../data/messagesData';
import { calculateTermSummary } from '../utils/gradingUtils';

const STORAGE_KEYS = {
  TEACHERS: 'ibfs_teachers_v2',
  STUDENTS: 'ibfs_students_v3',
  ADMISSIONS: 'ibfs_admissions_v2',
  NOTICES: 'ibfs_notices_v2',
  COURSE_BOOKS: 'ibfs_books_v2',
  STUDY_PLANS: 'ibfs_plans_v2',
  TIMETABLES: 'ibfs_timetables_v2',
  MESSAGES: 'ibfs_internal_messages_v1',
};

const normalizeStudentMarks = (s: Student): Student => {
  if (!s.termResults || !s.termResults.subjects) return s;
  const summary = calculateTermSummary(s.termResults.subjects);
  return {
    ...s,
    termResults: {
      ...s.termResults,
      subjects: summary.enrichedSubjects,
      totalMarks: summary.totalMarks,
      obtainedMarks: summary.obtainedMarks,
      percentage: summary.percentage,
      overallGrade: summary.overallGrade,
      gpa: summary.gpa,
    }
  };
};

export const storageService = {
  getTeachers(): Teacher[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEACHERS);
      return data ? JSON.parse(data) : INITIAL_TEACHERS;
    } catch {
      return INITIAL_TEACHERS;
    }
  },

  saveTeachers(teachers: Teacher[]): void {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  },

  addTeacher(teacher: Teacher): Teacher[] {
    const teachers = this.getTeachers();
    const updated = [teacher, ...teachers];
    this.saveTeachers(updated);
    return updated;
  },

  updateTeacher(updatedTeacher: Teacher): Teacher[] {
    const teachers = this.getTeachers();
    const updated = teachers.map(t => t.id === updatedTeacher.id ? updatedTeacher : t);
    this.saveTeachers(updated);
    return updated;
  },

  getStudents(): Student[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      const parsed: Student[] = data ? JSON.parse(data) : INITIAL_STUDENTS;
      return parsed.map(normalizeStudentMarks);
    } catch {
      return INITIAL_STUDENTS.map(normalizeStudentMarks);
    }
  },

  saveStudents(students: Student[]): void {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  addStudent(student: Student): Student[] {
    const students = this.getStudents();
    const updated = [student, ...students];
    this.saveStudents(updated);
    return updated;
  },

  updateStudent(updatedStudent: Student): Student[] {
    const students = this.getStudents();
    const updated = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    this.saveStudents(updated);
    return updated;
  },

  recordAttendance(studentId: string, status: 'Present' | 'Absent' | 'Late'): Student[] {
    const students = this.getStudents();
    const updated = students.map(s => {
      if (s.id === studentId) {
        let att = s.attendancePercentage;
        if (status === 'Present') att = Math.min(100, Number((att + 0.2).toFixed(1)));
        if (status === 'Absent') att = Math.max(0, Number((att - 0.5).toFixed(1)));
        return {
          ...s,
          recentAttendanceStatus: status,
          attendancePercentage: att
        };
      }
      return s;
    });
    this.saveStudents(updated);
    return updated;
  },

  getAdmissions(): AdmissionsApplication[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ADMISSIONS);
      return data ? JSON.parse(data) : INITIAL_ADMISSIONS;
    } catch {
      return INITIAL_ADMISSIONS;
    }
  },

  saveAdmissions(apps: AdmissionsApplication[]): void {
    localStorage.setItem(STORAGE_KEYS.ADMISSIONS, JSON.stringify(apps));
  },

  addAdmission(app: AdmissionsApplication): AdmissionsApplication[] {
    const apps = this.getAdmissions();
    const updated = [app, ...apps];
    this.saveAdmissions(updated);
    return updated;
  },

  updateAdmission(updatedApp: AdmissionsApplication): AdmissionsApplication[] {
    const apps = this.getAdmissions();
    const updated = apps.map(a => a.id === updatedApp.id ? updatedApp : a);
    this.saveAdmissions(updated);
    return updated;
  },

  convertAdmissionToStudent(appId: string, assignedRollNo: string, section: string = 'A'): { students: Student[]; admissions: AdmissionsApplication[] } {
    const apps = this.getAdmissions();
    const app = apps.find(a => a.id === appId);
    if (!app) return { students: this.getStudents(), admissions: apps };

    const newStudentId = `IBFS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newStudent: Student = {
      id: newStudentId,
      rollNumber: assignedRollNo,
      fullName: app.applicantName,
      gender: app.gender,
      grade: app.gradeApplyingFor,
      section,
      dateOfBirth: app.dateOfBirth,
      enrollmentDate: new Date().toISOString().split('T')[0],
      bloodGroup: app.bloodGroup || 'B+',
      bFormNumber: app.bFormNumber,
      avatarUrl: app.documents.photo?.fileUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
      guardian: app.guardian,
      attendancePercentage: 100,
      recentAttendanceStatus: 'Present',
      termResults: {
        termName: 'Annual Academic Session 2024-2025',
        academicYear: '2024-2025',
        subjects: [
          { subjectName: 'Mathematics', maxMarks: 100, obtainedMarks: Math.round(app.previousMarksPercentage), grade: 'A', teacherRemarks: 'Newly enrolled; strong academic record.' },
          { subjectName: 'General Science / Physics', maxMarks: 100, obtainedMarks: Math.round(app.previousMarksPercentage * 0.95), grade: 'A', teacherRemarks: 'Active participant.' },
          { subjectName: 'English Language', maxMarks: 100, obtainedMarks: Math.round(app.previousMarksPercentage * 0.92), grade: 'A', teacherRemarks: 'Good foundation.' },
          { subjectName: 'Sindhi / Urdu', maxMarks: 75, obtainedMarks: Math.round(75 * (app.previousMarksPercentage / 100)), grade: 'A', teacherRemarks: 'Good writing skills.' },
          { subjectName: 'Islamiat', maxMarks: 75, obtainedMarks: 70, grade: 'A+', teacherRemarks: 'Respectful student.' },
        ],
        totalMarks: 450,
        obtainedMarks: Math.round(450 * (app.previousMarksPercentage / 100)),
        percentage: Number(app.previousMarksPercentage.toFixed(1)),
        overallGrade: app.previousMarksPercentage >= 80 ? 'A+ (Outstanding)' : 'A (Excellent)',
        classRank: 5,
        conduct: 'Respectful, keen to learn and adapt to IBFS curriculum.',
        teacherRemarks: 'Welcome to Indus Bright Future School! Showing promising academic talent.',
        headmasterSignature: 'Ghulam Mustafa Solangi (Principal)',
      },
      feeStatus: {
        monthlyTuition: 4500,
        transportCharges: 1500,
        annualFunds: 1200,
        currentMonthStatus: 'Paid',
        dueDate: '2024-10-15',
        lastPaymentReceiptNo: `RCP-IBFS-${Math.floor(10000 + Math.random() * 90000)}`,
      }
    };

    const updatedStudents = [newStudent, ...this.getStudents()];
    this.saveStudents(updatedStudents);

    const updatedApps = apps.map(a => a.id === appId ? {
      ...a,
      status: 'Enrolled' as const,
      assignedStudentId: newStudentId,
      assignedRollNo,
      adminNotes: `Formally enrolled on ${new Date().toLocaleDateString()}. Student ID: ${newStudentId}, Roll No: ${assignedRollNo}.`
    } : a);
    this.saveAdmissions(updatedApps);

    return { students: updatedStudents, admissions: updatedApps };
  },

  getCourseBooks(): CourseBook[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COURSE_BOOKS);
      return data ? JSON.parse(data) : INITIAL_COURSE_BOOKS;
    } catch {
      return INITIAL_COURSE_BOOKS;
    }
  },

  getStudyPlans(): StudyPlan[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDY_PLANS);
      return data ? JSON.parse(data) : INITIAL_STUDY_PLANS;
    } catch {
      return INITIAL_STUDY_PLANS;
    }
  },

  getTimetables(): Record<string, DayTimetable[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TIMETABLES);
      return data ? JSON.parse(data) : INITIAL_TIMETABLES;
    } catch {
      return INITIAL_TIMETABLES;
    }
  },

  saveTimetables(timetables: Record<string, DayTimetable[]>): void {
    localStorage.setItem(STORAGE_KEYS.TIMETABLES, JSON.stringify(timetables));
  },

  getNotices(): SchoolNotice[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTICES);
      return data ? JSON.parse(data) : INITIAL_NOTICES;
    } catch {
      return INITIAL_NOTICES;
    }
  },

  addNotice(notice: SchoolNotice): SchoolNotice[] {
    const notices = this.getNotices();
    const updated = [notice, ...notices];
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(updated));
    return updated;
  },

  getMessages(): InternalMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return data ? JSON.parse(data) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  },

  saveMessages(messages: InternalMessage[]): void {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  },

  addMessage(newMessage: InternalMessage): InternalMessage[] {
    const messages = this.getMessages();
    const updated = [newMessage, ...messages];
    this.saveMessages(updated);
    return updated;
  },

  markMessageAsRead(messageId: string): InternalMessage[] {
    const messages = this.getMessages();
    const updated = messages.map(m => m.id === messageId ? { ...m, read: true } : m);
    this.saveMessages(updated);
    return updated;
  },

  markThreadAsRead(threadId: string): InternalMessage[] {
    const messages = this.getMessages();
    const updated = messages.map(m => m.threadId === threadId ? { ...m, read: true } : m);
    this.saveMessages(updated);
    return updated;
  },

  deleteMessage(messageId: string): InternalMessage[] {
    const messages = this.getMessages();
    const updated = messages.filter(m => m.id !== messageId);
    this.saveMessages(updated);
    return updated;
  },

  resetAll(): void {
    localStorage.removeItem(STORAGE_KEYS.TEACHERS);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.ADMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.NOTICES);
    localStorage.removeItem(STORAGE_KEYS.COURSE_BOOKS);
    localStorage.removeItem(STORAGE_KEYS.STUDY_PLANS);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
  }
};
