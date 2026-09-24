export interface GeminiChatMessage {
  role: 'user' | 'assistant' | 'model';
  text: string;
}

export interface StudentDiagnosticRequest {
  studentName: string;
  grade: string;
  overallGrade: string;
  attendanceRate: string;
  subjects: Array<{
    subjectName: string;
    obtainedMarks: number;
    maxMarks: number;
    grade: string;
    teacherRemarks?: string;
  }>;
  targetGoal?: string;
  remarks?: string;
}

export const geminiService = {
  async sendChat(
    messages: GeminiChatMessage[],
    roleInstruction?: string,
    model: string = 'gemini-3.5-flash'
  ): Promise<{ text: string; fallbackUsed?: boolean }> {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, roleInstruction, model }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(err.error || `Server responded with status ${res.status}`);
    }

    return await res.json();
  },

  // High-Thinking Diagnostic powered by gemini-3.1-pro-preview
  async generateHighThinkingDiagnostic(data: StudentDiagnosticRequest): Promise<{ text: string; model: string }> {
    const res = await fetch('/api/gemini/analyze-performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Diagnostic request failed' }));
      throw new Error(err.error || `Server error: ${res.status}`);
    }

    return await res.json();
  },

  async generateStudyPlan(params: {
    topic: string;
    grade: string;
    subject: string;
    duration?: string;
    learningObjectives?: string;
  }): Promise<{ text: string }> {
    const res = await fetch('/api/gemini/study-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Study plan failed' }));
      throw new Error(err.error || `Server error: ${res.status}`);
    }

    return await res.json();
  },

  async generateReportRemarks(params: {
    studentName: string;
    grade: string;
    topSubject: string;
    weakSubject: string;
    conduct?: string;
    attendance?: string;
  }): Promise<{ text: string }> {
    const res = await fetch('/api/gemini/report-remarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Remarks failed' }));
      throw new Error(err.error || `Server error: ${res.status}`);
    }

    return await res.json();
  },
};
