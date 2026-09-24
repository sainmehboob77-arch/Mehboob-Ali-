export type RoleView = 'public' | 'admissions' | 'staff' | 'guardian' | 'student' | 'library' | 'results' | 'messages' | 'gemini-lab';

export interface MessageAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url?: string;
}

export interface InternalMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: 'teacher' | 'student' | 'guardian' | 'admin';
  senderAvatar?: string;
  recipientId: string;
  recipientName: string;
  recipientRole: 'teacher' | 'student' | 'guardian' | 'admin' | 'class' | 'all';
  category: 'update' | 'assignment' | 'notice' | 'inquiry' | 'general';
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
  priority?: 'normal' | 'important' | 'urgent';
  attachments?: MessageAttachment[];
  assignmentDetails?: {
    subject: string;
    dueDate: string;
    grade: string;
    maxScore?: number;
  };
}

export interface AdmissionDocument {
  id: string;
  name: string;
  type: 'photo' | 'bForm' | 'fatherCnic' | 'marksheet';
  fileName: string;
  fileSize: string;
  fileUrl?: string;
  uploadDate: string;
  verified: boolean;
}

export interface AdmissionsApplication {
  id: string; // e.g. APP-2025-0914
  submissionDate: string;
  applicantName: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  gradeApplyingFor: string;
  bFormNumber: string;
  previousSchool: string;
  previousMarksPercentage: number;
  bloodGroup: string;
  medicalConditions?: string;
  guardian: GuardianContact;
  documents: {
    photo?: AdmissionDocument;
    bForm?: AdmissionDocument;
    fatherCnic?: AdmissionDocument;
    marksheet?: AdmissionDocument;
  };
  status: 'Under Review' | 'Interview Scheduled' | 'Approved' | 'Enrolled' | 'Rejected';
  interviewDate?: string;
  interviewVenue?: string;
  assignedStudentId?: string;
  assignedRollNo?: string;
  adminNotes?: string;
}

export interface Teacher {
  id: string;
  name: string;
  designation: string;
  department: string;
  qualification: string;
  experienceYears: number;
  phone: string;
  email: string;
  address: string;
  assignedClasses: string[];
  subjects: string[];
  isClassTeacherOf?: string;
  joiningDate: string;
  avatarUrl: string;
  status: 'Active' | 'On Leave';
}

export interface SubjectScore {
  subjectName: string;
  maxMarks: number;
  obtainedMarks: number;
  grade: string;
  gpa?: number;
  teacherRemarks: string;
}

export interface ExamTermRecord {
  termId: string;
  termName: string;
  academicYear: string;
  examDate?: string;
  subjects: SubjectScore[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  overallGrade: string;
  gpa: number;
  classRank: number;
  conduct: string;
  teacherRemarks: string;
  headmasterSignature: string;
}

export interface GuardianContact {
  fatherName: string;
  fatherOccupation: string;
  fatherCnic: string;
  motherName: string;
  primaryPhone: string;
  whatsappNumber: string;
  email: string;
  residentialAddress: string;
  emergencyContact: string;
  relation: string;
}

export interface Student {
  id: string; // e.g. IBFS-2024-0101
  rollNumber: string;
  fullName: string;
  gender: 'Male' | 'Female';
  grade: string; // e.g., 'Grade 9', 'Grade 10', 'Grade 8'
  section: string; // e.g., 'A', 'B'
  dateOfBirth: string;
  enrollmentDate: string;
  bloodGroup: string;
  bFormNumber: string;
  avatarUrl: string;
  guardian: GuardianContact;
  attendancePercentage: number;
  recentAttendanceStatus: 'Present' | 'Absent' | 'Late';
  termResults: {
    termName: string;
    academicYear: string;
    subjects: SubjectScore[];
    totalMarks: number;
    obtainedMarks: number;
    percentage: number;
    overallGrade: string;
    gpa?: number;
    classRank: number;
    conduct: string;
    teacherRemarks: string;
    headmasterSignature: string;
  };
  examHistory?: ExamTermRecord[];
  feeStatus: {
    monthlyTuition: number;
    transportCharges: number;
    annualFunds: number;
    currentMonthStatus: 'Paid' | 'Pending' | 'Overdue';
    dueDate: string;
    lastPaymentReceiptNo?: string;
  };
}

export interface CourseBook {
  id: string;
  title: string;
  subject: string;
  grade: string;
  author: string;
  publisher: string;
  edition: string;
  totalChapters: number;
  coverColor: string;
  keyTopics: string[];
  downloadUrl?: string;
  category?: 'Textbook' | 'Teacher Guide' | 'Lab Manual' | 'Literature' | 'Past Paper';
  fileSizeBytes?: string;
  totalPdfPages?: number;
  sampleChapters?: {
    chapterNumber: number;
    title: string;
    summary: string;
    paragraphs: string[];
    keyPoints: string[];
  }[];
}

export interface StudyPlan {
  id: string;
  title: string;
  grade: string;
  subject: string;
  term: string;
  weekRange: string;
  objectives: string[];
  recommendedHoursPerWeek: number;
  milestones: {
    week: string;
    topics: string;
    assignments: string;
    assessmentType: string;
  }[];
}

export interface TimetablePeriod {
  periodNumber: number;
  timeRange: string;
  subject: string;
  teacherName: string;
  roomNumber: string;
  isBreak?: boolean;
}

export interface DayTimetable {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  periods: TimetablePeriod[];
}

export interface SchoolNotice {
  id: string;
  title: string;
  category: 'Academic' | 'Administrative' | 'Sports & Events' | 'Examination' | 'Fee Alert';
  date: string;
  content: string;
  targetAudience: 'All' | 'Guardians' | 'Staff' | 'Students';
  isImportant?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  modelUsed?: string;
}
