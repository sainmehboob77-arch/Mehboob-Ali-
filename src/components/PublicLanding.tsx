import React from 'react';
import { RoleView, Teacher, SchoolNotice } from '../types';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  Users, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Calendar, 
  ShieldCheck, 
  Laptop, 
  FlaskConical, 
  Bus 
} from 'lucide-react';

interface PublicLandingProps {
  onSelectRole: (role: RoleView) => void;
  teachers: Teacher[];
  notices: SchoolNotice[];
}

export const PublicLanding: React.FC<PublicLandingProps> = ({
  onSelectRole,
  teachers,
  notices,
}) => {
  return (
    <div className="space-y-16 py-6 text-white">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-emerald-950 border border-emerald-800/40 p-8 sm:p-12 lg:p-16 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Admissions Open for Session 2024-2025 • Adam Doki Campus
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Indus Bright Future School
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
              Adam Doki, Sindh
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
            Empowering the children of Adam Doki and rural Sindh with world-class education, modern STEM science laboratories, ethics, and BISE board distinction.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onSelectRole('admissions')}
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-sm shadow-xl shadow-emerald-950 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <FileText className="w-4 h-4" />
              Apply for Online Admission
            </button>

            <button
              onClick={() => onSelectRole('library')}
              className="px-6 py-3.5 bg-gradient-to-r from-teal-700 to-emerald-800 hover:from-teal-600 hover:to-emerald-700 text-white font-bold rounded-xl text-sm border border-emerald-500/40 shadow-xl shadow-teal-950 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <BookOpen className="w-4 h-4 text-emerald-300" />
              Central E-Library & PDFs (Grades 1-10)
            </button>

            <button
              onClick={() => onSelectRole('student')}
              className="px-6 py-3.5 bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-semibold rounded-xl text-sm border border-slate-700 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              View Class Timetables
            </button>

            <button
              onClick={() => onSelectRole('guardian')}
              className="px-6 py-3.5 bg-indigo-900/40 hover:bg-indigo-900/70 text-indigo-200 font-semibold rounded-xl text-sm border border-indigo-700/40 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Users className="w-4 h-4 text-indigo-300" />
              Parents Portal Login
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">100%</div>
              <div className="text-xs text-slate-400 font-medium">BISE Matric Pass Rate</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-sky-400">550+</div>
              <div className="text-xs text-slate-400 font-medium">Enrolled Students</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-purple-400">22+</div>
              <div className="text-xs text-slate-400 font-medium">Certified Faculty</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400">1:20</div>
              <div className="text-xs text-slate-400 font-medium">Teacher-Student Ratio</div>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT NOTICES TICKER */}
      {notices.length > 0 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase text-amber-400 tracking-wider">Latest School Notice</span>
              <h4 className="font-semibold text-white text-xs sm:text-sm">{notices[0].title}</h4>
              <p className="text-xs text-slate-400 line-clamp-1">{notices[0].content}</p>
            </div>
          </div>
          <button
            onClick={() => onSelectRole('student')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 shrink-0"
          >
            Explore Academic Hub <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* WHY CHOOSE INDUS BRIGHT FUTURE SCHOOL */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Excellence in Adam Doki</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Pioneering Modern Education Along the Indus
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Our campus integrates traditional moral guidance with 21st-century digital competencies, STEM discovery, and bilingual proficiency in English and Sindhi/Urdu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-emerald-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">Science & Physics/Chemistry Labs</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hands-on practical apparatuses for Matric science students. Practical experiments for optics, chemical reactions, and biology dissection.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-emerald-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Laptop className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">Modern Computer & Coding Lab</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Equipped with high-speed internet and computer workstations teaching Python, web fundamentals, office productivity, and digital literacy.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-emerald-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">Central Library & Reading Hall</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Over 3,000 titles covering Sindh history, Islamic moral heritage, scientific encyclopedias, and English storybooks to foster a love for reading.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-emerald-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">Guardian SMS & Attendance Portal</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant daily punch-in attendance alerts sent straight to parents' phones. Full transparency for fees, report cards, and homework logs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-emerald-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Bus className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">Safe School Van Transport</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dedicated school vans providing secure door-to-door transit across Adam Doki, nearby canals, villages, and residential sectors.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-emerald-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">Gemini AI Academic Counselor</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cutting-edge AI integration providing personalized study recommendations, career roadmaps, and cognitive diagnostics for board success.
            </p>
          </div>
        </div>
      </section>

      {/* ONLINE E-LIBRARY SPOTLIGHT BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 p-8 sm:p-10 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Official Sindh Textbook Board & Reference Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Instant Online Reading & Need-Based PDF Downloads
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Indus Bright Future School provides round-the-clock digital library access for all students from Grade 1 to Grade 10 and teaching staff. Read e-books online with custom reading themes (Night, Sepia, Day), resize text, and download customized, chapter-wise or full-book PDF packets anytime.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectRole('library')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <BookOpen className="w-4 h-4" /> Open Online Library
              </button>
              <button
                onClick={() => onSelectRole('library')}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all"
              >
                <FileText className="w-4 h-4" /> Download Chapter Worksheets
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full lg:w-auto shrink-0">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/20 text-center space-y-1">
              <div className="text-emerald-400 font-bold text-lg">Grades 1-8</div>
              <div className="text-[11px] text-slate-400">Primary & Middle Wings</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-teal-500/20 text-center space-y-1">
              <div className="text-teal-400 font-bold text-lg">Grades 9-10</div>
              <div className="text-[11px] text-slate-400">Matric Board Curricula</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/20 text-center space-y-1">
              <div className="text-amber-400 font-bold text-lg">3 Reading Themes</div>
              <div className="text-[11px] text-slate-400">Dark, Sepia, Day</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-sky-500/20 text-center space-y-1">
              <div className="text-sky-400 font-bold text-lg">Need-Based</div>
              <div className="text-[11px] text-slate-400">Printable A4 PDFs</div>
            </div>
          </div>
        </div>
      </section>

      {/* HEADMASTER'S MESSAGE */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden shrink-0 border-4 border-emerald-500/40 shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80" 
              alt="Principal Sir Ghulam Mustafa Solangi" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Headmaster's Desk</span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Sir Ghulam Mustafa Solangi</h3>
            <p className="text-xs text-slate-400">M.Sc (Physics), M.Ed • 18+ Years in Educational Leadership in Sindh</p>
            <blockquote className="text-xs sm:text-sm text-slate-300 leading-relaxed italic border-l-2 border-emerald-500 pl-4 py-1">
              "At Indus Bright Future School Adam Doki, we believe every child possesses innate genius waiting for fertile soil. Our teachers work tirelessly not merely to produce high examination marks, but to groom dignified citizens, critical thinkers, and future nation-builders. We welcome you to experience our vibrant schooling community."
            </blockquote>
          </div>
        </div>
      </section>

      {/* FACULTY SHOWCASE */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Distinguished Academic Faculty</h3>
            <p className="text-xs text-slate-400">Experienced subject specialists dedicated to nurturing young minds</p>
          </div>
          <button
            onClick={() => onSelectRole('staff')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            Staff Directory <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {teachers.slice(0, 4).map(teacher => (
            <div key={teacher.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <img src={teacher.avatarUrl} alt={teacher.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-700" />
              <div>
                <h4 className="font-bold text-sm text-white">{teacher.name}</h4>
                <p className="text-xs text-emerald-400 font-medium">{teacher.designation}</p>
                <p className="text-[11px] text-slate-400 mt-1">{teacher.qualification} • {teacher.department}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
