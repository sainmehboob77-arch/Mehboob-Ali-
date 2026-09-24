import React, { useState } from 'react';
import { CourseBook } from '../types';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Sparkles, 
  FileText, 
  GraduationCap, 
  Award, 
  Layers, 
  BookMarked, 
  ExternalLink,
  CheckCircle2,
  Bookmark,
  Printer,
  Library,
  Compass,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { BookReaderModal } from './BookReaderModal';

interface OnlineLibraryProps {
  books: CourseBook[];
  userRole?: 'student' | 'teacher' | 'guardian' | 'guest';
}

const CATEGORIES = [
  'All Materials',
  'STBB Textbooks',
  'Teacher Guides',
  'Science Lab Manuals',
  'Sindhi & Urdu Literature',
  'Model Exam Papers'
] as const;

const GRADES_LIST = [
  'All Grades',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10'
];

export const OnlineLibrary: React.FC<OnlineLibraryProps> = ({ books, userRole = 'guest' }) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('All Grades');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Materials');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readingBook, setReadingBook] = useState<CourseBook | null>(null);
  const [bookmarkedBookIds, setBookmarkedBookIds] = useState<string[]>(['CB-10-MATH', 'CB-G7-SCI']);
  const [downloadModalBook, setDownloadModalBook] = useState<CourseBook | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const toggleBookmark = (bookId: string) => {
    setBookmarkedBookIds(prev => 
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );
  };

  const filteredBooks = books.filter(book => {
    const matchesGrade = selectedGrade === 'All Grades' || book.grade === selectedGrade;
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.keyTopics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      selectedCategory === 'All Materials' ? true :
      selectedCategory === 'STBB Textbooks' ? (book.publisher.includes('Sindh') || !book.category || book.category === 'Textbook') :
      selectedCategory === 'Teacher Guides' ? (book.category === 'Teacher Guide' || book.title.includes('Teacher') || book.title.includes('Guide')) :
      selectedCategory === 'Science Lab Manuals' ? (book.subject.includes('Science') || book.subject.includes('Physics') || book.subject.includes('Chemistry')) :
      selectedCategory === 'Sindhi & Urdu Literature' ? (book.subject.includes('Sindhi') || book.subject.includes('Urdu') || book.category === 'Literature') :
      true;

    return matchesGrade && matchesSearch && matchesCategory;
  });

  const handleQuickDownload = (book: CourseBook, needType: 'full' | 'ch1' | 'formula' | 'worksheet') => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download your need-based PDF document.');
      return;
    }

    const typeLabels = {
      full: `Complete Textbook (${book.totalChapters} Chapters - PDF Edition)`,
      ch1: `Chapter 1 Diagnostic & Fundamental Reading Guide`,
      formula: `Formula Sheet & Key Scientific Notations Handbook`,
      worksheet: `Standard Practice Worksheet & Board Exam Pattern Problems`,
    };

    const docTitle = typeLabels[needType];

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${book.title} - ${docTitle}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: 'Segoe UI', Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.5; padding: 20px; }
          .header { border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .title { font-size: 20px; font-weight: 800; color: #064e3b; text-transform: uppercase; }
          .sub { font-size: 12px; color: #64748b; }
          .badge { background: #dcfce7; color: #15803d; border: 1px solid #86efac; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
          .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
          .meta-table td { padding: 6px; border: 1px solid #e2e8f0; background: #f8fafc; }
          .section { margin-bottom: 20px; }
          h3 { font-size: 15px; color: #064e3b; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
          ul { padding-left: 20px; font-size: 13px; }
          li { margin-bottom: 6px; }
          .footer { margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 10px; color: #94a3b8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">Indus Bright Future School Adam Doki</div>
            <div class="sub">Central E-Library & Academic Resources • Registered with Sindh Education Dept</div>
          </div>
          <div class="badge">NEED-BASED PDF DOWNLOAD</div>
        </div>

        <table class="meta-table">
          <tr>
            <td><strong>Course Title:</strong> ${book.title}</td>
            <td><strong>Grade / Class:</strong> ${book.grade}</td>
          </tr>
          <tr>
            <td><strong>Subject:</strong> ${book.subject}</td>
            <td><strong>Publisher:</strong> ${book.publisher}</td>
          </tr>
          <tr>
            <td><strong>Edition:</strong> ${book.edition}</td>
            <td><strong>Author / Board:</strong> ${book.author}</td>
          </tr>
        </table>

        <div class="section">
          <h3>Document Scope: ${docTitle}</h3>
          <p style="font-size: 13px;">This official curriculum material has been digitized from the Sindh Textbook Board syllabus for the academic session 2024-2025 at Adam Doki campus. Students and faculty members may retain this copy for examination review and lesson instruction.</p>
        </div>

        <div class="section">
          <h3>Core Topics & Prescribed Syllabus Units:</h3>
          <ul>
            ${book.keyTopics.map(t => `<li><strong>Concept:</strong> ${t}</li>`).join('')}
          </ul>
        </div>

        <div class="section">
          <h3>Diagnostic Self-Assessment & Examination Questions:</h3>
          <ul>
            <li>1. Formulate the fundamental theorem and define key terminologies as demonstrated in Chapter 1.</li>
            <li>2. Solve the standard practice exercises and write out step-by-step mathematical/conceptual derivations.</li>
            <li>3. Contrast the theoretical models with real-world applications in Sindh's agriculture and environmental ecology.</li>
          </ul>
        </div>

        <div class="footer">
          Generated from Indus Bright Future School E-Library System • Adam Doki Campus • Verified Educational Resource
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

    setDownloadNotice(`Generating "${docTitle}" for ${book.title}...`);
    setTimeout(() => setDownloadNotice(null), 4000);
    setDownloadModalBook(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white">
      {/* Hero Banner: Most Attractive Institutional Styling */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/20 shadow-2xl p-6 sm:p-10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Library className="w-5 h-5" />
            </span>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
              <span>Indus Bright Future School Adam Doki</span>
              <span>·</span>
              <span className="text-amber-300">Central Digital E-Library</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Read Online & Download <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Need-Based PDF Books</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Free high-speed digital textbook access for students and faculty from Grade 1 through Grade 10. Read curriculum books directly in your browser, switch reading themes, take notes, and download chapter-wise or full-book PDF packets anytime.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-slate-300">
            <div>
              <strong className="text-white text-base sm:text-lg block font-mono">{books.length}</strong>
              <span className="text-slate-400 text-xs">Curriculum Books</span>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div>
              <strong className="text-white text-base sm:text-lg block font-mono">Grades 1 – 10</strong>
              <span className="text-slate-400 text-xs">Sindh Textbook Board</span>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div>
              <strong className="text-emerald-400 text-base sm:text-lg block font-mono">100% Free</strong>
              <span className="text-slate-400 text-xs">Students & Teachers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Download Alert Notice */}
      {downloadNotice && (
        <div className="bg-emerald-600/90 text-white p-3.5 rounded-2xl flex items-center justify-between text-xs sm:text-sm shadow-lg border border-emerald-500">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            {downloadNotice}
          </span>
          <span className="text-emerald-200 text-xs">Print / PDF dialog ready</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="space-y-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
        {/* Search Row */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search books by title, subject (e.g. Science, Mathematics, Sindhi), author, or key topic..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Bookmarks quick count */}
          <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
            <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Saved in My Desk: <strong>{bookmarkedBookIds.length}</strong></span>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === category
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/60'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grades Selector Row (Grades 1 to 10) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-slate-800/80 pt-3">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5 text-emerald-400" /> Class:
          </span>
          {GRADES_LIST.map(grade => {
            const isSelected = selectedGrade === grade;
            return (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-950 ring-2 ring-teal-400/40'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                {grade}
              </button>
            );
          })}
        </div>
      </div>

      {/* Book Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Showing <strong className="text-white">{filteredBooks.length}</strong> books for{' '}
            <strong className="text-emerald-400">{selectedGrade}</strong> ({selectedCategory})
          </span>
          <span>Single National Curriculum (SNC) Aligned</span>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="font-bold text-lg text-white">No Curriculum Materials Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No books matched "{searchQuery}" in {selectedGrade}. Try clearing your filters or searching for subjects like Mathematics, Science, English, or Sindhi.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedGrade('All Grades'); setSelectedCategory('All Materials'); }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-emerald-400 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map(book => {
              const isSaved = bookmarkedBookIds.includes(book.id);

              return (
                <div
                  key={book.id}
                  className="bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all group hover:shadow-2xl hover:shadow-emerald-950/20"
                >
                  <div className="space-y-4">
                    {/* Top Book Header & Bookmark */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold">
                          {book.grade}
                        </span>
                        <span className="text-xs text-slate-400">{book.subject}</span>
                      </div>

                      <button
                        onClick={() => toggleBookmark(book.id)}
                        className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                          isSaved 
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                            : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                        title={isSaved ? 'Remove from Saved Books' : 'Save Book to My Desk'}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Book Visual Mock Header */}
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${book.coverColor || 'from-emerald-700 to-teal-900'} text-white shadow-md relative overflow-hidden`}>
                      <div className="absolute right-0 bottom-0 opacity-15 translate-x-2 translate-y-2">
                        <BookOpen className="w-24 h-24" />
                      </div>
                      <div className="relative z-10 space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-200">
                          {book.publisher}
                        </span>
                        <h3 className="font-bold text-base leading-snug line-clamp-2">
                          {book.title}
                        </h3>
                        <p className="text-[11px] text-emerald-100 opacity-90">
                          Author: {book.author}
                        </p>
                      </div>
                    </div>

                    {/* Book Metadata */}
                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Curriculum Edition:</span>
                        <span className="font-medium text-slate-200 truncate max-w-[180px]">{book.edition}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Total Units / Chapters:</span>
                        <span className="font-bold text-white font-mono">{book.totalChapters} Chapters</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Format:</span>
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> High-Def E-Book & PDF
                        </span>
                      </div>
                    </div>

                    {/* Key Syllabus Topics */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-semibold text-slate-400 block">Syllabus Highlights:</span>
                      <div className="flex flex-wrap gap-1">
                        {book.keyTopics.slice(0, 3).map((topic, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300">
                            {topic}
                          </span>
                        ))}
                        {book.keyTopics.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-800/60 text-[10px] text-slate-400">
                            +{book.keyTopics.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dual Action Buttons: Read Online vs Need-Based PDF */}
                  <div className="pt-5 border-t border-slate-800/80 mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setReadingBook(book)}
                      className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Read Online</span>
                    </button>

                    <button
                      onClick={() => setDownloadModalBook(book)}
                      className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>Need-Based PDF</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* NEED-BASED PDF DOWNLOAD SELECTION MODAL */}
      {downloadModalBook && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  Need-Based PDF Downloader
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {downloadModalBook.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Class: {downloadModalBook.grade} · Publisher: {downloadModalBook.publisher}
                </p>
              </div>
              <button
                onClick={() => setDownloadModalBook(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-300">
              Select which format meets your study or teaching requirement today. The document will be formatted with Indus Bright Future School's verified curriculum layout.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleQuickDownload(downloadModalBook, 'full')}
                className="w-full p-4 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-emerald-500/60 flex items-center justify-between text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white group-hover:text-emerald-300">
                      Complete Textbook PDF
                    </h4>
                    <p className="text-xs text-slate-400">
                      All {downloadModalBook.totalChapters} chapters + front matter + index
                    </p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-emerald-400" />
              </button>

              <button
                onClick={() => handleQuickDownload(downloadModalBook, 'ch1')}
                className="w-full p-4 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-teal-500/60 flex items-center justify-between text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white group-hover:text-teal-300">
                      Chapter 1 Focused Reading Unit
                    </h4>
                    <p className="text-xs text-slate-400">
                      Compact file for current lesson homework and review
                    </p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-teal-400" />
              </button>

              <button
                onClick={() => handleQuickDownload(downloadModalBook, 'formula')}
                className="w-full p-4 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-amber-500/60 flex items-center justify-between text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white group-hover:text-amber-300">
                      Formula Sheet & Key Notes Packet
                    </h4>
                    <p className="text-xs text-slate-400">
                      Definitions, equations, and examination revision notes
                    </p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={() => handleQuickDownload(downloadModalBook, 'worksheet')}
                className="w-full p-4 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-sky-500/60 flex items-center justify-between text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400">
                    <Printer className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white group-hover:text-sky-300">
                      Practice Worksheet & Solved Model Questions
                    </h4>
                    <p className="text-xs text-slate-400">
                      Board pattern practice queries with marking rubric
                    </p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-sky-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL IN-BROWSER DIGITAL BOOK READER MODAL */}
      {readingBook && (
        <BookReaderModal
          book={readingBook}
          onClose={() => setReadingBook(null)}
        />
      )}
    </div>
  );
};
