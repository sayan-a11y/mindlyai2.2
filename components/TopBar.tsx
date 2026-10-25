'use client';

import React, { useState } from 'react';
import { Menu, SquarePen, Share2, ChevronDown, Check, Zap, Cpu, Sparkles, Code2 } from 'lucide-react';
import { ModelType } from '@/lib/types';
import AppLogo from '@/components/AppLogo';

interface TopBarProps {
  selectedModel: ModelType;
  onSelectModel: (model: ModelType) => void;
  onOpenMobileMenu: () => void;
  onNewChat: () => void;
  onOpenVoiceMode?: () => void;
  onShareChat?: () => void;
  isInChat: boolean;
  onLogoClick?: () => void;
}

export default function TopBar({
  selectedModel,
  onSelectModel,
  onOpenMobileMenu,
  onNewChat,
  onShareChat,
  isInChat,
  onLogoClick,
}: TopBarProps) {
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  const models: {
    id: ModelType;
    name: string;
    category: string;
    tagline: string;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'mindly-2.2-fast',
      name: 'MINDLY 2.2 Fast',
      category: 'Everyday AI',
      tagline: '“Think Less. Get More Done.”',
      desc: 'Instant answers, everyday intelligence, zero friction.',
      icon: <Zap size={15} className="text-amber-500" />,
    },
    {
      id: 'mindly-2.2-pro',
      name: 'MINDLY 2.2 Pro',
      category: 'Advanced AI',
      tagline: '“Built for the Complex.”',
      desc: 'Advanced problem-solving, deeper analysis, powerful intelligence.',
      icon: <Cpu size={15} className="text-emerald-500" />,
    },
    {
      id: 'mindly-2.2-coding',
      name: 'MINDLY 2.2 Coding',
      category: 'Code Intelligence',
      tagline: '“From Logic to Launch.”',
      desc: 'Write smarter code, debug faster, build without limits.',
      icon: <Code2 size={15} className="text-cyan-500" />,
    },
    {
      id: 'mindly-2.2-think',
      name: 'MINDLY 2.2 Think',
      category: 'Deep Reasoning',
      tagline: '“Go Beyond the Obvious.”',
      desc: 'Deeper reasoning, complex analysis, ideas explored to the core.',
      icon: <Sparkles size={15} className="text-indigo-500" />,
    },
  ];

  const currentModelName = selectedModel.includes('think')
    ? 'MINDLY 2.2 Think'
    : selectedModel.includes('coding')
    ? 'MINDLY 2.2 Coding'
    : selectedModel.includes('pro')
    ? 'MINDLY 2.2 Pro'
    : 'MINDLY 2.2 Fast';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-white/95 dark:bg-[#0F0F10]/95 border-b border-[#E6E6E8] dark:border-[#2A2A2D] backdrop-blur-sm select-none">
      {/* Mobile Top Bar (Left Menu, Center Logo, Right Compose) */}
      <div className="flex items-center justify-between w-full md:hidden">
        <button
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="p-2 -ml-2 rounded-lg hover:bg-[#EDEDEF] dark:hover:bg-[#232325] text-[#0D0D0D] dark:text-[#F5F5F5]"
        >
          <Menu size={22} />
        </button>

        {/* Centered Logo & Wordmark - High Visibility on Mobile */}
        <div onClick={onLogoClick || onNewChat} className="cursor-pointer flex items-center justify-center">
          <AppLogo size="md" showWordmark={true} />
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={onNewChat}
            aria-label="Start new conversation"
            className="p-2 -mr-2 rounded-lg hover:bg-[#EDEDEF] dark:hover:bg-[#232325] text-[#0D0D0D] dark:text-[#F5F5F5]"
          >
            <SquarePen size={20} />
          </button>
        </div>
      </div>

      {/* Desktop & Tablet Top Bar */}
      <div className="hidden md:flex items-center justify-between w-full">
        {/* Model Selector Dropdown ("MINDLY ▾") */}
        <div className="relative">
          <button
            onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
            aria-label="Select AI model"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl hover:bg-[#EDEDEF] dark:hover:bg-[#232325] text-sm font-semibold text-[#0D0D0D] dark:text-[#F5F5F5] transition-colors"
          >
            <span>{currentModelName}</span>
            <ChevronDown size={15} className="text-[#6B6B70] dark:text-[#A1A1A6]" />
          </button>

          {modelDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setModelDropdownOpen(false)}
              />
              <div className="absolute top-full left-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#1C1C1F] border border-[#E6E6E8] dark:border-[#2A2A2D] shadow-2xl p-2 z-50 text-xs">
                <div className="px-2.5 py-1.5 text-[11px] font-bold text-[#6B6B70] dark:text-[#A1A1A6] uppercase tracking-wider flex items-center justify-between">
                  <span>MINDLY 2.2 Models</span>
                  <span className="text-[10px] text-blue-600 font-mono">v2.2</span>
                </div>
                {models.map(m => {
                  const isSelected = selectedModel === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        onSelectModel(m.id);
                        setModelDropdownOpen(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl flex items-start space-x-3 transition-colors ${
                        isSelected
                          ? 'bg-[#EDEDEF] dark:bg-[#26262B]'
                          : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">{m.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-xs text-[#0D0D0D] dark:text-[#F5F5F5]">
                            {m.name}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-neutral-200/80 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 shrink-0">
                            {m.category}
                          </span>
                        </div>
                        <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                          {m.tagline}
                        </div>
                        <p className="text-[11px] text-[#6B6B70] dark:text-[#A1A1A6] mt-0.5 leading-snug">
                          {m.desc}
                        </p>
                      </div>
                      {isSelected && (
                        <Check size={15} className="text-blue-600 dark:text-blue-400 shrink-0 mt-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Right Tools (Share, Compose) */}
        <div className="flex items-center space-x-2">

          {isInChat && onShareChat && (
            <button
              onClick={onShareChat}
              aria-label="Share this chat"
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl hover:bg-[#EDEDEF] dark:hover:bg-[#232325] text-xs font-medium text-[#0D0D0D] dark:text-[#F5F5F5] transition-colors"
            >
              <Share2 size={15} />
              <span>Share</span>
            </button>
          )}

          <button
            onClick={onNewChat}
            aria-label="New chat"
            className="p-1.5 rounded-lg hover:bg-[#EDEDEF] dark:hover:bg-[#232325] text-[#0D0D0D] dark:text-[#F5F5F5] transition-colors"
          >
            <SquarePen size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
