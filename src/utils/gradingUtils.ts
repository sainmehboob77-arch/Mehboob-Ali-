import { SubjectScore, Student, ExamTermRecord } from '../types';

export interface GradeScaleItem {
  minPercentage: number;
  maxPercentage: number;
  grade: string;
  gpa: number;
  description: string;
  colorClass: string;
}

export const GRADING_SCALE: GradeScaleItem[] = [
  { minPercentage: 85, maxPercentage: 100, grade: 'A-1', gpa: 4.0, description: 'Outstanding / High Distinction', colorClass: 'text-emerald-400 bg-emerald-950 border-emerald-600' },
  { minPercentage: 75, maxPercentage: 84.99, grade: 'A', gpa: 3.7, description: 'Excellent / First Division', colorClass: 'text-teal-400 bg-teal-950 border-teal-600' },
  { minPercentage: 65, maxPercentage: 74.99, grade: 'B', gpa: 3.0, description: 'Very Good / Second Division', colorClass: 'text-sky-400 bg-sky-950 border-sky-600' },
  { minPercentage: 50, maxPercentage: 64.99, grade: 'C', gpa: 2.0, description: 'Good / Satisfactory', colorClass: 'text-amber-400 bg-amber-950 border-amber-600' },
  { minPercentage: 40, maxPercentage: 49.99, grade: 'D', gpa: 1.0, description: 'Fair / Pass Division', colorClass: 'text-orange-400 bg-orange-950 border-orange-600' },
  { minPercentage: 33, maxPercentage: 39.99, grade: 'E', gpa: 0.7, description: 'Marginal Pass', colorClass: 'text-yellow-400 bg-yellow-950 border-yellow-600' },
  { minPercentage: 0, maxPercentage: 32.99, grade: 'F', gpa: 0.0, description: 'Fail / Needs Retest', colorClass: 'text-rose-400 bg-rose-950 border-rose-600' },
];

export const AVAILABLE_EXAM_TERMS = [
  { id: 'mid-term-2024', name: 'Mid-Term Examination 2024', academicYear: '2024-2025' },
  { id: 'final-term-2025', name: 'Annual Final Examination 2025', academicYear: '2024-2025' },
  { id: 'first-assessment', name: 'First Term Assessment 2024', academicYear: '2024-2025' },
  { id: 'board-mock-2025', name: 'Sindh Board Matric Mock Exam 2025', academicYear: '2024-2025' },
];

/**
 * Calculates grade, GPA and percentage for an individual subject
 */
export function calculateSubjectGradeAndGpa(obtainedMarks: number, maxMarks: number): {
  percentage: number;
  grade: string;
  gpa: number;
  status: 'Pass' | 'Fail';
} {
  const safeMax = maxMarks > 0 ? maxMarks : 100;
  const safeObtained = Math.max(0, Math.min(obtainedMarks, safeMax));
  const percentage = Math.round((safeObtained / safeMax) * 100 * 10) / 10;

  let grade = 'F';
  let gpa = 0.0;
  let status: 'Pass' | 'Fail' = 'Fail';

  for (const scale of GRADING_SCALE) {
    if (percentage >= scale.minPercentage) {
      grade = scale.grade;
      gpa = scale.gpa;
      status = scale.grade === 'F' ? 'Fail' : 'Pass';
      break;
    }
  }

  return { percentage, grade, gpa, status };
}

/**
 * Calculates overall term score summary, total marks, percentage, grade, and cumulative GPA
 */
