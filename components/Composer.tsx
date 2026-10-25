'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Plus,
  Globe,
  ArrowUp,
  Square,
  FileText,
  Image as ImageIcon,
  Camera,
  X,
  Sparkles,
  Zap,
  Cpu,
  ChevronDown,
  Check,
  Code2,
  Mic,
  MicOff,
} from 'lucide-react';
import { Attachment, ModelType } from '@/lib/types';

interface ComposerProps {
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  onStop: () => void;
  isGenerating: boolean;
  onOpenVoiceMode?: () => void;
  onOpenImageModal: () => void;
  webSearchEnabled: boolean;
  setWebSearchEnabled: (val: boolean) => void;
  attachments: Attachment[];
  setAttachments: React.Dispatch<React.SetStateAction<Attachment[]>>;
  selectedModel?: ModelType;
  onSelectModel?: (model: ModelType) => void;
}

const MINDLY_MODELS: {
  id: ModelType;
  name: string;
  shortName: string;
  category: string;
  tagline: string;
  tag: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'mindly-2.2-fast',
    name: 'MINDLY 2.2 Fast',
    shortName: 'Fast',
    category: 'Everyday AI',
    tagline: '“Think Less. Get More Done.”',
    tag: 'Fast',
    desc: 'Instant answers, everyday intelligence, zero friction.',
    icon: <Zap size={13} className="text-amber-500 shrink-0" />,
  },
  {
    id: 'mindly-2.2-pro',
    name: 'MINDLY 2.2 Pro',
    shortName: 'Pro',
    category: 'Advanced AI',
    tagline: '“Built for the Complex.”',
    tag: 'Pro',
    desc: 'Advanced problem-solving, deeper analysis, powerful intelligence.',
    icon: <Cpu size={13} className="text-emerald-500 shrink-0" />,
  },
  {
    id: 'mindly-2.2-coding',
    name: 'MINDLY 2.2 Coding',
    shortName: 'Coding',
    category: 'Code Intelligence',
    tagline: '“From Logic to Launch.”',
    tag: 'Code',
    desc: 'Write smarter code, debug faster, build without limits.',
    icon: <Code2 size={13} className="text-cyan-500 shrink-0" />,
  },
  {
    id: 'mindly-2.2-think',
    name: 'MINDLY 2.2 Think',
    shortName: 'Think',
    category: 'Deep Reasoning',
    tagline: '“Go Beyond the Obvious.”',
    tag: 'Think',
    desc: 'Deeper reasoning, complex analysis, ideas explored to the core.',
    icon: <Sparkles size={13} className="text-indigo-500 shrink-0" />,
  },
];

