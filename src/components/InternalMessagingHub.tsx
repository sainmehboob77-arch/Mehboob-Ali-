import React, { useState, useMemo } from 'react';
import { InternalMessage, MessageAttachment, Teacher, Student } from '../types';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Search, 
  Plus, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Users, 
  User, 
  GraduationCap, 
  ShieldCheck, 
  BookOpen, 
  Bell, 
  ChevronRight, 
  Download, 
  X, 
  Calendar, 
  Sparkles,
  Inbox,
  Filter,
  Check,
  CheckCheck,
  ArrowRight
} from 'lucide-react';

interface InternalMessagingHubProps {
  messages: InternalMessage[];
  teachers: Teacher[];
  students: Student[];
  onSendMessage: (msg: InternalMessage) => void;
  onMarkThreadRead: (threadId: string) => void;
}

export const InternalMessagingHub: React.FC<InternalMessagingHubProps> = ({
  messages,
  teachers,
  students,
  onSendMessage,
  onMarkThreadRead,
}) => {
  // Current logged in identity simulator
  const [currentUserRole, setCurrentUserRole] = useState<'teacher' | 'guardian' | 'student' | 'admin'>('teacher');
  const [currentUserId, setCurrentUserId] = useState<string>('TCH-001');

  // Search and Category Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'assignment' | 'update' | 'notice' | 'inquiry'>('all');
  const [selectedThreadId, setSelectedThreadId] = useState<string>('');

  // Active composer / modal
  const [showComposeModal, setShowComposeModal] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>('');
  const [replyPriority, setReplyPriority] = useState<'normal' | 'important'>('normal');

  // New Compose Form State
  const [newRecipientType, setNewRecipientType] = useState<'class' | 'teacher' | 'student' | 'guardian' | 'all'>('class');
  const [newRecipientId, setNewRecipientId] = useState<string>('class-grade-9');
  const [newCategory, setNewCategory] = useState<'assignment' | 'update' | 'notice' | 'inquiry'>('assignment');
  const [newSubject, setNewSubject] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newPriority, setNewPriority] = useState<'normal' | 'important' | 'urgent'>('normal');
  const [newDueDate, setNewDueDate] = useState<string>('2024-09-30');
  const [newAssignmentSubject, setNewAssignmentSubject] = useState<string>('Mathematics');
  const [newAttachmentName, setNewAttachmentName] = useState<string>('');

  // Pre-configured identity profiles
  const profiles = useMemo(() => [
    {
      id: 'TCH-001',
      name: 'Sir Ghulam Mustafa Solangi',
      role: 'teacher' as const,
      roleTitle: 'Principal & Mathematics Lead',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 'TCH-002',
      name: 'Madam Samina Kousar',
      role: 'teacher' as const,
      roleTitle: 'Senior English Specialist',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 'TCH-003',
      name: 'Engr. Kashif Ali Bhutto',
      role: 'teacher' as const,
      roleTitle: 'Computer Science & Robotics Lead',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 'IBFS-2024-0101',
      name: 'Bilal Ahmed Solangi',
      role: 'student' as const,
      roleTitle: 'Student · Grade 9-A',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 'IBFS-2024-0102',
      name: 'Mahnoor Tariq Memon',
      role: 'student' as const,
      roleTitle: 'Student · Grade 9-A',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 'GRD-45203-2918239-1',
      name: 'Naveed Ahmed Solangi',
      role: 'guardian' as const,
      roleTitle: 'Guardian / Father of Shayan Solangi',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 'GRD-45203-8829104-3',
      name: 'Dr. Tariq Noor Memon',
      role: 'guardian' as const,
      roleTitle: 'Guardian / Father of Ayesha Noor',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 'ADMIN-001',
      name: 'School Directorate Office',
      role: 'admin' as const,
      roleTitle: 'Campus Registrar & Administration',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&auto=format&fit=crop&q=80',
    },
  ], []);

  const currentProfile = useMemo(() => {
    return profiles.find(p => p.id === currentUserId) || profiles[0];
  }, [profiles, currentUserId]);

  // Group messages into threads
  const threads = useMemo(() => {
    const threadMap: Record<string, InternalMessage[]> = {};
    messages.forEach(msg => {
      if (!threadMap[msg.threadId]) {
        threadMap[msg.threadId] = [];
      }
      threadMap[msg.threadId].push(msg);
    });

    // Sort messages inside threads chronologically
    Object.keys(threadMap).forEach(key => {
      threadMap[key].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    });

    return threadMap;
  }, [messages]);

  // Thread summaries for the sidebar
  const threadSummaries = useMemo(() => {
    return Object.entries(threads).map(([threadId, msgs]) => {
      const firstMsg = msgs[0];
      const lastMsg = msgs[msgs.length - 1];
      const unreadCount = msgs.filter(m => !m.read && m.senderId !== currentUserId).length;

      return {
        threadId,
        subject: firstMsg.subject,
        category: firstMsg.category,
        priority: firstMsg.priority,
        assignmentDetails: firstMsg.assignmentDetails,
        firstMsg,
        lastMsg,
        unreadCount,
        messageCount: msgs.length,
      };
    }).sort((a, b) => new Date(b.lastMsg.timestamp).getTime() - new Date(a.lastMsg.timestamp).getTime());
  }, [threads, currentUserId]);

  // Filtered threads based on category & search
  const filteredThreads = useMemo(() => {
    return threadSummaries.filter(th => {
      const matchesCategory = selectedCategory === 'all' || th.category === selectedCategory;
      const matchesSearch = 
        th.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        th.lastMsg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        th.firstMsg.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        th.firstMsg.recipientName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [threadSummaries, selectedCategory, searchQuery]);

  // Set default active thread
  const activeThreadId = selectedThreadId || (filteredThreads[0]?.threadId ?? '');
  const activeThreadMessages = threads[activeThreadId] || [];
  const activeThreadSummary = threadSummaries.find(t => t.threadId === activeThreadId);

  // Switch identity
  const handleSelectProfile = (profileId: string) => {
    const p = profiles.find(item => item.id === profileId);
    if (p) {
      setCurrentUserId(p.id);
      setCurrentUserRole(p.role);
    }
  };

  // Mark thread read when clicking on it
  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    onMarkThreadRead(threadId);
  };

  // Handle quick reply
  const handleSendReply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !activeThreadSummary) return;

    const newReply: InternalMessage = {
      id: `MSG-${Date.now()}`,
      threadId: activeThreadId,
      senderId: currentProfile.id,
      senderName: currentProfile.name,
      senderRole: currentProfile.role,
      senderAvatar: currentProfile.avatar,
      recipientId: activeThreadSummary.firstMsg.senderId === currentProfile.id 
        ? activeThreadSummary.firstMsg.recipientId 
        : activeThreadSummary.firstMsg.senderId,
      recipientName: activeThreadSummary.firstMsg.senderId === currentProfile.id
        ? activeThreadSummary.firstMsg.recipientName
        : activeThreadSummary.firstMsg.senderName,
      recipientRole: activeThreadSummary.firstMsg.senderId === currentProfile.id
        ? activeThreadSummary.firstMsg.recipientRole
        : activeThreadSummary.firstMsg.senderRole,
      category: activeThreadSummary.category,
      subject: activeThreadSummary.subject.startsWith('RE:') ? activeThreadSummary.subject : `RE: ${activeThreadSummary.subject}`,
      content: replyText.trim(),
      timestamp: new Date().toISOString(),
      read: true,
      priority: replyPriority,
    };

    onSendMessage(newReply);
    setReplyText('');
  };

  // Quick reply chip selector
  const handleApplyQuickChip = (text: string) => {
    setReplyText(text);
  };

  // Create new message / broadcast thread
  const handleCreateNewThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newContent.trim()) return;

    let targetName = 'Grade 9 Class (All Students & Guardians)';
    let targetRole: 'class' | 'teacher' | 'student' | 'guardian' | 'all' = 'class';

    if (newRecipientType === 'class') {
      targetRole = 'class';
      targetName = newRecipientId === 'class-grade-9' ? 'Grade 9 Class (All Students & Guardians)' :
                   newRecipientId === 'class-grade-10' ? 'Grade 10 Matric Class' :
                   newRecipientId === 'class-grade-8' ? 'Grade 8 Middle Section' : 'Grade 7 Class';
    } else if (newRecipientType === 'all') {
      targetRole = 'all';
      targetName = 'Entire School Community (Faculty, Parents & Students)';
    } else if (newRecipientType === 'teacher') {
      targetRole = 'teacher';
      const t = teachers.find(item => item.id === newRecipientId) || teachers[0];
      targetName = t.name;
    } else if (newRecipientType === 'student') {
      targetRole = 'student';
      const s = students.find(item => item.id === newRecipientId) || students[0];
      targetName = `${s.fullName} (${s.grade})`;
    } else if (newRecipientType === 'guardian') {
      targetRole = 'guardian';
      const s = students.find(item => item.id === newRecipientId) || students[0];
      targetName = `${s.guardian.fatherName} (Guardian of ${s.fullName})`;
    }

    const threadId = `TH-${Date.now().toString().slice(-6)}`;
    const attachments: MessageAttachment[] = newAttachmentName.trim() ? [
      {
        id: `ATT-${Date.now()}`,
        name: newAttachmentName.endsWith('.pdf') ? newAttachmentName : `${newAttachmentName}.pdf`,
        size: '1.2 MB',
        type: 'pdf',
      }
    ] : [];

    const newMsg: InternalMessage = {
      id: `MSG-${Date.now()}`,
      threadId,
      senderId: currentProfile.id,
      senderName: currentProfile.name,
      senderRole: currentProfile.role,
      senderAvatar: currentProfile.avatar,
      recipientId: newRecipientId,
      recipientName: targetName,
      recipientRole: targetRole,
      category: newCategory,
      subject: newSubject.trim(),
      content: newContent.trim(),
      timestamp: new Date().toISOString(),
      read: true,
      priority: newPriority,
      attachments: attachments.length > 0 ? attachments : undefined,
      assignmentDetails: newCategory === 'assignment' ? {
        subject: newAssignmentSubject,
        dueDate: newDueDate,
        grade: 'Grade 9',
        maxScore: 25,
      } : undefined,
    };

    onSendMessage(newMsg);
    setSelectedThreadId(threadId);
    setShowComposeModal(false);
    setNewSubject('');
    setNewContent('');
    setNewAttachmentName('');
  };

  // Category visual styles helper
  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'assignment':
        return { label: 'Assignment & Homework', bg: 'bg-amber-950/70 text-amber-300 border-amber-800/80', icon: BookOpen };
      case 'update':
        return { label: 'Academic Update', bg: 'bg-sky-950/70 text-sky-300 border-sky-800/80', icon: Bell };
      case 'notice':
        return { label: 'Official Notice', bg: 'bg-purple-950/70 text-purple-300 border-purple-800/80', icon: ShieldCheck };
      case 'inquiry':
        return { label: 'Guardian / Teacher Inquiry', bg: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80', icon: MessageSquare };
      default:
        return { label: 'General Message', bg: 'bg-slate-800 text-slate-300 border-slate-700', icon: MessageSquare };
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'teacher':
        return { label: 'Faculty / Teacher', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'student':
        return { label: 'Enrolled Student', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' };
      case 'guardian':
        return { label: 'Parent / Guardian', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'admin':
        return { label: 'Administration', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      default:
        return { label: 'Campus Member', color: 'bg-slate-700 text-slate-300 border-slate-600' };
    }
  };

  const formatMessageTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' · ' +
             d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-white">
      {/* Top Banner & Active Identity Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Secure Internal Campus Messaging
            </span>
            <span className="bg-emerald-950/80 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-700/60">
              IBFS Protected Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Communications, Assignments & Notices Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Real-time direct and broadcast communication between teachers, parents, and students of Indus Bright Future School.
          </p>
        </div>

        {/* Identity Selector */}
        <div className="bg-slate-800/90 border border-slate-700/90 p-3 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-3 shrink-0 shadow-lg">
          <div className="flex items-center gap-2.5">
            <img 
              src={currentProfile.avatar} 
              alt={currentProfile.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/60 shrink-0" 
            />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Active Portal Persona:</span>
              <span className="text-xs font-bold text-white block">{currentProfile.name}</span>
              <span className="text-[10px] text-emerald-400 font-semibold">{currentProfile.roleTitle}</span>
            </div>
          </div>

          <div className="border-t sm:border-t-0 sm:border-l border-slate-700 pt-2 sm:pt-0 sm:pl-3">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Switch Persona:
            </label>
            <select
              value={currentUserId}
              onChange={e => handleSelectProfile(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <optgroup label="Teachers & Faculty">
                {profiles.filter(p => p.role === 'teacher').map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.roleTitle})</option>
                ))}
              </optgroup>
              <optgroup label="Students">
                {profiles.filter(p => p.role === 'student').map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.roleTitle})</option>
                ))}
              </optgroup>
              <optgroup label="Guardians & Parents">
                {profiles.filter(p => p.role === 'guardian').map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.roleTitle})</option>
                ))}
              </optgroup>
              <optgroup label="Administration">
                {profiles.filter(p => p.role === 'admin').map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Sidebar (Threads & Filters) + Right Panel (Active Conversation Stream) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[680px]">
        {/* LEFT COLUMN: 4 COLS */}
        <div className="lg:col-span-4 flex flex-col bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-4">
          {/* Action Header: Search & Compose */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search subject, notice, or name..."
                className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              onClick={() => setShowComposeModal(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950 transition-all cursor-pointer hover:scale-105 shrink-0"
              title="Compose New Message / Assignment"
            >
              <Plus className="w-4 h-4" />
              <span>Compose</span>
            </button>
          </div>

          {/* Category Channel Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap cursor-pointer transition-all ${
                selectedCategory === 'all'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-800/70 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              All ({threadSummaries.length})
            </button>
            <button
              onClick={() => setSelectedCategory('assignment')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1 ${
                selectedCategory === 'assignment'
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-slate-800/70 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Assignments
            </button>
            <button
              onClick={() => setSelectedCategory('update')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1 ${
                selectedCategory === 'update'
                  ? 'bg-sky-600 text-white shadow'
                  : 'bg-slate-800/70 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              Updates
            </button>
            <button
              onClick={() => setSelectedCategory('notice')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1 ${
                selectedCategory === 'notice'
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-slate-800/70 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Notices
            </button>
            <button
              onClick={() => setSelectedCategory('inquiry')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1 ${
                selectedCategory === 'inquiry'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-800/70 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Inquiries
            </button>
          </div>

          {/* Thread List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[560px]">
            {filteredThreads.length === 0 ? (
              <div className="text-center p-8 text-slate-500 text-xs">
                <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                No messages found under this filter.
              </div>
            ) : (
              filteredThreads.map(th => {
                const isSelected = activeThreadId === th.threadId;
                const catInfo = getCategoryBadge(th.category);
                const CatIcon = catInfo.icon;

                return (
                  <div
                    key={th.threadId}
                    onClick={() => handleSelectThread(th.threadId)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative space-y-2 ${
                      isSelected
                        ? 'bg-slate-800/90 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                        : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/70'
                    }`}
                  >
                    {/* Top Row: Category Pill & Time */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={`px-2 py-0.5 rounded-full font-semibold border flex items-center gap-1 ${catInfo.bg}`}>
                        <CatIcon className="w-3 h-3" />
                        {catInfo.label}
                      </span>
                      <span className="text-slate-400 text-[10px]">
                        {formatMessageTime(th.lastMsg.timestamp)}
                      </span>
                    </div>

                    {/* Subject Line */}
                    <h3 className={`text-xs font-bold line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {th.subject}
                    </h3>

                    {/* Latest Snippet */}
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {th.lastMsg.content}
                    </p>

                    {/* Bottom Senders & Unread Pill */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px]">
                      <div className="flex items-center gap-1.5 text-slate-300 truncate max-w-[200px]">
                        <span className="text-slate-400">By:</span>
                        <strong className="text-emerald-400 truncate">{th.firstMsg.senderName}</strong>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {th.priority === 'urgent' && (
                          <span className="bg-rose-950 text-rose-300 border border-rose-800 px-1.5 py-0.2 rounded font-bold uppercase text-[9px]">
                            Urgent
                          </span>
                        )}
                        {th.unreadCount > 0 && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        )}
                        <span className="text-slate-500 font-mono">
                          {th.messageCount} msg{th.messageCount > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: 8 COLS (ACTIVE CHAT & THREAD DETAILS) */}
        <div className="lg:col-span-8 flex flex-col bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          {activeThreadSummary ? (
            <>
              {/* Thread Header */}
              <div className="border-b border-slate-800 pb-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getCategoryBadge(activeThreadSummary.category).bg}`}>
                        {getCategoryBadge(activeThreadSummary.category).label}
                      </span>
                      {activeThreadSummary.priority === 'urgent' && (
                        <span className="bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          Urgent Priority
                        </span>
                      )}
                      {activeThreadSummary.priority === 'important' && (
                        <span className="bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          Important
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
                      {activeThreadSummary.subject}
                    </h2>
                  </div>

                  {/* Recipient Target Banner */}
                  <div className="text-right text-xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Channel Recipient:</span>
                    <span className="font-semibold text-emerald-400">{activeThreadSummary.firstMsg.recipientName}</span>
                  </div>
                </div>

                {/* If Assignment: Highlight Box with Due Date & Max Marks */}
                {activeThreadSummary.assignmentDetails && (
                  <div className="bg-amber-950/40 border border-amber-800/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                          Subject Assignment: {activeThreadSummary.assignmentDetails.subject} ({activeThreadSummary.assignmentDetails.grade})
                        </h4>
                        <p className="text-xs text-amber-200/80">
                          Solve questions in register & submit before deadline for grading.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <div className="text-right">
                        <span className="text-[10px] text-amber-400 block font-bold uppercase">Submission Deadline:</span>
                        <span className="text-white font-mono flex items-center gap-1 justify-end">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          {activeThreadSummary.assignmentDetails.dueDate}
                        </span>
                      </div>
                      {activeThreadSummary.assignmentDetails.maxScore && (
                        <div className="text-right border-l border-amber-800/80 pl-3">
                          <span className="text-[10px] text-amber-400 block font-bold uppercase">Max Marks:</span>
                          <span className="text-amber-300 font-mono text-sm font-bold">
                            {activeThreadSummary.assignmentDetails.maxScore} Pts
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Message Stream */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[460px]">
                {activeThreadMessages.map(msg => {
                  const isCurrentUser = msg.senderId === currentProfile.id;
                  const senderBadge = getRoleBadge(msg.senderRole);

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3.5 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <img
                        src={msg.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                        alt={msg.senderName}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                      />

                      <div className={`max-w-[85%] sm:max-w-[75%] space-y-1.5 ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                        {/* Sender info */}
                        <div className={`flex items-center gap-2 text-[11px] ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                          <strong className="text-white">{msg.senderName}</strong>
                          <span className={`px-2 py-0.2 rounded-full text-[9px] font-semibold border ${senderBadge.color}`}>
                            {senderBadge.label}
                          </span>
                          <span className="text-slate-400 text-[10px]">
                            {formatMessageTime(msg.timestamp)}
                          </span>
                        </div>

                        {/* Content Bubble */}
                        <div
                          className={`p-4 rounded-2xl text-xs sm:text-sm whitespace-pre-line leading-relaxed shadow-lg ${
                            isCurrentUser
                              ? 'bg-emerald-950/80 border border-emerald-700 text-emerald-100 rounded-tr-none'
                              : 'bg-slate-800/90 border border-slate-700 text-slate-200 rounded-tl-none'
                          }`}
                        >
                          {msg.content}

                          {/* Attachments inside bubble */}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-700/80 space-y-2">
                              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                                <Paperclip className="w-3 h-3 text-emerald-400" /> Attached Documents & Reference Sheets:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {msg.attachments.map(att => (
                                  <div
                                    key={att.id}
                                    className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700 flex items-center justify-between gap-2 hover:border-emerald-500 transition-colors"
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <FileText className="w-4 h-4 text-rose-400 shrink-0" />
                                      <div className="min-w-0">
                                        <div className="text-xs font-semibold text-white truncate">{att.name}</div>
                                        <div className="text-[10px] text-slate-400">{att.size}</div>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => alert(`Downloading "${att.name}" from Indus Bright Future School repository.`)}
                                      className="p-1.5 bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer shrink-0"
                                      title="Download Document"
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Message status receipt */}
                        {isCurrentUser && (
                          <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400">
                            <span>Delivered & Stored</span>
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Reply Suggestions */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Quick Replies:
                  </span>
                  {[
                    'Understood, will complete before the deadline.',
                    'Thank you for the guidance.',
                    'Acknowledged and noted for class.',
                    'Assignment solution submitted.',
                    'Kindly schedule a brief consultation.',
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleApplyQuickChip(chip)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap cursor-pointer transition-colors border border-slate-700"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Reply Composer Form */}
                <form onSubmit={handleSendReply} className="space-y-3">
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder={`Reply as ${currentProfile.name} (${currentProfile.roleTitle})...`}
                      className="w-full px-4 py-3 bg-slate-800/90 border border-slate-700 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 resize-none shadow-inner"
                      onKeyDown={e => {
                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                          handleSendReply();
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <select
                        value={replyPriority}
                        onChange={e => setReplyPriority(e.target.value as any)}
                        className="bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
                      >
                        <option value="normal">Normal Priority</option>
                        <option value="important">Important Response</option>
                      </select>

                      <span className="hidden sm:inline text-[11px] text-slate-400">
                        Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300 text-[10px]">Ctrl+Enter</kbd> to send
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={!replyText.trim()}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950 cursor-pointer transition-all hover:scale-105"
                    >
                      <Send className="w-4 h-4" />
                      Send Reply
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
              <MessageSquare className="w-12 h-12 text-slate-600 mb-3" />
              <h3 className="text-base font-bold text-white mb-1">Select a Conversation or Notice</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Choose an existing thread from the left menu or click "Compose" to send a new assignment or announcement.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* NEW COMPOSE MODAL */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 text-white space-y-5 shadow-2xl animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Compose New Campus Communication</h3>
                  <p className="text-xs text-slate-400">Posting from: <strong className="text-emerald-400">{currentProfile.name}</strong></p>
                </div>
              </div>
              <button
                onClick={() => setShowComposeModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Compose Form */}
            <form onSubmit={handleCreateNewThread} className="space-y-4">
              {/* Row 1: Category & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Communication Type:
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="assignment">Assignment / Homework Task</option>
                    <option value="update">Daily Academic Update</option>
                    <option value="notice">Official Institutional Notice</option>
                    <option value="inquiry">Guardian Inquiry / Private Consultation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Priority Level:
                  </label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="normal">Normal</option>
                    <option value="important">Important (Highlighted)</option>
                    <option value="urgent">Urgent Notice (Red Alert)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Recipient Type & Target */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Target Recipient Group:
                  </label>
                  <select
                    value={newRecipientType}
                    onChange={e => {
                      const type = e.target.value as any;
                      setNewRecipientType(type);
                      if (type === 'class') setNewRecipientId('class-grade-9');
                      else if (type === 'all') setNewRecipientId('all');
                      else if (type === 'teacher') setNewRecipientId(teachers[0]?.id || 'TCH-001');
                      else setNewRecipientId(students[0]?.id || 'IBFS-2024-0101');
                    }}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="class">Entire Class (Grade 9 / Grade 10 / Grade 8)</option>
                    <option value="all">Entire School Community (All)</option>
                    <option value="teacher">Specific Teacher / Faculty Specialist</option>
                    <option value="student">Specific Student</option>
                    <option value="guardian">Specific Parent / Guardian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Select Target:
                  </label>
                  {newRecipientType === 'class' ? (
                    <select
                      value={newRecipientId}
                      onChange={e => setNewRecipientId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="class-grade-9">Grade 9 Class (Students & Guardians)</option>
                      <option value="class-grade-10">Grade 10 Matric Science Group</option>
                      <option value="class-grade-8">Grade 8 Middle Section</option>
                      <option value="class-grade-7">Grade 7 Section A</option>
                    </select>
                  ) : newRecipientType === 'all' ? (
                    <input
                      type="text"
                      disabled
                      value="All School Community Members"
                      className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-slate-400 cursor-not-allowed"
                    />
                  ) : newRecipientType === 'teacher' ? (
                    <select
                      value={newRecipientId}
                      onChange={e => setNewRecipientId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({t.subjects.join(', ')})</option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={newRecipientId}
                      onChange={e => setNewRecipientId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {students.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.fullName} ({s.grade}) {newRecipientType === 'guardian' ? `· Father: ${s.guardian.fatherName}` : ''}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Conditional Row for Assignments */}
              {newCategory === 'assignment' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-amber-950/30 border border-amber-800/60 rounded-2xl">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-amber-300 mb-1">
                      Subject:
                    </label>
                    <input
                      type="text"
                      value={newAssignmentSubject}
                      onChange={e => setNewAssignmentSubject(e.target.value)}
                      placeholder="e.g. Mathematics, Science, English"
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-amber-300 mb-1">
                      Due Date:
                    </label>
                    <input
                      type="date"
                      value={newDueDate}
                      onChange={e => setNewDueDate(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* Subject Title */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Subject / Topic:
                </label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  placeholder="e.g. Physics Chapter 3 Numerical Problems or Science Fair Participation"
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Content Body */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Detailed Message Body:
                </label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Write clear instructions, questions, or notices..."
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              {/* Optional Attachment File */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                  <Paperclip className="w-3.5 h-3.5 text-emerald-400" />
                  Attach Material or Worksheet (Optional PDF):
                </label>
                <input
                  type="text"
                  value={newAttachmentName}
                  onChange={e => setNewAttachmentName(e.target.value)}
                  placeholder="e.g. Chemistry_Lab_Manual_Ch3.pdf"
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowComposeModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
                >
                  <Send className="w-4 h-4" />
                  Publish & Broadcast Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
