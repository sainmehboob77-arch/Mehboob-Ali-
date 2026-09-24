/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  RoleView, 
  Teacher, 
  Student, 
  AdmissionsApplication, 
  CourseBook, 
  StudyPlan, 
  DayTimetable, 
  SchoolNotice,
  InternalMessage 
} from './types';
import { storageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PublicLanding } from './components/PublicLanding';
import { AdmissionsPortal } from './components/AdmissionsPortal';
import { StaffPortal } from './components/StaffPortal';
import { GuardianPortal } from './components/GuardianPortal';
import { AcademicHub } from './components/AcademicHub';
import { GeminiLab } from './components/GeminiLab';
import { OnlineLibrary } from './components/OnlineLibrary';
import { ExamResultsModule } from './components/ExamResultsModule';
import { InternalMessagingHub } from './components/InternalMessagingHub';

export default function App() {
  const [currentRole, setCurrentRole] = useState<RoleView>('public');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionsApplication[]>([]);
  const [books, setBooks] = useState<CourseBook[]>([]);
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [timetables, setTimetables] = useState<Record<string, DayTimetable[]>>({});
  const [notices, setNotices] = useState<SchoolNotice[]>([]);
  const [messages, setMessages] = useState<InternalMessage[]>([]);

  useEffect(() => {
    setTeachers(storageService.getTeachers());
    setStudents(storageService.getStudents());
    setAdmissions(storageService.getAdmissions());
    setBooks(storageService.getCourseBooks());
    setStudyPlans(storageService.getStudyPlans());
    setTimetables(storageService.getTimetables());
    setNotices(storageService.getNotices());
    setMessages(storageService.getMessages());
  }, []);

  const handleSendMessage = (newMsg: InternalMessage) => {
    const updated = storageService.addMessage(newMsg);
    setMessages(updated);
  };

  const handleMarkThreadRead = (threadId: string) => {
    const updated = storageService.markThreadAsRead(threadId);
    setMessages(updated);
  };

  const unreadMessagesCount = useMemo(() => {
    return messages.filter(m => !m.read).length;
  }, [messages]);

  const handleAddAdmission = (newApp: AdmissionsApplication) => {
    const updated = storageService.addAdmission(newApp);
    setAdmissions(updated);
  };

  const handleUpdateAdmission = (updatedApp: AdmissionsApplication) => {
    const updated = storageService.updateAdmission(updatedApp);
    setAdmissions(updated);
  };

  const handleConvertToStudent = (appId: string, assignedRollNo: string, section: string) => {
    const result = storageService.convertAdmissionToStudent(appId, assignedRollNo, section);
    setStudents(result.students);
    setAdmissions(result.admissions);
  };

  const handleAddTeacher = (teacher: Teacher) => {
    const updated = storageService.addTeacher(teacher);
    setTeachers(updated);
  };

  const handleUpdateTeacher = (teacher: Teacher) => {
    const updated = storageService.updateTeacher(teacher);
    setTeachers(updated);
  };

  const handleRecordAttendance = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    const updated = storageService.recordAttendance(studentId, status);
    setStudents(updated);
  };

  const handleUpdateStudent = (student: Student) => {
    const updated = storageService.updateStudent(student);
    setStudents(updated);
  };

  const handleUpdateTimetable = (grade: string, updatedDays: DayTimetable[]) => {
    setTimetables(prev => {
      const updated = {
        ...prev,
        [grade]: updatedDays,
      };
      storageService.saveTimetables(updated);
      return updated;
    });
  };

  const pendingAdmissions = admissions.filter(a => a.status === 'Under Review').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        notices={notices}
        pendingAdmissionsCount={pendingAdmissions}
        unreadMessagesCount={unreadMessagesCount}
      />

      {/* Main App Body */}
      <main className="flex-1">
        {currentRole === 'public' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PublicLanding
              onSelectRole={setCurrentRole}
              teachers={teachers}
              notices={notices}
            />
          </div>
        )}

        {currentRole === 'admissions' && (
          <AdmissionsPortal
            admissions={admissions}
            onAddAdmission={handleAddAdmission}
            onUpdateAdmission={handleUpdateAdmission}
            onConvertToStudent={handleConvertToStudent}
          />
        )}

        {currentRole === 'staff' && (
          <StaffPortal
            teachers={teachers}
            students={students}
            onAddTeacher={handleAddTeacher}
            onUpdateTeacher={handleUpdateTeacher}
            onRecordAttendance={handleRecordAttendance}
            onUpdateStudent={handleUpdateStudent}
            onNavigateToAdmissions={() => setCurrentRole('admissions')}
            onNavigateToMessages={() => setCurrentRole('messages')}
          />
        )}

        {currentRole === 'guardian' && (
          <GuardianPortal 
            students={students} 
            onSendInternalMessage={handleSendMessage}
            onNavigateToMessages={() => setCurrentRole('messages')}
          />
        )}

        {currentRole === 'messages' && (
          <InternalMessagingHub
            messages={messages}
            teachers={teachers}
            students={students}
            onSendMessage={handleSendMessage}
            onMarkThreadRead={handleMarkThreadRead}
          />
        )}

        {currentRole === 'results' && (
          <ExamResultsModule 
            students={students} 
            onNavigateToStaffEntry={() => setCurrentRole('staff')}
          />
        )}

        {currentRole === 'student' && (
          <AcademicHub
            books={books}
            studyPlans={studyPlans}
            timetables={timetables}
            teachers={teachers}
            onUpdateTimetable={handleUpdateTimetable}
          />
        )}

        {currentRole === 'library' && (
          <OnlineLibrary
            books={books}
            userRole="guest"
          />
        )}

        {currentRole === 'gemini-lab' && (
          <GeminiLab students={students} />
        )}
      </main>

      {/* Global Footer */}
      <Footer onSelectRole={setCurrentRole} />
    </div>
  );
}
