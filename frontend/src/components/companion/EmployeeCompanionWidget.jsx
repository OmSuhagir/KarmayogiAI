import React, { useState, useEffect, useRef } from 'react';
import {
  FiSend,
  FiX,
  FiChevronDown,
  FiMaximize2,
  FiMinimize2,
  FiRotateCcw,
  FiTarget,
  FiBookOpen,
  FiHelpCircle,
  FiTrendingUp,
  FiCheckCircle,
  FiAlertCircle,
  FiAward
} from 'react-icons/fi';
import { RiSparklingFill, RiRobot2Line, RiGovernmentLine } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import { sendChatMessage, getCompanionContext } from '../../services/chatService';

// Quick Starter Suggestions
const STARTER_PROMPTS = [
  {
    icon: FiTarget,
    label: 'What are my top skill gaps?',
    query: 'What are my highest priority skill gaps right now and how should I address them?',
  },
  {
    icon: FiBookOpen,
    label: 'Recommend a learning plan',
    query: 'Suggest a focused micro-learning schedule for this week based on my recommended courses.',
  },
  {
    icon: FiHelpCircle,
    label: 'Quiz me on my domain',
    query: 'Give me a practice multiple-choice question relevant to my official statistics and analysis competencies.',
  },
  {
    icon: FiTrendingUp,
    label: 'How can I get promoted?',
    query: 'What competency levels and milestones do I need to advance to Senior Statistical Officer?',
  },
];

/**
 * Lightweight formatting renderer for Markdown AI responses:
 * Handles bolding (**text**), headings (###), dividers (---), tables (|...|), lists (- or 1.), and paragraphs.
 */