export default function Composer({
  input,
  setInput,
  onSend,
  onStop,
  isGenerating,
  onOpenVoiceMode,
  onOpenImageModal,
  webSearchEnabled,
  setWebSearchEnabled,
  attachments,
  setAttachments,
  selectedModel = 'mindly-2.2-fast',
  onSelectModel,
}: ComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const [modelPickerOpen, setModelPickerOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  const handleToggleVoiceRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      if (onOpenVoiceMode) {
        onOpenVoiceMode();
      } else {
        alert('Voice speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.');
      }
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = navigator.language || 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        if (text) {
          const currentText = textareaRef.current?.value || input || '';
          const trimmed = currentText.trim();
          setInput(trimmed ? `${trimmed} ${text.trim()}` : text.trim());
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      if (onOpenVoiceMode) onOpenVoiceMode();
    }
  };

  const activeModelInfo =
    MINDLY_MODELS.find(m => m.id === selectedModel) || MINDLY_MODELS[0];

  // Auto-resize textarea up to 8 lines (~180px)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // On desktop, Enter sends
      if (window.innerWidth >= 640) {
        e.preventDefault();
        if (input.trim() || attachments.length > 0) {
          onSend();
        }
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isImg = file.type.startsWith('image/');

      const newAtt: Attachment = {
        id: Math.random().toString(36).substring(7),
        name: file.name,
        size: file.size,
        type: file.type,
      };

      if (isImg) {
        const reader = new FileReader();
        reader.onload = () => {
          newAtt.url = reader.result as string;
          setAttachments(prev => [...prev, newAtt]);
        };
        reader.readAsDataURL(file);
      } else {
        setAttachments(prev => [...prev, newAtt]);
      }
    }
    setPlusMenuOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const hasText = input.trim().length > 0 || attachments.length > 0;

  return (
    <div className="w-full max-w-[760px] mx-auto px-3 sm:px-4 pb-3 select-none">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Main Composer Box */}
      <div className="relative rounded-[22px] bg-[#F7F7F8] dark:bg-[#171718] border border-[#E6E6E8] dark:border-[#2A2A2D] shadow-sm transition-all focus-within:border-neutral-400 dark:focus-within:border-neutral-600 focus-within:shadow-md">
        {/* Attachment Badges Row */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-3 pt-3">
            {attachments.map(att => (
              <div
                key={att.id}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-[#202024] border border-[#E6E6E8] dark:border-[#2A2A2D] text-xs text-[#0D0D0D] dark:text-[#F5F5F5]"
              >
                {att.type.startsWith('image/') ? (
                  <ImageIcon size={14} className="text-blue-500" />
                ) : (
                  <FileText size={14} className="text-amber-500" />
                )}
                <span className="truncate max-w-[140px] font-medium">{att.name}</span>
                <button
                  onClick={() => removeAttachment(att.id)}
                  aria-label="Remove attachment"
                  className="p-0.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-[#6B6B70] cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Voice Listening Active Indicator Banner */}
        {isListening && (
          <div className="flex items-center justify-between px-3.5 py-1.5 mx-3 mt-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 animate-in fade-in">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="font-medium text-[11.5px]">Listening... Speak in Hindi, English, or any language</span>
              <span className="flex items-end space-x-0.5 h-2.5">
                <span className="w-0.5 bg-red-500 h-2 animate-bounce" style={{ animationDuration: '0.4s' }} />
                <span className="w-0.5 bg-red-500 h-2.5 animate-bounce" style={{ animationDuration: '0.3s' }} />
                <span className="w-0.5 bg-red-500 h-1.5 animate-bounce" style={{ animationDuration: '0.5s' }} />
              </span>
            </div>
            <button
              type="button"
              onClick={handleToggleVoiceRecording}
              className="text-[11.5px] font-semibold hover:underline cursor-pointer"
            >
              Done
            </button>
          </div>
        )}

        {/* Text Input Area */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening to your voice..." : "Ask anything, speak or select a model..."}
          rows={1}
          className="w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-[15px] text-[#0D0D0D] dark:text-[#F5F5F5] placeholder-[#9A9AA0] dark:placeholder-[#6B6B70] focus:outline-none min-h-[44px]"
        />

        {/* Bottom Toolbar inside Composer */}
        <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
          {/* Left Tools: Plus Menu, Web Search, and Mindly Model Selector */}
          <div className="flex items-center space-x-1.5 relative">
            {/* Plus / Attach Button */}
            <button
              onClick={() => setPlusMenuOpen(!plusMenuOpen)}
              aria-label="Add attachment"
              className="p-1.5 rounded-full hover:bg-[#EDEDEF] dark:hover:bg-[#232325] text-[#6B6B70] dark:text-[#A1A1A6] transition-colors cursor-pointer"
            >
              <Plus size={18} />
            </button>

            {/* Plus Flyout Menu */}
            {plusMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setPlusMenuOpen(false)}
                />
                <div className="absolute left-0 bottom-full mb-2 w-48 rounded-2xl bg-white dark:bg-[#1C1C1F] border border-[#E6E6E8] dark:border-[#2A2A2D] shadow-xl p-1.5 z-50 text-xs space-y-0.5">
                  <button
                    onClick={() => {
                      setPlusMenuOpen(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left flex items-center space-x-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                  >
                    <FileText size={15} />
                    <span>Upload file</span>
                  </button>
                  <button
                    onClick={() => {
                      setPlusMenuOpen(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left flex items-center space-x-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                  >
                    <Camera size={15} />
                    <span>Attach image</span>
                  </button>
                  <button
                    onClick={() => {
                      setPlusMenuOpen(false);
                      onOpenImageModal();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left flex items-center space-x-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                  >
                    <Sparkles size={15} className="text-indigo-500" />
                    <span>Create image</span>
                  </button>
                </div>
              </>
            )}

            {/* Web Search Globe Toggle */}
            <button
              onClick={() => setWebSearchEnabled(!webSearchEnabled)}
              aria-label={webSearchEnabled ? 'Disable web search' : 'Enable web search'}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                webSearchEnabled
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                  : 'hover:bg-[#EDEDEF] dark:hover:bg-[#232325] text-[#6B6B70] dark:text-[#A1A1A6]'
              }`}
              title={webSearchEnabled ? 'Web search enabled' : 'Turn on web search'}
            >
              <Globe size={18} className={webSearchEnabled ? 'fill-blue-600/20' : ''} />
            </button>

            {/* MINDLY MODEL SELECTOR IN REALTIME CHAT (Replaces token meter) */}
            <div className="relative ml-0.5">
              <button
                type="button"
                onClick={() => setModelPickerOpen(!modelPickerOpen)}
                title={`Active Model: ${activeModelInfo.name}. Click to switch.`}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-[#202024] hover:bg-[#EDEDEF] dark:hover:bg-[#28282D] border border-neutral-200/90 dark:border-neutral-700/80 text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-all cursor-pointer shadow-2xs select-none"
              >
                {activeModelInfo.icon}
                <span className="font-semibold text-[11px] sm:text-xs">
                  <span className="hidden sm:inline">MINDLY </span>{activeModelInfo.shortName}
                </span>
                <ChevronDown size={12} className="text-neutral-400 shrink-0 ml-0.5" />
              </button>

              {/* Model Picker Popover */}
              {modelPickerOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setModelPickerOpen(false)}
                  />
                  <div className="absolute left-0 bottom-full mb-2 w-72 max-w-[85vw] rounded-2xl bg-white dark:bg-[#1C1C1F] border border-neutral-200 dark:border-neutral-700 shadow-2xl p-2 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-2 py-1 text-[10px] font-semibold text-[#6B6B70] dark:text-[#A1A1A6] uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800 mb-1">
                      MINDLY AI Models
                    </div>
                    {MINDLY_MODELS.map(m => {
                      const isSelected = selectedModel === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            if (onSelectModel) {
                              onSelectModel(m.id);
                            }
                            setModelPickerOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded-xl flex items-start space-x-2.5 transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#EDEDEF] dark:bg-[#26262B]'
                              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                          }`}
                        >
                          <div className="mt-0.5">{m.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-xs text-[#0D0D0D] dark:text-[#F5F5F5]">
                                {m.name}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-neutral-200/80 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                                {m.category}
                              </span>
                            </div>
                            <div className="text-[10.5px] font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                              {m.tagline}
                            </div>
                            <p className="text-[11px] text-[#6B6B70] dark:text-[#A1A1A6] mt-0.5 leading-snug">
                              {m.desc}
                            </p>
                          </div>
                          {isSelected && (
                            <Check size={14} className="text-neutral-900 dark:text-white shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Action: Voice Message & Send / Stop Button */}
          <div className="flex items-center space-x-1.5">
            {/* Voice Message Microphone Button */}
            <button
              type="button"
              onClick={handleToggleVoiceRecording}
              aria-label={isListening ? 'Stop listening' : 'Record voice message'}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30'
                  : 'text-[#6B6B70] dark:text-[#A1A1A6] hover:bg-[#EDEDEF] dark:hover:bg-[#232325]'
              }`}
              title={isListening ? 'Stop voice recording' : 'Voice Message (Dictate / Speak)'}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            {isGenerating ? (
              <button
                onClick={onStop}
                aria-label="Stop generation"
                className="w-8 h-8 rounded-full bg-[#0D0D0D] dark:bg-[#F5F5F5] text-white dark:text-[#0D0D0D] flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Square size={13} fill="currentColor" />
              </button>
            ) : (
              <button
                onClick={onSend}
                disabled={!hasText}
                aria-label="Send message"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  hasText
                    ? 'bg-[#0D0D0D] dark:bg-[#F5F5F5] text-white dark:text-[#0D0D0D] hover:opacity-90 cursor-pointer shadow-xs'
                    : 'bg-[#EDEDEF] dark:bg-[#232325] text-neutral-400 dark:text-neutral-600 cursor-not-allowed'
                }`}
              >
                <ArrowUp size={16} strokeWidth={2.4} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Small Legal / Safety Disclaimer note below the bar (12px) */}
      <div className="text-center text-[12px] text-[#9A9AA0] mt-2 select-none">
        MINDLY can make mistakes. Check important info.
      </div>
    </div>
  );
}
