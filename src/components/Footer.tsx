import React from 'react';
import { RoleView } from '../types';
import { GraduationCap, MapPin, Phone, Mail, Clock, Award, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onSelectRole: (role: RoleView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectRole }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      {/* Main Highlights */}
      <div className="border-b border-slate-800/80 py-8 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Recognized Excellence</h4>
              <p className="text-slate-400 text-xs">Affiliated with BISE & Registered under Sindh Education Dept.</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Secure Guardianship</h4>
              <p className="text-slate-400 text-xs">Real-time attendance alerts, automated SMS & CCTV secured campus.</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">School Timing</h4>
              <p className="text-slate-400 text-xs">Mon-Thu & Sat: 08:00 AM - 01:30 PM | Friday: 08:00 AM - 12:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: About */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-sm">Indus Bright Future School</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-xs">
            A pioneering educational institution established in Adam Doki, Sindh, dedicated to cultivating scientific temper, moral uprightness, and digital literacy in youth.
          </p>
          <div className="pt-2 text-emerald-400 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Registration No: SED/REG-45203/2012
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3">Academic Portals</h4>
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => onSelectRole('public')} 
                className="hover:text-emerald-400 transition-colors text-left"
              >
                School Campus & Mission
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectRole('admissions')} 
                className="hover:text-emerald-400 transition-colors text-left"
              >
                Online Admissions & Registration
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectRole('staff')} 
                className="hover:text-emerald-400 transition-colors text-left"
              >
                Teachers & Staff Registry
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectRole('guardian')} 
                className="hover:text-emerald-400 transition-colors text-left"
              >
                Guardian & Parent Portal
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectRole('student')} 
                className="hover:text-emerald-400 transition-colors text-left"
              >
                Class Timetables & Study Plans
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectRole('results')} 
                className="hover:text-emerald-400 transition-colors text-left text-amber-300 font-semibold"
              >
                Exam Results & Report Cards (GPA)
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectRole('messages')} 
                className="hover:text-emerald-400 transition-colors text-left text-sky-300 font-semibold flex items-center gap-1.5"
              >
                <span>Internal Messages & Notices</span>
                <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-800 px-1.5 py-0.2 rounded font-mono">Secure</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectRole('library')} 
                className="hover:text-emerald-400 transition-colors text-left text-emerald-300 font-semibold flex items-center gap-1.5"
              >
                <span>Central E-Library & PDFs</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded">Grades 1-10</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectRole('gemini-lab')} 
                className="hover:text-emerald-400 transition-colors text-left text-amber-400"
              >
                Gemini AI Academic Counselor
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Academic Curricula */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3">Academics & Wings</h4>
          <ul className="space-y-2 text-slate-400">
            <li>• Early Childhood & Montessori (Nursery - Prep)</li>
            <li>• Primary Wing (Grades 1 to 5)</li>
            <li>• Middle School (Grades 6 to 8)</li>
            <li>• Secondary Matric Wing (Grades 9 & 10)</li>
            <li>• STEM Robotics & Computer Coding Lab</li>
            <li>• Inter-School Debates & Physical Sports</li>
          </ul>
        </div>

        {/* Col 4: Campus Contact */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3">Adam Doki Campus</h4>
          <div className="space-y-2.5">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Indus Bright Future School, Main Canal Bund Road, Near Government Hospital, Adam Doki, Sindh, Pakistan</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-sky-400 shrink-0" />
              <span>+92 243 552109 | +92 300 2894101</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>admissions@indusbrightfuture.edu.pk</span>
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-900 py-4 px-4 text-center text-slate-500 text-[11px] flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto">
        <span>© {new Date().getFullYear()} Indus Bright Future School Adam Doki. All rights reserved.</span>
        <span className="flex items-center gap-1 mt-1 sm:mt-0">
          Dedicated to quality education along the Indus River <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
        </span>
      </div>
    </footer>
  );
};