function FormattedMessage({ content }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let currentList = [];
  let listType = null; // 'ul' | 'ol'
  let currentTable = [];

  const flushList = () => {
    if (currentList.length > 0) {
      if (listType === 'ol') {
        elements.push(
          <ol key={`ol-${elements.length}`} className="list-decimal list-outside pl-5 space-y-1.5 my-2 text-xs sm:text-sm text-slate-700">
            {currentList.map((item, i) => (
              <li key={i}>{formatInline(item)}</li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc list-outside pl-5 space-y-1.5 my-2 text-xs sm:text-sm text-slate-700">
            {currentList.map((item, i) => (
              <li key={i}>{formatInline(item)}</li>
            ))}
          </ul>
        );
      }
      currentList = [];
      listType = null;
    }
  };

  const flushTable = () => {
    if (currentTable.length > 0) {
      // Filter out divider lines like |:---|:---:|
      const rows = currentTable.filter((row) => !row.every((cell) => /^[:\s-]+$/.test(cell)));
      if (rows.length > 0) {
        const header = rows[0];
        const bodyRows = rows.slice(1);
        elements.push(
          <div key={`tbl-${elements.length}`} className="my-2.5 overflow-x-auto rounded-xl border border-slate-200/80 shadow-xs bg-white/60">
            <table className="min-w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200/80 text-slate-900 font-bold">
                  {header.map((cell, cIdx) => (
                    <th key={cIdx} className="px-3 py-2 text-[11px] font-bold">
                      {formatInline(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-blue-50/40 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-1.5 text-[11px] text-slate-700">
                        {formatInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      currentTable = [];
    }
  };

  const formatInline = (text) => {
    // Replace **bold** with <strong>
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      flushTable();
      return;
    }

    // Markdown Table row: | col1 | col2 |
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushList();
      const cells = trimmed
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());
      currentTable.push(cells);
      return;
    } else {
      flushTable();
    }

    // Horizontal Rule
    if (trimmed === '---' || trimmed === '***') {
      flushList();
      elements.push(<hr key={`hr-${idx}`} className="my-2.5 border-slate-200/70" />);
      return;
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h4 key={`h4-${idx}`} className="text-xs sm:text-sm font-bold text-slate-900 mt-2 mb-1 flex items-center gap-1.5">
          {formatInline(trimmed.slice(4))}
        </h4>
      );
      return;
    }
    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${idx}`} className="text-sm font-extrabold text-slate-900 mt-2.5 mb-1.5">
          {formatInline(trimmed.slice(3))}
        </h3>
      );
      return;
    }

    // Numbered list item
    const olMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (olMatch) {
      if (listType && listType !== 'ol') flushList();
      listType = 'ol';
      currentList.push(olMatch[2]);
      return;
    }

    // Bullet list item
    const ulMatch = trimmed.match(/^[-*•]\s+(.+)$/);
    if (ulMatch) {
      if (listType && listType !== 'ul') flushList();
      listType = 'ul';
      currentList.push(ulMatch[1]);
      return;
    }

    // Normal paragraph text
    flushList();
    elements.push(
      <p key={`p-${idx}`} className="text-xs sm:text-sm leading-relaxed text-slate-700 my-1">
        {formatInline(trimmed)}
      </p>
    );
  });

  flushList();
  flushTable();

  return <div className="space-y-0.5">{elements}</div>;
}

export default function EmployeeCompanionWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [contextData, setContextData] = useState(null);
  const [hasNewNotification, setHasNewNotification] = useState(true);

  // Initialize messages with welcome greeting
  const [messages, setMessages] = useState(() => {
    const firstName = user?.name ? user.name.split(' ')[0] : 'Officer';
    return [
      {
        id: 'welcome-1',
        sender: 'bot',
        text: `Namaste **${firstName}**! 🙏 I am **Karmayogi Sathi**, your personal capacity-building and career companion.\n\nI am synced with your active role as **${user?.position?.title || 'Statistical Officer'}** in **${user?.department?.shortName || user?.department?.name || 'MoSPI'}**. How can I assist your competency journey today?`,
        timestamp: new Date(),
        suggestions: [
          'What are my top skill gaps?',
          'Recommend a learning plan',
          'Quiz me on my domain',
          'How can I get promoted?',
        ],
      },
    ];
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasNewNotification(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  // Load context summary for badges
  useEffect(() => {
    if (user?._id) {
      getCompanionContext(user._id)
        .then((res) => {
          const ctx = res?.context || res?.data?.context || res?.data;
          if (ctx) {
            setContextData(ctx);
          }
        })
        .catch(() => {
          // Non-blocking
        });
    }
  }, [user?._id]);

  const handleSendMessage = async (textToSend) => {
    const content = (textToSend || inputMessage).trim();
    if (!content || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: content,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage('');
    setLoading(true);

    try {
      // Build history for multi-turn context
      const historyPayload = newMessages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await sendChatMessage({
        userId: user?._id,
        message: content,
        history: historyPayload,
      });

      const replyText = res?.reply || res?.data?.reply;
      const suggestions = res?.suggestions || res?.data?.suggestions || [];

      if (replyText) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: replyText,
            timestamp: new Date(),
            suggestions,
          },
        ]);
      } else {
        throw new Error(res?.error || res?.message || 'Failed to get response');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `I apologize, I encountered a temporary connection issue. However, based on your role as **${user?.position?.title || 'Statistical Officer'}**, you can review your open competencies in the **Skill Gaps** tab or take active assessments to keep learning!`,
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    const firstName = user?.name ? user.name.split(' ')[0] : 'Officer';
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: `Chat reset! Namaste **${firstName}**! How can I guide your competency development right now?`,
        timestamp: new Date(),
        suggestions: [
          'What are my top skill gaps?',
          'Recommend a learning plan',
          'Quiz me on my domain',
        ],
      },
    ]);
  };

  return (
    <>
      {/* ============================================================ */}
      {/* FLOATING TRIGGER BUTTON (Always visible at bottom-right)       */}
      {/* ============================================================ */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          {/* Notification bubble teaser */}
          {hasNewNotification && (
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-md border border-white/80 shadow-glass-md text-xs font-semibold text-slate-800 animate-bounce">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span>Need learning guidance? Ask Sathi!</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-400/40"
            aria-label="Open Karmayogi Sathi AI Companion"
          >
            {/* Ambient Pulsing Aura */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-40 group-hover:opacity-75 blur-md transition duration-300 -z-10" />

            <div className="relative w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-xs">
              <RiSparklingFill className="text-lg animate-pulse" />
            </div>

            <div className="text-left leading-tight hidden xs:block">
              <span className="text-xs font-black tracking-wide block uppercase text-blue-100">AI Mentor</span>
              <span className="text-sm font-bold block text-white">Karmayogi Sathi</span>
            </div>

            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* EXPANDABLE CHAT DIALOG WINDOW                                 */}
      {/* ============================================================ */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col transition-all duration-300 ease-out rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-2xl overflow-hidden ${
            isExpanded
              ? 'w-[calc(100vw-32px)] sm:w-[680px] h-[calc(100vh-32px)] sm:h-[760px] max-h-[92vh]'
              : 'w-[calc(100vw-32px)] sm:w-[440px] h-[600px] max-h-[85vh]'
          }`}
          style={{
            boxShadow: '0 25px 60px -15px rgba(37, 99, 235, 0.25), 0 0 1px 1px rgba(255, 255, 255, 0.8)',
          }}
        >
          {/* HEADER */}
          <div className="relative px-4 sm:px-5 py-3.5 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-inner flex-shrink-0">
                <RiSparklingFill className="text-xl text-amber-300" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-indigo-900 rounded-full" />
              </div>
              <div className="leading-tight min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold tracking-tight text-white truncate">Karmayogi Sathi</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-blue-500/40 text-blue-100 border border-blue-300/30">
                    AI Copilot
                  </span>
                </div>
                <p className="text-[11px] text-blue-100/90 truncate font-medium">
                  {user?.position?.title || 'Officer'} • {user?.department?.shortName || 'MoSPI'}
                </p>
              </div>
            </div>

            {/* Header Control Buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-2 rounded-xl text-blue-100 hover:text-white hover:bg-white/15 transition-colors"
                title="Reset conversation"
              >
                <FiRotateCcw className="text-sm" />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:block p-2 rounded-xl text-blue-100 hover:text-white hover:bg-white/15 transition-colors"
                title={isExpanded ? 'Collapse size' : 'Expand window'}
              >
                {isExpanded ? <FiMinimize2 className="text-sm" /> : <FiMaximize2 className="text-sm" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-blue-100 hover:text-white hover:bg-white/15 transition-colors"
                title="Minimize chat"
              >
                <FiChevronDown className="text-lg" />
              </button>
            </div>
          </div>

          {/* REAL-TIME CONTEXT TRANSPARENCY BAR */}
          <div className="px-4 py-2 bg-blue-50/70 border-b border-blue-100/60 flex items-center gap-2 overflow-x-auto text-[11px] text-slate-600 font-medium scrollbar-none">
            <span className="text-blue-700 font-bold flex items-center gap-1 flex-shrink-0">
              <RiGovernmentLine /> Synced Context:
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-white/90 border border-blue-200/60 text-slate-700 flex items-center gap-1 flex-shrink-0">
              <FiTarget className="text-amber-500" />
              {contextData?.skillGaps ? `${contextData.skillGaps.length} Skill Gaps` : '3 Priority Gaps'}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-white/90 border border-blue-200/60 text-slate-700 flex items-center gap-1 flex-shrink-0">
              <FiBookOpen className="text-blue-500" />
              {contextData?.topRecommendations ? `${contextData.topRecommendations.length} Recommended Courses` : 'iGOT Resources'}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-white/90 border border-blue-200/60 text-slate-700 flex items-center gap-1 flex-shrink-0">
              <FiAward className="text-emerald-600" />
              Level 1–5 FRAC
            </span>
          </div>

          {/* CHAT MESSAGES CONTAINER */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-slate-800 scroll-smooth">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="flex items-end gap-2 max-w-[88%]">
                    {/* Bot Avatar Icon */}
                    {!isUser && (
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-xs shadow-xs flex-shrink-0 mb-1">
                        <RiSparklingFill className="text-amber-300 text-xs" />
                      </div>
                    )}

                    <div
                      className={`rounded-2xl px-4 py-3 shadow-xs ${
                        isUser
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-xs shadow-blue-500/20'
                          : 'bg-white/90 backdrop-blur-md border border-white/80 text-slate-800 rounded-bl-xs shadow-glass-sm'
                      }`}
                    >
                      {isUser ? (
                        <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                          {msg.text}
                        </p>
                      ) : (
                        <FormattedMessage content={msg.text} />
                      )}
                    </div>
                  </div>

                  {/* Suggestion Chips from Sathi */}
                  {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="pl-9 flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestions.map((suggestion, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          disabled={loading}
                          onClick={() => handleSendMessage(suggestion)}
                          className="text-[11px] font-medium px-2.5 py-1 rounded-xl bg-blue-50/80 hover:bg-blue-100/90 text-blue-800 border border-blue-200/60 transition-all hover:scale-[1.02] active:scale-[0.98] text-left"
                        >
                          💬 {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Timestamp */}
                  <span className={`text-[10px] text-slate-400 px-2 ${isUser ? 'pr-1' : 'pl-9'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}

            {/* Thinking / Typing Animation */}
            {loading && (
              <div className="flex items-start gap-2 max-w-[88%]">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-xs shadow-xs flex-shrink-0">
                  <RiSparklingFill className="text-amber-300 text-xs animate-spin" />
                </div>
                <div className="rounded-2xl rounded-bl-xs px-4 py-3 bg-white/90 backdrop-blur-md border border-white/80 shadow-glass-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-blue-700">Sathi is thinking</span>
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Cross-referencing your competency profile & guidelines...</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* QUICK PROMPT STARTER PILLS (Shown if fewer than 3 user messages) */}
          {messages.filter((m) => m.sender === 'user').length < 2 && (
            <div className="px-4 py-2 border-t border-slate-100 bg-white/50 backdrop-blur-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Suggested Prompts
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {STARTER_PROMPTS.map((starter, idx) => {
                  const Icon = starter.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={loading}
                      onClick={() => handleSendMessage(starter.query)}
                      className="flex items-center gap-2 p-2 rounded-xl bg-white/80 hover:bg-blue-50/80 border border-slate-200/60 hover:border-blue-300/60 text-left transition-all group"
                    >
                      <div className="w-5 h-5 rounded-lg bg-blue-100 group-hover:bg-blue-600 group-hover:text-white text-blue-700 flex items-center justify-center flex-shrink-0 transition-colors">
                        <Icon className="text-xs" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700 group-hover:text-blue-900 line-clamp-1">
                        {starter.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* INPUT BAR */}
          <div className="p-3 sm:p-4 bg-white/90 backdrop-blur-md border-t border-slate-200/60">
            <div className="flex items-center gap-2 rounded-2xl bg-slate-50 border border-slate-200/80 p-1.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-400/20 transition-all shadow-inner">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Sathi anything about your skills, courses, or role..."
                rows={1}
                className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none max-h-24"
              />

              <button
                type="button"
                disabled={!inputMessage.trim() || loading}
                onClick={() => handleSendMessage()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all flex-shrink-0"
                aria-label="Send message"
              >
                <FiSend className="text-sm" />
              </button>
            </div>
            <div className="flex items-center justify-between px-1 mt-1.5 text-[10px] text-slate-400">
              <span>Press <b>Enter</b> to send • <b>Shift+Enter</b> for new line</span>
              <span>Grounded in Karmayogi Competency Profile</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
