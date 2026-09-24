import React, { useState } from 'react';
import { CourseBook, StudyPlan, DayTimetable, Teacher } from '../types';
import { BookOpen, Calendar, Download, FileText, CheckCircle2, Bookmark, Layers, Search, Filter, Eye, Printer, Sparkles } from 'lucide-react';
import { TimetableViewer } from './TimetableViewer';
import { BookReaderModal } from './BookReaderModal';

interface AcademicHubProps {
  books: CourseBook[];
  studyPlans: StudyPlan[];
  timetables: Record<string, DayTimetable[]>;
  teachers: Teacher[];
  onUpdateTimetable?: (grade: string, updatedDays: DayTimetable[]) => void;
}

export const AcademicHub: React.FC<AcademicHubProps> = ({
  books,
  studyPlans,
  timetables,
  teachers,
  onUpdateTimetable,
}) => {
  const [activeTab, setActiveTab] = useState<'timetables' | 'books' | 'studyPlans'>('timetables');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [searchBook, setSearchBook] = useState<string>('');
  const [activeReadingBook, setActiveReadingBook] = useState<CourseBook | null>(null);

  const filteredBooks = books.filter(b => {
    const matchesGrade = selectedGrade === 'All' || b.grade === selectedGrade;
    const matchesSearch = b.title.toLowerCase().includes(searchBook.toLowerCase()) ||
      b.subject.toLowerCase().includes(searchBook.toLowerCase()) ||
      b.author.toLowerCase().includes(searchBook.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  const filteredPlans = studyPlans.filter(p => selectedGrade === 'All' || p.grade === selectedGrade);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2">
            <BookOpen className="w-4 h-4" /> Academic Materials & Curriculum Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Course Books, Syllabi & Class Timetables
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Access Sindh Textbook Board prescribed course books, weekly study plans, term milestones, and bell schedules.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('timetables')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'timetables' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Interactive Class Timetable Viewer
        </button>
        <button
          onClick={() => setActiveTab('books')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'books' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Course Books & Literature ({books.length})
        </button>
        <button
          onClick={() => setActiveTab('studyPlans')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'studyPlans' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          Weekly Study Plans & Milestones ({studyPlans.length})
        </button>
      </div>

      {/* TAB 1: TIMETABLE VIEWER */}
      {activeTab === 'timetables' && (
        <TimetableViewer 
          timetables={timetables} 
          teachers={teachers} 
          isAdmin={true} 
          onUpdateTimetable={onUpdateTimetable}
        />
      )}

      {/* TAB 2: COURSE BOOKS */}
      {activeTab === 'books' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchBook}
                onChange={e => setSearchBook(e.target.value)}
                placeholder="Search by book title, subject, or author..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Class:</span>
              <select
                value={selectedGrade}
                onChange={e => setSelectedGrade(e.target.value)}
                className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
              >
                <option value="All">All Classes (Grades 1 - 10)</option>
                <option value="Grade 1">Grade 1 (Primary)</option>
                <option value="Grade 2">Grade 2 (Primary)</option>
                <option value="Grade 3">Grade 3 (Primary)</option>
                <option value="Grade 4">Grade 4 (Primary)</option>
                <option value="Grade 5">Grade 5 (Primary)</option>
                <option value="Grade 6">Grade 6 (Middle)</option>
                <option value="Grade 7">Grade 7 (Middle)</option>
                <option value="Grade 8">Grade 8 (Middle)</option>
                <option value="Grade 9">Grade 9 (Secondary)</option>
                <option value="Grade 10">Grade 10 (Secondary)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map(book => (
              <div key={book.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold">
                      {book.grade}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Edition: {book.edition}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{book.title}</h3>
                    <p className="text-xs text-emerald-400 font-medium">{book.subject}</p>
                    <p className="text-xs text-slate-400 mt-1">Author: {book.author}</p>
                    <p className="text-[11px] text-slate-500">Publisher: {book.publisher} • {book.totalChapters} Chapters</p>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 space-y-2">
                  <div className="text-[11px] font-semibold text-slate-300">Core Curriculum Topics:</div>
                  <div className="flex flex-wrap gap-1">
                    {book.keyTopics.map((topic, idx) => (
                      <span key={idx} className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded">
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setActiveReadingBook(book)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Read Online
                    </button>

                    <button
                      onClick={() => setActiveReadingBook(book)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      Need-Based PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STUDY PLANS */}
      {activeTab === 'studyPlans' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPlans.map(plan => (
              <div key={plan.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="bg-emerald-950 text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-800">
                      {plan.grade} • {plan.subject}
                    </span>
                    <h3 className="font-bold text-lg text-white mt-1.5">{plan.title}</h3>
                    <p className="text-xs text-slate-400">Duration: {plan.weekRange} • Term: {plan.term}</p>
                  </div>
                  <FileText className="w-6 h-6 text-slate-600 shrink-0" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Weekly Milestones:</h4>
                  <div className="space-y-1.5">
                    {plan.milestones.map((ms, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs flex items-center justify-between">
                        <div>
                          <strong className="text-emerald-400">Week {ms.week}:</strong> <span className="text-slate-200">{ms.topics}</span>
                          <div className="text-[11px] text-slate-400">{ms.assignments}</div>
                        </div>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                          {ms.assessmentType}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 space-y-1 text-xs">
                  <div className="text-slate-400 font-semibold">Key Learning Objectives:</div>
                  <ul className="text-slate-300 space-y-1">
                    {plan.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Book Reader Modal */}
      {activeReadingBook && (
        <BookReaderModal
          book={activeReadingBook}
          onClose={() => setActiveReadingBook(null)}
        />
      )}
    </div>
  );
};