export function calculateTermSummary(subjects: SubjectScore[]): {
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  overallGrade: string;
  gpa: number;
  passedCount: number;
  failedCount: number;
  statusMessage: string;
  enrichedSubjects: SubjectScore[];
} {
  if (!subjects || subjects.length === 0) {
    return {
      totalMarks: 0,
      obtainedMarks: 0,
      percentage: 0,
      overallGrade: 'N/A',
      gpa: 0,
      passedCount: 0,
      failedCount: 0,
      statusMessage: 'No examinations recorded',
      enrichedSubjects: [],
    };
  }

  let totalMarks = 0;
  let obtainedMarks = 0;
  let totalWeightedGpa = 0;
  let passedCount = 0;
  let failedCount = 0;

  const enrichedSubjects: SubjectScore[] = subjects.map(sub => {
    const { percentage, grade, gpa, status } = calculateSubjectGradeAndGpa(sub.obtainedMarks, sub.maxMarks);
    totalMarks += sub.maxMarks;
    obtainedMarks += sub.obtainedMarks;
    totalWeightedGpa += gpa * sub.maxMarks;

    if (status === 'Pass') passedCount++;
    else failedCount++;

    return {
      ...sub,
      grade,
      gpa,
    };
  });

  const percentage = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100 * 10) / 10 : 0;
  
  // Calculate Cumulative GPA (weighted by maxMarks, scale 4.0)
  const gpa = totalMarks > 0 ? Math.round((totalWeightedGpa / totalMarks) * 100) / 100 : 0;

  // Calculate Overall Grade
  let overallGrade = 'F';
  for (const scale of GRADING_SCALE) {
    if (percentage >= scale.minPercentage) {
      overallGrade = scale.grade;
      break;
    }
  }

  // Determine status message
  let statusMessage = 'Passed with Distinction';
  if (failedCount > 0) {
    statusMessage = `Failed in ${failedCount} subject${failedCount > 1 ? 's' : ''} (Requires Supplementary)`;
  } else if (percentage >= 85) {
    statusMessage = 'Promoted with Outstanding Distinction (Grade A-1)';
  } else if (percentage >= 75) {
    statusMessage = 'Promoted with High First Division (Grade A)';
  } else if (percentage >= 65) {
    statusMessage = 'Promoted in Second Division (Grade B)';
  } else if (percentage >= 50) {
    statusMessage = 'Promoted in Third Division (Grade C)';
  } else if (percentage >= 40) {
    statusMessage = 'Pass Division';
  } else {
    statusMessage = 'Detained / Not Promoted';
  }

  return {
    totalMarks,
    obtainedMarks,
    percentage,
    overallGrade,
    gpa,
    passedCount,
    failedCount,
    statusMessage,
    enrichedSubjects,
  };
}

/**
 * Returns default list of curriculum subjects based on student's grade
 */
export function getDefaultSubjectsForGrade(grade: string): { subjectName: string; maxMarks: number }[] {
  const gradeNum = parseInt(grade.replace('Grade ', '')) || 10;

  if (gradeNum <= 5) {
    // Primary Wing
    return [
      { subjectName: 'English (Primary Grammar & Reading)', maxMarks: 100 },
      { subjectName: 'Mathematics (Basic Arithmetic & Shapes)', maxMarks: 100 },
      { subjectName: 'General Science & Environment', maxMarks: 100 },
      { subjectName: 'Urdu Zaban-o-Adab', maxMarks: 100 },
      { subjectName: 'Sindhi (Aasan Sindhi)', maxMarks: 100 },
      { subjectName: 'Islamiat / Moral Education', maxMarks: 50 },
      { subjectName: 'Social Studies & Civics', maxMarks: 50 },
    ];
  } else if (gradeNum <= 8) {
    // Middle Wing
    return [
      { subjectName: 'English Language & Composition', maxMarks: 100 },
      { subjectName: 'Mathematics & Pre-Algebra', maxMarks: 100 },
      { subjectName: 'General Science & Lab Experiments', maxMarks: 100 },
      { subjectName: 'Computer Education & ICT', maxMarks: 75 },
      { subjectName: 'Sindhi Literature (Salees)', maxMarks: 75 },
      { subjectName: 'Urdu Literature', maxMarks: 75 },
      { subjectName: 'Islamiat / Ethics', maxMarks: 50 },
      { subjectName: 'History & Geography (Pakistan Studies)', maxMarks: 50 },
    ];
  } else {
    // Secondary Matric Wing (Grades 9 & 10)
    return [
      { subjectName: 'Physics (Theory & Practical)', maxMarks: 100 },
      { subjectName: 'Chemistry (Theory & Practical)', maxMarks: 100 },
      { subjectName: 'Mathematics (General & Advanced)', maxMarks: 100 },
      { subjectName: 'Biology / Computer Science', maxMarks: 100 },
      { subjectName: 'English Compulsory', maxMarks: 100 },
      { subjectName: 'Urdu Compulsory', maxMarks: 100 },
      { subjectName: 'Sindhi Compulsory (Salees)', maxMarks: 75 },
      { subjectName: 'Pakistan Studies', maxMarks: 75 },
      { subjectName: 'Islamiat / Ethical Studies', maxMarks: 50 },
    ];
  }
}
