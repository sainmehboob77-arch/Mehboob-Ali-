import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with required telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Gemini Multi-turn Chat endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { messages, roleInstruction, model = 'gemini-3.5-flash' } = req.body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const systemInstruction = roleInstruction || 
      `You are the official AI Academic Counselor and School Advisor for "Indus Bright Future School Adam Doki".
Indus Bright Future School is a premier educational institution in Adam Doki, Sindh, known for high academic standards, moral development, STEM labs, and holistic education for Nursery through Grade 10 (Matric & O-Level equivalents).
You assist students, parents/guardians, and teachers with:
- Academic advice, exam preparation strategies, and study habits
- Explaining syllabus, course books, and homework guidance
- School policies, timetable advice, and admission procedures
- Encouraging words and ethical guidance for young learners
Be warm, professional, encouraging, culturally respectful, and clear. Format responses with neat bullet points or short paragraphs where helpful.`;

    const contents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    // Choose model safely: gemini-3.5-flash for general chat, gemini-3.1-flash-lite for quick, gemini-3.1-pro-preview for deep academic counseling
    const selectedModel = model === 'gemini-3.1-pro-preview' 
      ? 'gemini-3.1-pro-preview'
      : model === 'gemini-3.1-flash-lite'
        ? 'gemini-3.1-flash-lite'
        : 'gemini-3.5-flash';

    try {
      const response = await ai.models.generateContent({
        model: selectedModel,
        contents,
        config: {
          systemInstruction,
        },
      });

      return res.json({ text: response.text });
    } catch (primaryErr: any) {
      console.warn(`Primary model ${selectedModel} failed, trying fallback:`, primaryErr?.message);
      // Fallback to gemini-3.8-flash if selected model failed
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
        },
      });
      return res.json({ text: fallbackResponse.text, fallbackUsed: true });
    }
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate response' });
  }
});

// Gemini High-Thinking Academic Diagnostic & Performance Analysis Endpoint
// Strictly utilizes gemini-3.1-pro-preview with ThinkingLevel.HIGH as requested
app.post('/api/gemini/analyze-performance', async (req, res) => {
  try {
    const { studentName, grade, subjects, attendanceRate, overallGrade, targetGoal, remarks } = req.body;

    const prompt = `Perform a high-level, rigorous academic diagnostic and personalized study optimization plan for this student at Indus Bright Future School Adam Doki:
Student: ${studentName || 'Student'}
Class/Grade: ${grade || 'Grade 9'}
Overall Grade/Average: ${overallGrade || 'B+ (78%)'}
Attendance Rate: ${attendanceRate || '91%'}
Subject Performance Breakdown:
${JSON.stringify(subjects || [], null, 2)}
Teacher Notes & Observations: ${remarks || 'Needs consistency in mathematics problem solving and science lab practicals.'}
Student/Parent Target Goal: ${targetGoal || 'Achieve A1 Grade (>85%) in upcoming Annual Board Examination'}

Please provide:
1. Executive Academic Diagnostic (Strengths, Core Bottlenecks, and Learning Habit Analysis)
2. In-Depth Subject-by-Subject Remedial Actions (Focusing on conceptual gaps, syllabus mastery, and exam writing technique)
3. 4-Week Tailored Action Schedule (Daily time allocations, active recall sessions, and weekend self-quizzes)
4. Guardian/Parent Support Guide (Practical home-study environment tips, emotional encouragement, and monitoring advice)
5. Projected Grade Trajectory with Milestones.`;

    try {
      // Must use gemini-3.1-pro-preview and thinkingLevel: ThinkingLevel.HIGH without maxOutputTokens
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
          systemInstruction: 'You are the Chief Academic Evaluator & Board Examiner for Indus Bright Future School Adam Doki. Deliver rigorous, deep, pedagogically sound, and actionable academic diagnostics with high intellectual depth.',
        },
      });

      return res.json({ text: response.text, model: 'gemini-3.1-pro-preview (High Thinking)' });
    } catch (thinkingErr: any) {
      console.warn('gemini-3.1-pro-preview failed, falling back to gemini-3.8-flash:', thinkingErr?.message);
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are the Academic Counselor for Indus Bright Future School Adam Doki. Deliver comprehensive and actionable diagnostics.',
        },
      });
      return res.json({ text: fallbackResponse.text, model: 'gemini-3.8-flash (Fallback)' });
    }
  } catch (error: any) {
    console.error('Diagnostic API Error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate diagnostic' });
  }
});

// Gemini Study Plan & Lesson Plan Generator
app.post('/api/gemini/study-plan', async (req, res) => {
  try {
    const { topic, grade, subject, duration, learningObjectives } = req.body;

    const prompt = `Design a comprehensive, structured Study Plan and Learning Guide for Indus Bright Future School Adam Doki students:
Subject: ${subject}
Grade/Class: ${grade}
Topic/Chapter: ${topic}
Duration: ${duration || '1 Week (5 Days)'}
Learning Objectives: ${learningObjectives || 'Master core formulas, understand conceptual foundations, and solve past board questions.'}

Structure the output cleanly:
- Overview & Concept Blueprint
- Day-by-Day Study Routine (Theory, Practice Exercises, Review)
- Essential Formulas & Vocabulary Key
- Recommended Textbooks & Reference Pages
- Self-Assessment Checkpoints & Practice Questions (with hints)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error('Study Plan API Error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate study plan' });
  }
});

// Gemini Teacher Report Card Remarks Generator
app.post('/api/gemini/report-remarks', async (req, res) => {
  try {
    const { studentName, grade, topSubject, weakSubject, conduct, attendance } = req.body;

    const prompt = `Write 3 variations of professional, encouraging, and balanced official Report Card Remarks for a student at Indus Bright Future School Adam Doki:
Student: ${studentName}
Grade: ${grade}
Top Subject: ${topSubject}
Area Needing Improvement: ${weakSubject}
Conduct & Discipline: ${conduct || 'Well-mannered, attentive, participates actively'}
Attendance: ${attendance || '94%'}

Return 3 distinct remark options:
1. Academic Excellence & Motivation (formal and inspiring)
2. Constructive Growth & Next Steps (balanced feedback with clear remedial push)
3. Concise Official Summary (compact, ideal for standard report card text box)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error('Remarks API Error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate remarks' });
  }
});

// Vite Middleware mounting for Dev mode & Static serving for Production
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Indus Bright Future School Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
