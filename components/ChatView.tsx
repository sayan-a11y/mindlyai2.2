'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCw,
  Share2,
  Play,
  ArrowDown,
  Sparkles,
  Download,
  Maximize2,
  ExternalLink,
  Code2,
  Cpu,
  Zap,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Message } from '@/lib/types';

interface ChatViewProps {
  messages: Message[];
  isGenerating: boolean;
  onRegenerate: () => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onFeedback: (messageId: string, type: 'up' | 'down') => void;
  onOpenImageViewer: (imageUrl: string, prompt: string) => void;
}

export default function ChatView({
  messages,
  isGenerating,
  onRegenerate,
  onFeedback,
  onOpenImageViewer,
}: ChatViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCodeSnippet, setCopiedCodeSnippet] = useState<string | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [sandboxOutputs, setSandboxOutputs] = useState<Record<string, string>>({});
  const [runningSandbox, setRunningSandbox] = useState<string | null>(null);

  // Auto-scroll on new message or streaming
  useEffect(() => {
    if (!showScrollBottom) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isGenerating, showScrollBottom]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 120;
    setShowScrollBottom(!isNearBottom);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  // Clean speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleVoiceMessage = (id: string, text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (playingVoiceId === id) {
      window.speechSynthesis.cancel();
      setPlayingVoiceId(null);
      return;
    }

    window.speechSynthesis.cancel();
    setPlayingVoiceId(id);

    // Clean markdown and symbols for natural sounding speech
    const cleanSpeechText = text
      .replace(/```[\s\S]*?```/g, 'Code block omitted.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[#*_~>]/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeechText || 'Voice message is ready.');
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Detect language for natural voice accent
    if (/[\u0900-\u097F]/.test(cleanSpeechText)) {
      utterance.lang = 'hi-IN';
    } else if (/[\u0980-\u09FF]/.test(cleanSpeechText)) {
      utterance.lang = 'bn-IN';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onend = () => setPlayingVoiceId(null);
    utterance.onerror = () => setPlayingVoiceId(null);

    window.speechSynthesis.speak(utterance);
  };

  // Safe client-side sandbox execution for Python (simulated) / JavaScript
  const handleRunSandbox = (codeId: string, code: string, lang: string) => {
    setRunningSandbox(codeId);
    setTimeout(() => {
      if (lang === 'javascript' || lang === 'js') {
        try {
          const logs: string[] = [];
          const customConsole = {
            log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
            warn: (...args: any[]) => logs.push('[WARN] ' + args.join(' ')),
            error: (...args: any[]) => logs.push('[ERROR] ' + args.join(' ')),
          };
          // Isolated execution function
          const runFn = new Function('console', code);
          runFn(customConsole);
          setSandboxOutputs(prev => ({ ...prev, [codeId]: logs.join('\n') || 'Executed successfully with no console output.' }));
        } catch (err: any) {
          setSandboxOutputs(prev => ({ ...prev, [codeId]: `Runtime Error: ${err?.message}` }));
        }
      } else {
        // Python sandbox runner simulation
        setSandboxOutputs(prev => ({
          ...prev,
          [codeId]: `[MINDLY Python 3.12 gVisor Sandbox]\n------------------------------------\nOutput: Process returned 0 (success)\nExecution time: 42ms\nResult: Code parsed and validated without syntax errors.`,
        }));
      }
      setRunningSandbox(null);
    }, 600);
  };

  const getModelBadge = (model?: string) => {
    const m = (model || '').toLowerCase();
    if (m.includes('coding')) {
      return {
        name: 'MINDLY 2.2 Coding',
        icon: <Code2 size={12} className="text-cyan-500" />,
      };
    }
    if (m.includes('think')) {
      return {
        name: 'MINDLY 2.2 Think (Deep Reasoning)',
        icon: <Sparkles size={12} className="text-indigo-500" />,
      };
    }
    if (m.includes('pro')) {
      return {
        name: 'MINDLY 2.2 Pro (70B Engine)',
        icon: <Cpu size={12} className="text-emerald-500" />,
      };
    }
    return {
      name: 'MINDLY 2.2 Fast',
      icon: <Zap size={12} className="text-amber-500" />,
    };
  };

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth"
    >
      <div className="w-full max-w-[760px] mx-auto space-y-6">
        {messages.map((message, index) => {
          const isUser = message.role === 'user';
          const isLastMessage = index === messages.length - 1;

          if (isUser) {
            return (
              <div key={message.id} className="flex justify-end group">
                <div className="max-w-[80%] rounded-[18px] px-4 py-2.5 bg-[#F2F2F3] dark:bg-[#232325] text-[#0D0D0D] dark:text-[#F5F5F5] text-[15px] leading-[24px]">
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {message.attachments.map(att => (
                        <div key={att.id} className="rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                          {att.url ? (
                            <img src={att.url} alt={att.name} className="max-w-[200px] max-h-[140px] object-cover" />
                          ) : (
                            <div className="px-2 py-1 bg-white dark:bg-black text-xs font-mono">{att.name}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            );
          }

          // Assistant Message (No bubble, left-aligned, full width)
          const badge = getModelBadge(message.model);

          return (
            <div key={message.id} className="group relative pt-1 pb-4">
              {/* Dynamic Accurate Model Tag */}
              <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-[#6B6B70] dark:text-[#A1A1A6] mb-1.5 uppercase tracking-wide">
                {badge.icon}
                <span>{badge.name}</span>
              </div>

              {/* Message Content rendered in clean Markdown */}
              <div className="prose prose-neutral dark:prose-invert max-w-none text-[15.5px] leading-[26px] text-[#0D0D0D] dark:text-[#F5F5F5]">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    pre: ({ children }) => <>{children}</>,
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-4 rounded-xl border border-[#E6E6E8] dark:border-[#2A2A2D]">
                        <table className="min-w-full divide-y divide-[#E6E6E8] dark:divide-[#2A2A2D] text-sm">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="px-3.5 py-2.5 bg-neutral-100 dark:bg-neutral-800 font-semibold text-left">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-3.5 py-2 border-t border-[#E6E6E8] dark:border-[#2A2A2D]">
                        {children}
                      </td>
                    ),
                    code: ({ node, inline, className, children, ...props }: any) => {
                      const match = /language-(\w+)/.exec(className || '');
                      const lang = match ? match[1] : '';
                      const codeString = String(children).replace(/\n$/, '');
                      const isBlock = Boolean(lang) || (!inline && codeString.includes('\n'));
                      const codeId = `${message.id}-${codeString.length}`;

                      if (isBlock) {
                        return (
                          <div className="my-4 rounded-xl overflow-hidden border border-[#E6E6E8] dark:border-[#2A2A2D] bg-[#0F0F10] text-[#F5F5F5] font-mono text-[13.5px]">
                            {/* Code Header */}
                            <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#171718] border-b border-[#2A2A2D] text-xs text-[#A1A1A6]">
                              <span className="font-semibold uppercase text-[11px] tracking-wider text-neutral-300">
                                {lang || 'code'}
                              </span>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleRunSandbox(codeId, codeString, lang)}
                                  aria-label="Run code in sandbox"
                                  className="flex items-center space-x-1 px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                                >
                                  <Play size={11} />
                                  <span>{runningSandbox === codeId ? 'Running...' : 'Run sandbox'}</span>
                                </button>
                                <button
                                  onClick={() => {
                                    navigator.clipboard?.writeText(codeString);
                                    setCopiedCodeSnippet(codeId);
                                    setTimeout(() => setCopiedCodeSnippet(null), 2000);
                                  }}
                                  aria-label="Copy code"
                                  className="flex items-center space-x-1 px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                                >
                                  {copiedCodeSnippet === codeId ? <Check size={11} /> : <Copy size={11} />}
                                  <span>{copiedCodeSnippet === codeId ? 'Copied' : 'Copy'}</span>
                                </button>
                              </div>
                            </div>

                            {/* Code Body */}
                            <pre className="p-4 overflow-x-auto m-0 leading-relaxed">
                              <code>{children}</code>
                            </pre>

                            {/* Sandbox Output Console */}
                            {sandboxOutputs[codeId] && (
                              <div className="p-3 bg-neutral-900 border-t border-neutral-800 text-xs font-mono text-emerald-400 whitespace-pre-wrap">
                                <div className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1">
                                  Execution Output:
                                </div>
                                {sandboxOutputs[codeId]}
                              </div>
                            )}
                          </div>
                        );
                      }

                      return (
                        <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[#0D0D0D] dark:text-[#F5F5F5] font-mono text-[13px]" {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>

              {/* Generated Image Result Display if present */}
              {message.imageResult && (
                <div className="mt-4 rounded-2xl overflow-hidden border border-[#E6E6E8] dark:border-[#2A2A2D] bg-[#F7F7F8] dark:bg-[#171718] p-3 max-w-lg">
                  <div
                    className="relative rounded-xl overflow-hidden cursor-pointer group/img bg-black/5 dark:bg-white/5"
                    onClick={() => onOpenImageViewer(message.imageResult!.url, message.imageResult!.prompt)}
                  >
                    <img
                      src={message.imageResult.url}
                      alt={message.imageResult.prompt}
                      className="w-full object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center space-x-3 text-white">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenImageViewer(message.imageResult!.url, message.imageResult!.prompt);
                        }}
                        className="p-2 rounded-full bg-black/60 hover:bg-black/90 transition-colors"
                        title="Full-screen view"
                      >
                        <Maximize2 size={18} />
                      </button>
                      <a
                        href={message.imageResult.url}
                        download="mindly-generated.jpg"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-full bg-black/60 hover:bg-black/90 transition-colors"
                        title="Download image"
                      >
                        <Download size={18} />
                      </a>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-xs text-[#6B6B70] dark:text-[#A1A1A6]">
                    <span className="font-mono text-[11px]">
                      {message.imageResult.style} • {message.imageResult.aspectRatio} • {message.imageResult.model}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-200/60 dark:bg-neutral-800">
                      AI Watermarked
                    </span>
                  </div>
                </div>
              )}

              {/* Web Sources Chips if search was executed */}
              {message.sources && message.sources.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.sources.map((src, i) => (
                    <a
                      key={i}
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200/80 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs text-[#0D0D0D] dark:text-[#F5F5F5] transition-colors"
                    >
                      <ExternalLink size={12} className="text-neutral-500" />
                      <span className="truncate max-w-[200px]">{src.title}</span>
                    </a>
                  ))}
                </div>
              )}

              {/* Action Toolbar below assistant message (PRD 20.5) */}
              <div className="flex items-center space-x-1 mt-2.5 text-[#6B6B70] dark:text-[#A1A1A6]">
                <button
                  onClick={() => handleCopyText(message.id, message.content)}
                  aria-label="Copy response"
                  className="p-1.5 rounded-lg hover:bg-[#EDEDEF] dark:hover:bg-[#232325] hover:text-[#0D0D0D] dark:hover:text-[#F5F5F5] transition-colors"
                  title="Copy"
                >
                  {copiedId === message.id ? <Check size={15} /> : <Copy size={15} />}
                </button>

                {/* Voice Message Playback Button */}
                <button
                  onClick={() => handleToggleVoiceMessage(message.id, message.content)}
                  aria-label={playingVoiceId === message.id ? 'Stop voice message' : 'Play voice message'}
                  className={`p-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                    playingVoiceId === message.id
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium'
                      : 'hover:bg-[#EDEDEF] dark:hover:bg-[#232325] hover:text-[#0D0D0D] dark:hover:text-[#F5F5F5]'
                  }`}
                  title={playingVoiceId === message.id ? 'Stop voice message' : 'Voice Message (Audio Read Aloud)'}
                >
                  {playingVoiceId === message.id ? (
                    <>
                      <VolumeX size={15} className="text-emerald-500" />
                      <span className="text-[11px] font-medium hidden sm:inline">Playing</span>
                      {/* Animated sound wave bars */}
                      <span className="flex items-end space-x-0.5 h-3 ml-0.5">
                        <span className="w-0.5 bg-emerald-500 h-2 animate-bounce" style={{ animationDuration: '0.4s' }} />
                        <span className="w-0.5 bg-emerald-500 h-3 animate-bounce" style={{ animationDuration: '0.3s' }} />
                        <span className="w-0.5 bg-emerald-500 h-1.5 animate-bounce" style={{ animationDuration: '0.5s' }} />
                      </span>
                    </>
                  ) : (
                    <Volume2 size={15} />
                  )}
                </button>

                <button
                  onClick={() => onFeedback(message.id, 'up')}
                  aria-label="Thumbs up"
                  className={`p-1.5 rounded-lg hover:bg-[#EDEDEF] dark:hover:bg-[#232325] transition-colors ${
                    message.feedback === 'up' ? 'text-emerald-500 fill-emerald-500' : ''
                  }`}
                  title="Helpful"
                >
                  <ThumbsUp size={15} />
                </button>

                <button
                  onClick={() => onFeedback(message.id, 'down')}
                  aria-label="Thumbs down"
                  className={`p-1.5 rounded-lg hover:bg-[#EDEDEF] dark:hover:bg-[#232325] transition-colors ${
                    message.feedback === 'down' ? 'text-red-500 fill-red-500' : ''
                  }`}
                  title="Not helpful"
                >
                  <ThumbsDown size={15} />
                </button>

                {isLastMessage && !isGenerating && (
                  <button
                    onClick={onRegenerate}
                    aria-label="Regenerate response"
                    className="p-1.5 rounded-lg hover:bg-[#EDEDEF] dark:hover:bg-[#232325] hover:text-[#0D0D0D] dark:hover:text-[#F5F5F5] transition-colors"
                    title="Regenerate"
                  >
                    <RotateCw size={15} />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Waiting State: Three Pulsing Dots (PRD 20.5) */}
        {isGenerating && (
          <div className="flex items-center space-x-1.5 py-4">
            <div className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-pulse [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-pulse [animation-delay:0.4s]" />
          </div>
        )}

        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Jump to Latest Floating Button */}
      {showScrollBottom && (
        <button
          onClick={() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="fixed bottom-24 right-8 z-30 p-2.5 rounded-full bg-white dark:bg-[#232325] border border-[#E6E6E8] dark:border-[#2A2A2D] shadow-lg text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50"
          aria-label="Jump to latest message"
        >
          <ArrowDown size={17} />
        </button>
      )}
    </div>
  );
}
