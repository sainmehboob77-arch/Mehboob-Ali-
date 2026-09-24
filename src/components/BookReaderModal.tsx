import React, { useState } from 'react';
import { CourseBook } from '../types';
import { 
  X, 
  Download, 
  BookOpen, 
  Bookmark, 
  Sun, 
  Moon, 
  Coffee, 
  Type, 
  ChevronLeft, 
  ChevronRight, 
  Printer, 
  Share2, 
  FileText, 
  Check, 
  Sparkles,
  Info
} from 'lucide-react';

interface BookReaderModalProps {
  book: CourseBook;
  onClose: () => void;
}

export const BookReaderModal: React.FC<BookReaderModalProps> = ({ book, onClose }) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [readerTheme, setReaderTheme] = useState<'dark' | 'sepia' | 'light'>('dark');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Fallback sample chapters if not explicitly provided
  const chapters = book.sampleChapters && book.sampleChapters.length > 0 
    ? book.sampleChapters 
    : [
        {
          chapterNumber: 1,
          title: `Introduction to ${book.subject}: Fundamentals & Core Principles`,
          summary: `Explores foundational principles of ${book.subject} prescribed for ${book.grade} under the Sindh Textbook Board Jamshoro curriculum.`,
          paragraphs: [
            `Welcome to Chapter 1 of ${book.title}. This academic module introduces students to the rigorous concepts and empirical foundations required for academic distinction at Indus Bright Future School Adam Doki.`,
            `The syllabus follows the Single National Curriculum aligned with Sindh Textbook Board guidelines. Every concept has been structured with practical examples relevant to rural and urban development along the Indus Valley basin.`,
            `Students are advised to work through all derivation steps, vocabulary definitions, and end-of-chapter review inquiries. Teachers may use this digital reader during smart-classroom lectures and laboratory practical sessions.`
          ],
          keyPoints: [
            `Conceptual definition and historical development of ${book.subject}`,
            `Standard SI units, scientific notations, and measurement techniques`,
            `Analytical inquiry and scientific methodology in Sindh schools`,
            `Review questions and solved numerical practice problems`
          ]
        },
        {
          chapterNumber: 2,
          title: `Applied Topics & Systematic Exploration in ${book.subject}`,
          summary: `Deep dive into advanced models, laboratory applications, and problem-solving methodologies.`,
          paragraphs: [
            `Chapter 2 builds directly upon earlier axioms. Students will examine quantitative models, observational patterns, and laboratory methodologies.`,
            `In this unit, focus is given to real-world applications in Sindh's agriculture, engineering, irrigation networks, and public health systems.`,
            `Make sure to complete the attached conceptual diagrams and self-assessment worksheets at the conclusion of this chapter.`
          ],
          keyPoints: [
            `Empirical validation through controlled experimentation`,
            `Mathematical formulation and graphical interpretations`,
            `Board examination recurring questions and marking criteria`
          ]
        }
      ];

  const activeChapter = chapters[currentChapterIndex] || chapters[0];

  const handleDownloadNeedBasedPdf = (type: 'chapter' | 'book' | 'summary') => {
    // Generate an official printable PDF window with school letterhead
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to generate and download your need-based PDF document.');
      return;
    }

    const titlePrefix = type === 'chapter' 
      ? `Chapter ${activeChapter.chapterNumber} - ${activeChapter.title}` 
      : type === 'summary' 
      ? `Quick Study Notes & Revision Sheet` 
      : `Complete Textbook (${book.totalChapters} Chapters)`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${book.title} - ${titlePrefix}</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { font-family: 'Georgia', serif; color: #1e293b; line-height: 1.6; margin: 0; padding: 20px; }
          .header { border-bottom: 2px solid #059669; padding-bottom: 15px; margin-bottom: 25px; text-align: center; }
          .school-name { font-size: 22px; font-weight: bold; color: #065f46; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
          .campus-name { font-size: 14px; color: #475569; margin: 2px 0 8px 0; }
          .doc-badge { display: inline-block; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; }
          .meta-grid { display: flex; justify-content: space-between; font-size: 13px; color: #64748b; margin-top: 10px; border-top: 1px dashed #cbd5e1; padding-top: 8px; }
          h2 { color: #0f172a; font-size: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-top: 25px; }
          p { font-size: 14px; margin-bottom: 12px; text-align: justify; }
          .box { background: #f8fafc; border-left: 4px solid #10b981; padding: 12px 16px; margin: 20px 0; border-radius: 0 6px 6px 0; }
          .key-list { margin: 10px 0; padding-left: 20px; font-size: 13.5px; }
          .key-list li { margin-bottom: 6px; }
          .footer { margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 12px; font-size: 11px; color: #94a3b8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-name">Indus Bright Future School Adam Doki</div>
          <div class="campus-name">Central E-Library & Academic Resources Wing • Sindh Curriculum</div>
          <div class="doc-badge">${titlePrefix.toUpperCase()}</div>
          <div class="meta-grid">
            <span><strong>Book:</strong> ${book.title}</span>
            <span><strong>Grade:</strong> ${book.grade}</span>
            <span><strong>Publisher:</strong> ${book.publisher}</span>
            <span><strong>Date:</strong> ${new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <h2>${activeChapter.title}</h2>
        <div class="box">
          <strong>Chapter Overview:</strong>
          <p style="margin: 4px 0 0 0;">${activeChapter.summary}</p>
        </div>

        <h3>Core Concepts & Syllabus Reading:</h3>
        ${activeChapter.paragraphs.map(p => `<p>${p}</p>`).join('')}

        <h3>Curriculum Milestones & Key Examination Points:</h3>
        <ul class="key-list">
          ${activeChapter.keyPoints.map(kp => `<li><strong>•</strong> ${kp}</li>`).join('')}
        </ul>

        <h3>Prescribed Key Topics in ${book.grade}:</h3>
        <ul class="key-list">
          ${book.keyTopics.map(t => `<li>${t}</li>`).join('')}
        </ul>

        <div class="footer">
          Official Digital Resource • Indus Bright Future School, Adam Doki, District Sukkur/Ghotki, Sindh • For Educational & Study Use Only
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

    setDownloadSuccess(`Generated ${titlePrefix} PDF successfully!`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const themeStyles = {
    dark: 'bg-slate-950 text-slate-100 border-slate-800',
    sepia: 'bg-[#f5ede0] text-[#3e2723] border-[#e0d3be]',
    light: 'bg-white text-slate-900 border-slate-200',
  };

  const contentBgStyles = {
    dark: 'bg-slate-900/90 text-slate-200 border-slate-800',
    sepia: 'bg-[#fffaf0] text-[#4a3525] border-[#ebdcc7]',
    light: 'bg-slate-50 text-slate-800 border-slate-200',
  };

  const fontSizeClasses = {
    sm: 'text-xs sm:text-sm leading-relaxed',
    base: 'text-sm sm:text-base leading-relaxed',
    lg: 'text-base sm:text-lg leading-relaxed',
    xl: 'text-lg sm:text-xl leading-relaxed',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className={`w-full max-w-5xl rounded-3xl border shadow-2xl flex flex-col max-h-[92vh] overflow-hidden transition-colors ${themeStyles[readerTheme]}`}>
        {/* Top Control Bar */}
        <div className={`p-4 sm:p-5 border-b flex flex-wrap items-center justify-between gap-3 ${readerTheme === 'dark' ? 'border-slate-800 bg-slate-900/90' : readerTheme === 'sepia' ? 'border-[#e0d3be] bg-[#ebe0ce]' : 'border-slate-200 bg-slate-100'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-950/40">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">{book.grade}</span>
                <span className="text-slate-400">·</span>
                <span className="text-xs opacity-70">{book.subject}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold truncate max-w-md">{book.title}</h2>
            </div>
          </div>

          {/* Reader Controls: Themes, Fonts & Need-Based Downloads */}
          <div className="flex items-center gap-2">
            {/* Theme switcher */}
            <div className="flex items-center p-1 rounded-xl bg-black/10 border border-black/10 gap-1">
              <button
                onClick={() => setReaderTheme('dark')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${readerTheme === 'dark' ? 'bg-slate-800 text-white shadow' : 'opacity-60 hover:opacity-100'}`}
                title="Dark Night Mode"
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setReaderTheme('sepia')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${readerTheme === 'sepia' ? 'bg-[#dfceb5] text-amber-950 shadow' : 'opacity-60 hover:opacity-100'}`}
                title="Warm Sepia Mode"
              >
                <Coffee className="w-4 h-4" />
              </button>
              <button
                onClick={() => setReaderTheme('light')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${readerTheme === 'light' ? 'bg-white text-slate-900 shadow' : 'opacity-60 hover:opacity-100'}`}
                title="Daylight Mode"
              >
                <Sun className="w-4 h-4" />
              </button>
            </div>

            {/* Font size toggles */}
            <div className="hidden sm:flex items-center p-1 rounded-xl bg-black/10 border border-black/10 gap-1">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-1 rounded text-xs font-semibold ${fontSize === 'sm' ? 'bg-emerald-600 text-white' : 'opacity-60'}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-1 rounded text-xs font-semibold ${fontSize === 'base' ? 'bg-emerald-600 text-white' : 'opacity-60'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-1 rounded text-xs font-semibold ${fontSize === 'lg' ? 'bg-emerald-600 text-white' : 'opacity-60'}`}
              >
                A+
              </button>
            </div>

            {/* Bookmark button */}
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isBookmarked ? 'bg-amber-500/20 text-amber-500 border-amber-500/40' : 'border-current/20 opacity-70 hover:opacity-100'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Add to Bookmarks'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success toast notification */}
        {downloadSuccess && (
          <div className="bg-emerald-600 text-white text-xs px-4 py-2 flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-1.5 font-medium">
              <Check className="w-4 h-4" /> {downloadSuccess}
            </span>
            <span className="opacity-80">Print / Save dialog opened</span>
          </div>
        )}

        {/* Main Reading & Navigation Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Chapter Table of Contents Sidebar */}
          <div className={`w-full md:w-64 border-r p-4 overflow-y-auto space-y-3 shrink-0 ${readerTheme === 'dark' ? 'border-slate-800 bg-slate-950/60' : readerTheme === 'sepia' ? 'border-[#e0d3be] bg-[#f0e4d2]' : 'border-slate-200 bg-slate-50'}`}>
            <div className="text-xs font-bold uppercase tracking-wider opacity-70 flex items-center justify-between">
              <span>Table of Contents</span>
              <span className="text-[11px] font-normal">{chapters.length} Units</span>
            </div>

            <div className="space-y-1.5">
              {chapters.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentChapterIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl text-xs transition-all cursor-pointer flex flex-col gap-1 ${
                    currentChapterIndex === idx
                      ? 'bg-emerald-600 text-white shadow-md font-semibold'
                      : 'hover:bg-black/5 opacity-80 hover:opacity-100'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold opacity-75">Chapter {ch.chapterNumber}</span>
                  <span className="line-clamp-2 leading-tight">{ch.title}</span>
                </button>
              ))}
            </div>

            {/* NEED-BASED PDF DOWNLOADS DESK */}
            <div className="pt-4 border-t border-current/10 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                Need-Based Downloads
              </span>
              <button
                onClick={() => handleDownloadNeedBasedPdf('chapter')}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-700 dark:text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  This Chapter PDF
                </span>
                <Download className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleDownloadNeedBasedPdf('summary')}
                className="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-600 text-amber-700 dark:text-amber-300 hover:text-white border border-amber-500/30 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Key Notes & Formulas
                </span>
                <Download className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleDownloadNeedBasedPdf('book')}
                className="w-full py-2 px-3 rounded-xl bg-sky-600/20 hover:bg-sky-600 text-sky-700 dark:text-sky-300 hover:text-white border border-sky-500/30 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Printer className="w-3.5 h-3.5" />
                  Full Book Packet
                </span>
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Reader Main Content Area */}
          <div className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto space-y-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Chapter Header */}
              <div className="border-b border-current/10 pb-4 space-y-2">
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">
                  Chapter {activeChapter.chapterNumber} · {book.grade} Syllabus
                </span>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
                  {activeChapter.title}
                </h1>
                <p className="text-xs sm:text-sm opacity-75 italic">
                  {activeChapter.summary}
                </p>
              </div>

              {/* Chapter Content Paragraphs */}
              <div className={`p-6 sm:p-8 rounded-2xl border space-y-4 shadow-sm ${contentBgStyles[readerTheme]}`}>
                {activeChapter.paragraphs.map((paragraph, idx) => (
                  <p key={idx} className={`${fontSizeClasses[fontSize]} indent-4 leading-relaxed`}>
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Key Highlights / Curriculum Milestones */}
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Core Examination Concepts & Syllabus Milestones
                </h3>
                <ul className="space-y-2">
                  {activeChapter.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Topics in Book */}
              <div className="border-t border-current/10 pt-4 space-y-2">
                <span className="text-xs font-semibold opacity-70">Major Topics in {book.title}:</span>
                <div className="flex flex-wrap gap-1.5">
                  {book.keyTopics.map((topic, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-black/10 border border-current/10 text-xs font-medium">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Chapter Pagination Controls */}
              <div className="flex items-center justify-between border-t border-current/10 pt-6">
                <button
                  disabled={currentChapterIndex === 0}
                  onClick={() => setCurrentChapterIndex(prev => prev - 1)}
                  className="px-4 py-2 rounded-xl border border-current/20 text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-30 cursor-pointer hover:bg-black/5"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous Chapter
                </button>

                <span className="text-xs opacity-60">
                  Unit {currentChapterIndex + 1} of {chapters.length}
                </span>

                <button
                  disabled={currentChapterIndex === chapters.length - 1}
                  onClick={() => setCurrentChapterIndex(prev => prev + 1)}
                  className="px-4 py-2 rounded-xl border border-current/20 text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-30 cursor-pointer hover:bg-black/5"
                >
                  Next Chapter <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
