import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, 
  Send, 
  X, 
  Paperclip, 
  Loader2, 
  Sparkles, 
  Trash2, 
  BookOpen, 
  HelpCircle,
  AlertCircle,
  Menu,
  Plus
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  image?: string | null;  // base64 url
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("study_with_me_ai_sessions");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const loadedSessions = parsed.map((s: any) => ({
            ...s,
            messages: s.messages.map((m: any) => ({
              ...m,
              timestamp: new Date(m.timestamp)
            }))
          }));
          setSessions(loadedSessions);
          setCurrentSessionId(loadedSessions[0].id);
          return;
        }
      } catch (e) {
        console.error("Error parsing saved sessions:", e);
      }
    }

    const initialId = `session-${Date.now()}`;
    const defaultSession: ChatSession = {
      id: initialId,
      title: "محادثة ترحيبية",
      messages: [
        {
          id: "welcome",
          role: "model",
          text: "مرحباً بك في بوابة الدعم الذكي! 🎓 ✨\n\nأنا **مساعدك الأكاديمي الذكي (Study With Me AI)**.\n\nيمكنني مساعدتك في:\n* **حل التمارين والواجبات** في الرياضيات، العلوم، الفيزياء ومختلف المواد.\n* **شرح الدروس الصعبة** وتلخيص المناهج لجميع الأطوار.\n* **تقديم نصائح وجداول للمراجعة** وتنظيم الوقت والتحضير للامتحانات والشهادات (BEM / BAC).\n\n💡 **ميزة رائعة:** يمكنك الضغط على زر المشبك 📎 لرفع صورة تمرين أو مخطط وسأقوم بحله وشرحه لك بالتفصيل!",
          timestamp: new Date()
        }
      ],
      createdAt: new Date().toISOString()
    };
    setSessions([defaultSession]);
    setCurrentSessionId(initialId);
  }, []);

  // Save sessions to localStorage on changes
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("study_with_me_ai_sessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  // Derive active session & messages
  const activeSession = sessions.find(s => s.id === currentSessionId);
  const messages = activeSession ? activeSession.messages : [];

  // Auto scroll to bottom when messages or loading status change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Handle silent instant scroll to bottom on open to prevent page viewport movement
  useEffect(() => {
    if (isOpen && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorNotice("حجم الصورة كبير جداً! يرجى اختيار صورة أقل من 8 ميجابايت.");
      setTimeout(() => setErrorNotice(null), 4000);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (!file) continue;

        if (file.size > 8 * 1024 * 1024) {
          setErrorNotice("حجم الصورة من الحافظة كبير جداً! يرجى لصق صورة أقل من 8 ميجابايت.");
          setTimeout(() => setErrorNotice(null), 4000);
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
        
        // Prevent default input behavior so it doesn't paste binary garbage or metadata
        e.preventDefault();
        break;
      }
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSend = async (textToSend: string = inputText) => {
    if (!textToSend.trim() && !selectedImage) return;

    setErrorNotice(null);
    const userMessageText = textToSend;
    setInputText("");
    
    // Add user message to state
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: "user",
      text: userMessageText,
      image: selectedImage,
      timestamp: new Date()
    };

    // Auto update title if first message of generic session
    let updatedTitle = activeSession?.title;
    if (activeSession && activeSession.messages.length === 1 && activeSession.messages[0].id === "welcome") {
      updatedTitle = userMessageText.length > 20 ? userMessageText.substring(0, 20) + "..." : userMessageText;
    }

    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return {
          ...s,
          title: updatedTitle || s.title,
          messages: [...s.messages, userMsg]
        };
      }
      return s;
    }));
    
    setIsLoading(true);

    // Capture state values before clearing
    const currentImg = selectedImage;
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Build conversation history for context (keep recent turns to avoid exceeding tokens)
    const historyPayload = messages.slice(-8).map(m => ({
      role: m.role,
      parts: m.image 
        ? [{ text: m.text }, { inlineData: { mimeType: m.image.split(";")[0].split(":")[1], data: m.image.split(",")[1] } }]
        : [{ text: m.text }]
    }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMessageText,
          image: currentImg,
          history: historyPayload
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "فشل الاتصال بخادم الذكاء الاصطناعي");
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "model",
        text: data.text || "عذراً، لم أستطع توليد إجابة مناسبة. أعد المحاولة.",
        timestamp: new Date()
      };

      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            messages: [...s.messages, aiMsg]
          };
        }
        return s;
      }));
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message || "حدث خطأ غير متوقع. جرب مرة أخرى.");
      
      const errMsg: Message = {
        id: `ai-err-${Date.now()}`,
        role: "model",
        text: `⚠️ **فشل في تسليم الطلب**\n\nلم نتمكن من تلقي رد من الخادم الأكاديمي. الرجاء التحقق من تهيئة **مفتاح API لـ Gemini** في لوحة الإعدادات أو المحاولة لاحقاً.\n\n*تفاصيل الخطأ الكامنة: ${err.message || "الشبكة مشغولة أو مغلقة"}*`,
        timestamp: new Date()
      };

      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            messages: [...s.messages, errMsg]
          };
        }
        return s;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: `محادثة جديدة`,
      messages: [
        {
          id: "welcome",
          role: "model",
          text: "مرحباً بك في بوابة الدعم الذكي! 🎓 ✨\n\nأنا **مساعدك الأكاديمي الذكي (Study With Me AI)**.\n\nيمكنني مساعدتك في:\n* **حل التمارين والواجبات** في الرياضيات، العلوم، الفيزياء ومختلف المواد.\n* **شرح الدروس الصعبة** وتلخيص المناهج لجميع الأطوار.\n* **تقديم نصائح وجداول للمراجعة** وتنظيم الوقت والتحضير للامتحانات والشهادات (BEM / BAC).\n\n💡 **ميزة رائعة:** يمكنك الضغط على زر المشبك 📎 لرفع صورة تمرين أو مخطط وسأقوم بحله وشرحه لك بالتفصيل!",
          timestamp: new Date()
        }
      ],
      createdAt: new Date().toISOString()
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setIsSidebarOpen(false); // Close drawer to start chatting immediately
  };

  const handleDeleteChat = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid switching sessions upon clicking delete

    const updatedSessions = sessions.filter(s => s.id !== idToDelete);

    if (updatedSessions.length === 0) {
      const newId = `session-${Date.now()}`;
      const defaultSession: ChatSession = {
        id: newId,
        title: "محادثة ترحيبية",
        messages: [
          {
            id: "welcome",
            role: "model",
            text: "مرحباً بك في بوابة الدعم الذكي! 🎓 ✨\n\nأنا **مساعدك الأكاديمي الذكي (Study With Me AI)**.\n\nيمكنني مساعدتك في:\n* **حل التمارين والواجبات** في الرياضيات، العلوم، الفيزياء ومختلف المواد.\n* **شرح الدروس الصعبة** وتلخيص المناهج لجميع الأطوار.\n* **تقديم نصائح وجداول للمراجعة** وتنظيم الوقت والتحضير للامتحانات والشهادات (BEM / BAC).\n\n💡 **ميزة رائعة:** يمكنك الضغط على زر المشبك 📎 لرفع صورة تمرين أو مخطط وسأقوم بحله وشرحه لك بالتفصيل!",
            timestamp: new Date()
          }
        ],
        createdAt: new Date().toISOString()
      };
      setSessions([defaultSession]);
      setCurrentSessionId(newId);
      localStorage.removeItem("study_with_me_ai_sessions");
    } else {
      setSessions(updatedSessions);
      if (idToDelete === currentSessionId) {
        setCurrentSessionId(updatedSessions[0].id);
      }
    }
  };

  const handleSuggestionClick = (suggestionText: string) => {
    handleSend(suggestionText);
  };

  // Helper parser for simple formatting (bold, bullet/numeric lists, code comments etc.)
  const renderFormattedText = (text: string) => {
    if (!text) return null;
    
    // Clean up dollar signs from math formatting to keep it human-friendly
    const cleanedText = text
      .replace(/\$\$(.*?)\$\$/g, "$1") // Strip block math $$ ... $$
      .replace(/\$(.*?)\$/g, "$1");   // Strip inline math $ ... $
    
    const lines = cleanedText.split('\n');
    return lines.map((line, index) => {
      const cleanLine = line.trim();
      
      // Inline bullets
      if (cleanLine.startsWith('* ') || cleanLine.startsWith('- ')) {
        const content = cleanLine.substring(2);
        return (
          <li key={index} className="list-disc list-inside mr-1.5 mb-1 text-right text-[11px] leading-relaxed text-gray-200" dir="rtl">
            {parseInlineFormatting(content)}
          </li>
        );
      }
      
      // Numeric indices
      const numMatch = cleanLine.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        const content = numMatch[2];
        return (
          <li key={index} className="list-decimal list-inside mr-1.5 mb-1 text-right text-[11px] leading-relaxed text-gray-200" dir="rtl">
            {parseInlineFormatting(content)}
          </li>
        );
      }
      
      // Code container ignore
      if (cleanLine.startsWith('```')) {
        return null; // Suppress backticks decoration
      }
      
      // Empty spaces
      if (cleanLine === '') {
        return <div key={index} className="h-1.5" />;
      }
      
      return (
        <p key={index} className="mb-1 text-[11px] leading-relaxed text-gray-200" dir="rtl">
          {parseInlineFormatting(line)}
        </p>
      );
    });
  };

  const parseInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-extrabold text-amber-400">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const suggestions = [
    "كيف أنظم وقتي للمراجعة النهائية للبكالوريا؟",
    "اشرح لي المتتاليات الحسابية والهندسية بتبسيط",
    "اعطني نصائح للتغلب على قلق الامتحان"
  ];

  return (
    <>
      {/* Floating Prompt Label next to the button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            transition={{ delay: 0.5, duration: 0.25 }}
            className="fixed bottom-9 right-24 z-[85] flex items-center gap-1.5 bg-gradient-to-l from-[#141635] via-[#0E1026] to-[#0B0C1E] border border-indigo-500/30 text-indigo-200 text-[11px] sm:text-xs font-bold py-2 px-3.5 rounded-full shadow-xl shadow-indigo-950/60 pointer-events-none select-none transition-all hover:border-indigo-500/50"
            dir="rtl"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-pulse shrink-0" />
            <span className="leading-none">اسأل الذكاء الاصطناعي</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <button
        id="floating-ai-chat-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[90] w-14 h-14 bg-gradient-to-tr from-[#2563EB] via-[#4F46E5] to-[#7C3AED] hover:from-[#1D4ED8] hover:to-[#6D28D9] text-white rounded-full flex items-center justify-center shadow-xl shadow-indigo-900/40 border border-indigo-400/40 cursor-pointer focus:outline-none transition-transform hover:scale-105 active:scale-95"
        title="مساعد الدراسة الذكي AI"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="relative z-10"
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="relative w-full h-full flex items-center justify-center z-10"
            >
              <MessageSquare className="w-6 h-6 absolute" />
              <Sparkles className="w-4 h-4 absolute text-yellow-300 fill-yellow-300 -top-0.5 -right-0.5 animate-pulse" />
              
              {/* Neon AI Badge */}
              <span className="absolute -top-1.5 -left-1.5 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-md shadow-pink-500/20 border border-pink-400/30 scale-100 select-none">
                AI
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Chat Widget Portal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-chat-widget"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed bottom-6 right-[84px] left-4 sm:left-auto sm:right-[88px] z-[100] sm:w-[420px] h-[600px] max-h-[85vh] bg-[#0E1026] border border-[#232759]/70 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-right select-text font-sans"
            dir="rtl"
          >
            {/* Sliding Sidebar Drawer */}
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "tween", duration: 0.25 }}
                  className="absolute inset-0 z-30 bg-[#0E1026] shadow-2xl flex flex-col overflow-hidden"
                >
                  {/* Sidebar Header */}
                  <div className="p-4 bg-[#141635] border-b border-[#232759]/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-400" />
                      <h5 className="font-extrabold text-xs sm:text-sm text-gray-100">سجل المحادثات الأكاديمية</h5>
                    </div>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="p-1.5 rounded-lg hover:bg-slate-800/40 text-gray-400 hover:text-white transition-colors cursor-pointer"
                      title="إغلاق السجل"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sidebar Actions */}
                  <div className="p-3 bg-[#0a0b1c]">
                    <button
                      onClick={handleNewChat}
                      className="w-full p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-900/30 transition-all cursor-pointer flex items-center justify-center gap-2 border border-blue-400/20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>محادثة جديدة</span>
                    </button>
                  </div>

                  {/* Sidebar Session List */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#060718] custom-scrollbar">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        onClick={() => {
                          setCurrentSessionId(session.id);
                          setIsSidebarOpen(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setCurrentSessionId(session.id);
                            setIsSidebarOpen(false);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        className={`w-full p-3 rounded-xl border text-right transition-all flex items-center justify-between gap-2.5 cursor-pointer group focus:outline-none focus:ring-1 focus:ring-indigo-500/50 ${
                          session.id === currentSessionId
                            ? "bg-[#1C1E3F] border-[#4F46E5]/50 text-white"
                            : "bg-[#0E1026] border-[#22254B] text-gray-400 hover:bg-[#131533] hover:border-indigo-500/20 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${session.id === currentSessionId ? "text-indigo-400" : "text-gray-500"}`} />
                          <span className="text-xs font-medium truncate">{session.title}</span>
                        </div>
                        
                        {/* Delete Session Button */}
                        <button
                          onClick={(e) => handleDeleteChat(session.id, e)}
                          className="p-1 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 opacity-60 group-hover:opacity-100 transition-all cursor-pointer"
                          title="حذف هذه المحادثة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-3 bg-[#0a0b1c] border-t border-[#232759]/50 text-[10px] text-center text-gray-500">
                    تُحفظ جميع المحادثات تلقائياً في جهازك.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#171a40] via-[#101230] to-[#0E1026] border-b border-[#232759]/50 flex items-center justify-between shrink-0 relative z-10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-1.5 rounded-lg hover:bg-slate-800/40 text-indigo-400 hover:text-white transition-colors cursor-pointer"
                  title="سجل الحفظ والمحادثات"
                >
                  <Menu className="w-4 h-4" />
                </button>
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-inner">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[11px] sm:text-xs text-slate-100 flex items-center gap-1.5 leading-none">
                    المرشد الأكاديمي الذكي
                    <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                  </h4>
                  <p className="text-[9px] text-[#5b6194] font-sans mt-0.5">معتصم بنماذج الذكاء الاصطناعي 🇩🇿</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800/40 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Warning notices */}
            {errorNotice && (
              <div className="p-2.5 bg-red-600/10 border-b border-red-500/20 text-red-400 text-[10px] sm:text-xs flex items-center gap-1.5 leading-snug">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorNotice}</span>
              </div>
            )}

            {/* Message Area */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0b1c]/90 custom-scrollbar"
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"} gap-2 w-full animate-fadeIn`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-3 text-xs shadow-md ${
                    msg.role === "user" 
                      ? "bg-indigo-600 text-white rounded-tr-none border border-indigo-500/20" 
                      : "bg-[#181a38] text-slate-100 rounded-tl-none border border-[#2d316e]/40"
                  }`}>
                    {/* Render Image if exists */}
                    {msg.image && (
                      <div className="mb-2 max-h-40 rounded-xl overflow-hidden border border-white/10">
                        <img 
                          src={msg.image} 
                          alt="مرفق الطالب" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    {/* Render Text */}
                    <div className="space-y-1">
                      {renderFormattedText(msg.text)}
                    </div>
                    {/* Timestamp */}
                    <div className="text-[9px] text-[#5b6194] dark:text-gray-500 text-left mt-1.5">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Waiting Indicator */}
              {isLoading && (
                <div className="flex justify-end gap-2 w-full">
                  <div className="max-w-[85%] rounded-2xl p-3 bg-[#181a38] text-slate-100 rounded-tl-none border border-[#2d316e]/40 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                    <span className="text-[10px] text-gray-400 font-sans">المساعد يقرأ ويكتب لك الحل النموذجي الآن...</span>
                  </div>
                </div>
              )}

              {/* Suggestions for fresh chats */}
              {messages.length === 1 && (
                <div className="space-y-2 pt-4">
                  <p className="text-[10px] text-gray-450 font-bold flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    أسئلة شائعة يمكنك طرحها:
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(s)}
                        className="p-2.5 rounded-xl bg-[#141630] border border-[#252857]/60 hover:bg-[#1a1d3d] hover:border-indigo-500/40 text-gray-300 text-[10px] leading-relaxed text-right transition-all cursor-pointer shadow-sm flex items-center gap-2"
                      >
                        <span className="text-indigo-400">⚡</span>
                        <span>{s}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions and Inputs */}
            <div className="p-3 bg-[#0d0f26] border-t border-[#232759]/50 space-y-2">
              
              {/* Selected Image Thumbnail Preview */}
              {selectedImage && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-indigo-950/40 border border-indigo-900/60 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/15 relative bg-[#131533]">
                      <img 
                        src={selectedImage} 
                        alt="معاينة مرفق" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-indigo-300 block">الصورة جاهزة للتحليل</span>
                      <span className="text-[9px] text-[#555a8f]">سيتم إرسالها برفقة السؤال الخاص بك</span>
                    </div>
                  </div>
                  <button 
                    onClick={removeSelectedImage} 
                    className="p-1 rounded-lg bg-red-600/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                    title="حذف الملف المرفق"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Form Input Layout */}
              <div className="flex items-center gap-1.5">
                {/* Image Attach Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 rounded-xl bg-[#171a40] border border-[#292e70] hover:bg-[#1d2254] hover:text-indigo-400 text-gray-400 transition-colors shadow-inner flex items-center justify-center shrink-0 cursor-pointer"
                  title="إرفاق صورة التمرين"
                >
                  <Paperclip className="w-4 h-4 rotate-45" />
                </button>
                <input 
                  type="file"
                  id="ai-file-picker"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />

                {/* Text Field representation */}
                <input
                  type="text"
                  id="ai-chat-input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  onPaste={handlePaste}
                  placeholder="اسألني عن تمرين، درس، أو خطة مراجعة..."
                  className="flex-1 min-w-0 bg-[#070817] border border-[#232759]/80 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-indigo-500/80 transition-colors leading-relaxed font-sans"
                />

                {/* Send Button */}
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || (!inputText.trim() && !selectedImage)}
                  className={`p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                    (!inputText.trim() && !selectedImage) || isLoading
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50"
                      : "bg-[#2563EB] hover:bg-blue-600 text-white shadow-lg shadow-blue-900/20 active:scale-95"
                  }`}
                  title="إرسال"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="text-[9px] text-center text-[#40456e] font-sans">
                قد تقدم النماذج الذكية حلولاً تحتاج للمراجعة والتدقيق والجهد الفردي.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
