import React, { useState } from 'react';
import { Student } from '../types';
import { 
  Sparkles, 
  Send, 
  BrainCircuit, 
  BookOpen, 
  Layers, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  RotateCcw
} from 'lucide-react';
import { geminiService, GeminiChatMessage } from '../services/geminiService';

interface GeminiLabProps {
  students: Student[];
}

export const GeminiLab: React.FC<GeminiLabProps> = ({ students }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'thinkingDiagnostic' | 'lessonPlanner'>('chat');
  
  // Chat State
  const [chatRole, setChatRole] = useState<'tutor' | 'guardian' | 'teacher' | 'career'>('tutor');
  const [messages, setMessages] = useState<GeminiChatMessage[]>([
    {
      role: 'assistant',
      text: 'Salam Alaikum! I am the Indus Bright Future School AI Academic Counselor. How can I assist you today with study guidance, lesson planning, or student progress?'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // High-Thinking Diagnostic State
  const [diagStudentId, setDiagStudentId] = useState<string>(students[0]?.id || '');
  const [diagTargetGoal, setDiagTargetGoal] = useState<string>('Prepare for BISE Matric Board Examinations with 90%+ target in Pre-Engineering');
  const [diagResult, setDiagResult] = useState<string>('');
  const [diagLoading, setDiagLoading] = useState<boolean>(false);

  // Lesson Planner State
  const [planSubject, setPlanSubject] = useState('Physics / Science');
  const [planGrade, setPlanGrade] = useState('Grade 9');
  const [planTopic, setPlanTopic] = useState('Newton’s Laws of Motion & Momentum');
  const [planDuration, setPlanDuration] = useState('45-Minute Class Period');
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [planLoading, setPlanLoading] = useState(false);

  const selectedStudentForDiag = students.find(s => s.id === diagStudentId) || students[0];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg: GeminiChatMessage = { role: 'user', text: chatInput };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setChatInput('');
    setChatLoading(true);

    try {
      let rolePrompt = 'You are the Academic Counselor for Indus Bright Future School Adam Doki, Sindh.';
      if (chatRole === 'tutor') {
        rolePrompt += ' Guide the student patiently using Sindh Textbook Board curriculum concepts, clear explanations, and interactive quizzes.';
      } else if (chatRole === 'guardian') {
        rolePrompt += ' Advise a parent warmly on how to support their child’s homework, screen-time balance, and preparation for board exams.';
      } else if (chatRole === 'teacher') {
        rolePrompt += ' Help school teachers with creative lesson ideas, classroom management, and formative evaluation strategies.';
      } else {
        rolePrompt += ' Advise students on career pathways in Pakistan (Pre-Medical, Pre-Engineering, Computer Science, Commerce) after Grade 9/10.';
      }

      const response = await geminiService.sendChat(updatedMessages, rolePrompt, 'gemini-3.5-flash');
      setMessages([...updatedMessages, { role: 'assistant', text: response.text }]);
    } catch (err: any) {
      console.error(err);
      setMessages([...updatedMessages, { role: 'assistant', text: 'Sorry, I encountered a temporary connection issue. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleRunDiagnostic = async () => {
    if (!selectedStudentForDiag) return;
    setDiagLoading(true);
    setDiagResult('');

    try {
      const response = await geminiService.generateHighThinkingDiagnostic({
        studentName: selectedStudentForDiag.fullName,
        grade: selectedStudentForDiag.grade,
        overallGrade: selectedStudentForDiag.termResults.overallGrade,
        attendanceRate: `${selectedStudentForDiag.attendancePercentage}%`,
        subjects: selectedStudentForDiag.termResults.subjects.map(s => ({
          subjectName: s.subjectName,
          obtainedMarks: s.obtainedMarks,
          maxMarks: s.maxMarks,
          grade: s.grade,
          teacherRemarks: s.teacherRemarks,
        })),
        targetGoal: diagTargetGoal,
        remarks: selectedStudentForDiag.termResults.teacherRemarks,
      });

      setDiagResult(response.text);
    } catch (err: any) {
      console.error(err);
      setDiagResult('Diagnostic analysis encountered an error. Please verify backend server state.');
    } finally {
      setDiagLoading(false);
    }
  };

  const handleGenerateLessonPlan = async () => {
    setPlanLoading(true);
    setGeneratedPlan('');
    try {
      const res = await geminiService.generateStudyPlan({
        subject: planSubject,
        grade: planGrade,
        topic: planTopic,
        duration: planDuration,
      });
      setGeneratedPlan(res.text);
    } catch (err: any) {
      console.error(err);
      setGeneratedPlan('Could not generate lesson plan at this time.');
    } finally {
      setPlanLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
            <Sparkles className="w-4 h-4" /> AI Academic Counseling & Diagnostics
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Gemini AI Academic Counselor
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Empowering students, parents, and teachers at Indus Bright Future School with high-thinking performance diagnostics and curriculum assistance.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'chat' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          Interactive Counselor Chat
        </button>
        <button
          onClick={() => setActiveTab('thinkingDiagnostic')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'thinkingDiagnostic' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <BrainCircuit className="w-4 h-4 text-sky-400" />
          High-Thinking Student Diagnostic (Gemini 3.1 Pro)
        </button>
        <button
          onClick={() => setActiveTab('lessonPlanner')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'lessonPlanner' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <BookOpen className="w-4 h-4 text-purple-400" />
          Curriculum Lesson Planner
        </button>
      </div>

      {/* TAB 1: CHAT */}
      {activeTab === 'chat' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[650px]">
          {/* Persona selector bar */}
          <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">Counseling Mode:</span>
              <div className="flex gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setChatRole('tutor')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    chatRole === 'tutor' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Student Tutor
                </button>
                <button
                  onClick={() => setChatRole('guardian')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    chatRole === 'guardian' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Parent Guidance
                </button>
                <button
                  onClick={() => setChatRole('teacher')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    chatRole === 'teacher' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Teacher Pedagogy
                </button>
                <button
                  onClick={() => setChatRole('career')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    chatRole === 'career' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Matric / BISE Career Advice
                </button>
              </div>
            </div>

            <button
              onClick={() => setMessages([{ role: 'assistant', text: 'Chat reset. How can I assist you?' }])}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg flex items-center gap-1"
              title="Reset Conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role !== 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-indigo-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    m.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-slate-800 border border-slate-700 text-slate-100 rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
                {m.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
            {chatLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></div>
                <span>Gemini AI is formulating response...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="p-4 bg-slate-950/80 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Ask anything about schooling, syllabus, board prep, or math problem..."
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: HIGH-THINKING DIAGNOSTIC */}
      {activeTab === 'thinkingDiagnostic' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BrainCircuit className="w-5 h-5 text-sky-400" />
              <h3 className="text-xl font-bold text-white">
                Gemini 3.1 Pro High-Thinking Diagnostic Engine
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Utilizes <span className="text-sky-300 font-mono">gemini-3.1-pro-preview</span> with advanced cognitive thinking to rigorously diagnose academic performance, pinpoint underlying knowledge gaps, and formulate personalized remediation roadmaps.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Student for Diagnostic</label>
                <select
                  value={diagStudentId}
                  onChange={e => setDiagStudentId(e.target.value)}
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
                <div className="font-bold text-white text-sm">{selectedStudentForDiag.fullName}</div>
                <div className="text-slate-300">Grade: {selectedStudentForDiag.grade} ({selectedStudentForDiag.section})</div>
                <div className="text-slate-300">Overall Grade: {selectedStudentForDiag.termResults.overallGrade} ({selectedStudentForDiag.termResults.percentage}%)</div>
                <div className="text-slate-300">Attendance: {selectedStudentForDiag.attendancePercentage}%</div>
                <div className="border-t border-slate-700 pt-2 text-[11px] text-slate-400">
                  {selectedStudentForDiag.termResults.subjects.length} subjects recorded in official transcript.
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Academic Goal</label>
                <input
                  type="text"
                  value={diagTargetGoal}
                  onChange={e => setDiagTargetGoal(e.target.value)}
                  placeholder="e.g. 90%+ in Board Exams"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              <button
                type="button"
                disabled={diagLoading}
                onClick={handleRunDiagnostic}
                className="w-full py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow disabled:opacity-50"
              >
                <BrainCircuit className="w-4 h-4" />
                {diagLoading ? 'Thinking Deeply & Analyzing...' : 'Run High-Thinking Diagnostic'}
              </button>
            </div>

            <div className="lg:col-span-2 bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between min-h-[400px]">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    Deep Diagnostic Report & Action Plan
                  </h4>
                  {diagResult && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(diagResult);
                        alert('Diagnostic copied to clipboard!');
                      }}
                      className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </button>
                  )}
                </div>

                {diagLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                    <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-sm font-semibold text-sky-300">
                      Gemini 3.1 Pro Thinking Mode Active
                    </div>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Synthesizing attendance rates, subject-by-subject scores, cognitive weaknesses, and formulating step-by-step remediation...
                    </p>
                  </div>
                ) : diagResult ? (
                  <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed overflow-y-auto max-h-[500px] pr-2">
                    {diagResult}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic py-20 text-center space-y-2">
                    <BrainCircuit className="w-10 h-10 text-slate-700 mx-auto" />
                    <p>Select a student and click "Run High-Thinking Diagnostic" to view an AI psychological and academic breakdown.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LESSON PLANNER */}
      {activeTab === 'lessonPlanner' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <h3 className="text-xl font-bold text-white">AI Curriculum & Lesson Plan Generator</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Generate structured, 5E-model lesson plans with Sindh curriculum alignment, lab experiments, and assessment quizzes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={planSubject}
                  onChange={e => setPlanSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Grade Level</label>
                <select
                  value={planGrade}
                  onChange={e => setPlanGrade(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm"
                >
                  <option value="Grade 10">Grade 10 (Matric)</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 6">Grade 6</option>
                  <option value="Primary (Grades 1-5)">Primary (Grades 1-5)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Topic / Unit</label>
                <input
                  type="text"
                  value={planTopic}
                  onChange={e => setPlanTopic(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Duration</label>
                <input
                  type="text"
                  value={planDuration}
                  onChange={e => setPlanDuration(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm"
                />
              </div>

              <button
                type="button"
                disabled={planLoading}
                onClick={handleGenerateLessonPlan}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow disabled:opacity-50"
              >
                <BookOpen className="w-4 h-4" />
                {planLoading ? 'Generating Lesson Plan...' : 'Generate Full Lesson Plan'}
              </button>
            </div>

            <div className="lg:col-span-2 bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between min-h-[400px]">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider">
                    Generated Pedagogical Lesson Plan
                  </h4>
                  {generatedPlan && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedPlan);
                        alert('Lesson plan copied to clipboard!');
                      }}
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy Plan
                    </button>
                  )}
                </div>

                {planLoading ? (
                  <div className="py-20 text-center text-xs text-slate-400">
                    Generating structured lesson plan with warm-up, core concepts, and evaluation questions...
                  </div>
                ) : generatedPlan ? (
                  <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed overflow-y-auto max-h-[500px] pr-2">
                    {generatedPlan}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic py-20 text-center">
                    Enter the topic details and click "Generate Full Lesson Plan" to create teacher curriculum materials.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
