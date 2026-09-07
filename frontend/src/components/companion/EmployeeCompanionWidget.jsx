import React, { useState, useEffect, useRef } from 'react';
import {
  FiSend,
  FiX,
  FiChevronDown,
  FiRotateCcw,
  FiTarget,
  FiBookOpen,
  FiHelpCircle,
  FiTrendingUp,
  FiAward,
} from 'react-icons/fi';
import { RiSparklingFill, RiGovernmentLine } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import { sendChatMessage, getCompanionContext } from '../../services/chatService';

// Quick Starter Suggestions
const STARTER_PROMPTS = [
  {
    icon: FiTarget,
    label: 'Highest priority skill gaps',
    query: 'What are my highest priority skill gaps right now and how should I address them?',
  },
  {
    icon: FiBookOpen,
    label: 'Recommended learning plan',
    query: 'Suggest a focused micro-learning schedule for this week based on my recommended courses.',
  },
  {
    icon: FiHelpCircle,
    label: 'Practice domain question',
    query: 'Give me a practice multiple-choice question relevant to my official statistics and analysis competencies.',
  },
  {
    icon: FiTrendingUp,
    label: 'Advancement requirements',
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
  let listType = null;
  let currentTable = [];

  const flushList = () => {
    if (currentList.length > 0) {
      if (listType === 'ol') {
        elements.push(
          <ol key={`ol-${elements.length}`} className="list-decimal list-outside pl-4 space-y-1 my-2 text-xs text-[#171717]">
            {currentList.map((item, i) => (
              <li key={i}>{formatInline(item)}</li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc list-outside pl-4 space-y-1 my-2 text-xs text-[#171717]">
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
      const rows = currentTable.filter((row) => !row.every((cell) => /^[:\s-]+$/.test(cell)));
      if (rows.length > 0) {
        const header = rows[0];
        const bodyRows = rows.slice(1);
        elements.push(
          <div key={`tbl-${elements.length}`} className="my-2.5 overflow-x-auto rounded-lg border border-[#DDD9CF] bg-[#FFFDF8]">
            <table className="min-w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F6F0] border-b border-[#DDD9CF] text-[#111111] font-semibold">
                  {header.map((cell, cIdx) => (
                    <th key={cIdx} className="px-3 py-1.5 text-[11px] font-semibold">
                      {formatInline(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD9CF]">
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-[#F8F6F0]">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-1.5 text-[11px] text-[#171717]">
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
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-[#111111]">
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

    if (trimmed === '---' || trimmed === '***') {
      flushList();
      elements.push(<hr key={`hr-${idx}`} className="my-2 border-[#DDD9CF]" />);
      return;
    }

    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h4 key={`h4-${idx}`} className="text-xs font-bold text-[#111111] mt-2 mb-1">
          {formatInline(trimmed.slice(4))}
        </h4>
      );
      return;
    }
    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${idx}`} className="text-sm font-bold text-[#111111] mt-2 mb-1">
          {formatInline(trimmed.slice(3))}
        </h3>
      );
      return;
    }

    const olMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (olMatch) {
      if (listType && listType !== 'ol') flushList();
      listType = 'ol';
      currentList.push(olMatch[2]);
      return;
    }

    const ulMatch = trimmed.match(/^[-*•]\s+(.+)$/);
    if (ulMatch) {
      if (listType && listType !== 'ul') flushList();
      listType = 'ul';
      currentList.push(ulMatch[1]);
      return;
    }

    flushList();
    elements.push(
      <p key={`p-${idx}`} className="text-xs leading-relaxed text-[#171717] my-1">
        {formatInline(trimmed)}
      </p>
    );
  });

  flushList();
  flushTable();

  return <div className="space-y-0.5">{elements}</div>;
}

export default function EmployeeCompanionWidget({ isOpen: controlledIsOpen, setIsOpen: controlledSetIsOpen }) {
  const { user } = useAuth();
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = controlledSetIsOpen || setInternalIsOpen;

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [contextData, setContextData] = useState(null);
  const [hasNewNotification, setHasNewNotification] = useState(true);

  const [messages, setMessages] = useState(() => {
    const firstName = user?.name ? user.name.split(' ')[0] : 'Officer';
    return [
      {
        id: 'welcome-1',
        sender: 'bot',
        text: `Namaste **${firstName}**! I am **Karmayogi Sathi**, your capacity-building assistant.\n\nI am synced with your role as **${user?.position?.title || 'Statistical Officer'}** in **${user?.department?.shortName || 'MoSPI'}**. How can I assist your competency journey today?`,
        timestamp: new Date(),
        suggestions: [
          'What are my top skill gaps?',
          'Recommend a learning plan',
          'Practice domain question',
        ],
      },
    ];
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  useEffect(() => {
    if (user?._id) {
      getCompanionContext(user._id)
        .then((res) => {
          const ctx = res?.context || res?.data?.context || res?.data;
          if (ctx) setContextData(ctx);
        })
        .catch(() => {});
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
          text: `I apologize, I encountered a temporary connection issue. You can review your open competencies directly in the **Skill Gaps** tab or take active assessments to keep learning!`,
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
        text: `Chat reset. Namaste **${firstName}**! How can I guide your competency development right now?`,
        timestamp: new Date(),
        suggestions: [
          'What are my top skill gaps?',
          'Recommend a learning plan',
        ],
      },
    ]);
  };

  return (
    <>
      {/* FLOATING TRIGGER BUTTON (Bottom right) with Floating & Moving Animation */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 animate-float">
          {/* Notification bubble teaser that bounces and moves */}
          {hasNewNotification && (
            <div
              onClick={() => {
                setIsOpen(true);
                setHasNewNotification(false);
              }}
              className="cursor-pointer hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] shadow-xl text-xs font-semibold text-[#111111] animate-bounce hover:scale-105 transition-transform"
              title="Need guidance? Click to chat with Sathi"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3348A8] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3348A8]" />
              </span>
              <span className="whitespace-nowrap">Need learning guidance? Ask Sathi!</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setHasNewNotification(false);
            }}
            className="group relative flex items-center gap-3 px-4 sm:px-5 py-3 rounded-full bg-[#111111] text-[#FFFDF8] border border-[#111111] shadow-2xl hover:bg-[#222222] hover:scale-105 active:scale-95 transition-all duration-300 text-xs font-semibold"
            aria-label="Open Karmayogi Sathi"
          >
            {/* Ambient Pulsing Glow Aura */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#3348A8] to-[#111111] opacity-40 group-hover:opacity-80 blur-xs transition duration-300 -z-10 animate-pulse" />

            <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center text-amber-300 backdrop-blur-xs flex-shrink-0">
              <RiSparklingFill className="text-base sm:text-lg animate-pulse group-hover:rotate-12 transition-transform duration-300" />
            </div>

            <div className="text-left leading-tight hidden xs:block">
              <span className="text-[9px] font-bold tracking-wider block uppercase text-white/60">AI Copilot</span>
              <span className="text-xs sm:text-sm font-bold block text-white">Sathi AI</span>
            </div>

            <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </button>
        </div>
      )}

      {/* CHAT DIALOG WINDOW / DRAWER */}
      {isOpen && (
        <div
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col w-[calc(100vw-32px)] sm:w-[420px] h-[560px] max-h-[85vh] rounded-2xl bg-[#FFFDF8] border border-[#DDD9CF] shadow-xl overflow-hidden"
        >
          {/* HEADER */}
          <div className="px-4 py-3 bg-[#111111] text-[#FFFDF8] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#222222] border border-white/20 flex items-center justify-center text-xs flex-shrink-0">
                <RiSparklingFill className="text-amber-300 text-xs animate-pulse" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-[#FFFDF8]">Karmayogi Sathi</h3>
                  <span className="text-[9px] font-semibold uppercase px-1 py-0.5 rounded bg-white/10 text-white/80">
                    Copilot
                  </span>
                </div>
                <p className="text-[10px] text-white/60">
                  {user?.position?.title || 'Officer'} &middot; {user?.department?.shortName || 'MoSPI'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                title="Reset conversation"
              >
                <FiRotateCcw className="text-xs" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                title="Close"
              >
                <FiX className="text-sm" />
              </button>
            </div>
          </div>

          {/* CONTEXT STRIP */}
          <div className="px-3.5 py-1.5 bg-[#F8F6F0] border-b border-[#DDD9CF] flex items-center gap-2 text-[10px] text-[#62615D] overflow-x-auto">
            <span className="font-semibold text-[#111111] flex items-center gap-1 flex-shrink-0">
              <RiGovernmentLine /> Synced Context:
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#FFFDF8] border border-[#DDD9CF] flex-shrink-0">
              {contextData?.skillGaps ? `${contextData.skillGaps.length} Gaps` : '3 Gaps'}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#FFFDF8] border border-[#DDD9CF] flex-shrink-0">
              FRAC L1–L5
            </span>
          </div>

          {/* MESSAGES LIST */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#FFFDF8] text-[#171717]">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div
                    className={`max-w-[88%] rounded-xl px-3 py-2 text-xs ${
                      isUser
                        ? 'bg-[#111111] text-[#FFFDF8]'
                        : 'bg-[#F8F6F0] border border-[#DDD9CF] text-[#171717]'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    ) : (
                      <FormattedMessage content={msg.text} />
                    )}
                  </div>

                  {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {msg.suggestions.map((suggestion, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          disabled={loading}
                          onClick={() => handleSendMessage(suggestion)}
                          className="text-[10px] px-2 py-1 rounded bg-[#FFFDF8] hover:bg-[#F8F6F0] text-[#111111] border border-[#DDD9CF] transition-colors text-left"
                        >
                          &rsaquo; {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[9px] text-[#8A8882] px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] text-xs text-[#62615D]">
                <RiSparklingFill className="text-xs text-[#3348A8] animate-spin" />
                <span>Consulting competency frameworks...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* QUICK PROMPT STARTER PILLS */}
          {messages.filter((m) => m.sender === 'user').length < 2 && (
            <div className="px-3 py-2 border-t border-[#DDD9CF] bg-[#F8F6F0]">
              <div className="grid grid-cols-2 gap-1.5">
                {STARTER_PROMPTS.map((starter, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={loading}
                    onClick={() => handleSendMessage(starter.query)}
                    className="p-1.5 rounded bg-[#FFFDF8] hover:bg-[#EAE6DB] border border-[#DDD9CF] text-left transition-colors flex items-center gap-1.5"
                  >
                    <starter.icon className="text-xs text-[#62615D] flex-shrink-0" />
                    <span className="text-[10px] font-medium text-[#111111] line-clamp-1">
                      {starter.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* INPUT BAR */}
          <div className="p-3 bg-[#FFFDF8] border-t border-[#DDD9CF]">
            <div className="flex items-center gap-2 rounded-lg bg-[#F8F6F0] border border-[#DDD9CF] p-1 focus-within:border-[#111111] transition-colors">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Sathi about skills, courses, or roles..."
                className="flex-1 bg-transparent px-2.5 py-1 text-xs text-[#171717] placeholder:text-[#8A8882] focus:outline-none"
              />

              <button
                type="button"
                disabled={!inputMessage.trim() || loading}
                onClick={() => handleSendMessage()}
                className="p-1.5 rounded bg-[#111111] text-[#FFFDF8] hover:bg-[#222222] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                aria-label="Send message"
              >
                <FiSend className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
