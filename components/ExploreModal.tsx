'use client';

import React, { useState } from 'react';
import { X, Search, Star, Sparkles, Code2, PenTool, BookOpen, Briefcase, Palette, HeartHandshake } from 'lucide-react';
import { PromptTemplate } from '@/lib/types';

interface ExploreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (prompt: string) => void;
}

const DEFAULT_TEMPLATES: PromptTemplate[] = [
  {
    id: '1',
    category: 'Writing',
    title: 'Executive Summary',
    subtitle: 'Condense any complex report into a 3-bullet briefing',
    prompt: 'Summarize the following document into an executive briefing with: 1) Core Problem, 2) Key Metrics, 3) Action Plan:\n\n[Paste text here]',
  },
  {
    id: '2',
    category: 'Writing',
    title: 'Persuasive Cold Email',
    subtitle: 'High conversion outreach for enterprise leads',
    prompt: 'Write a high-converting 75-word cold email to a VP of Engineering proposing a private AI infrastructure audit. Focus on data ownership and zero API leaks.',
  },
  {
    id: '3',
    category: 'Coding',
    title: 'Full-Stack API Design',
    subtitle: 'TypeScript schema, routes & validation',
    prompt: 'Design a production-ready Next.js REST API with TypeScript types, Zod schema validation, and rate limiting for an AI agent platform.',
  },
  {
    id: '4',
    category: 'Coding',
    title: 'Python Memory Profiler',
    subtitle: 'Find memory leaks & optimize vLLM batching',
    prompt: 'Analyze this Python code for GPU memory leaks and recommend PyTorch tensor recycling patterns for LLM inference serving:\n\n[Paste code]',
  },
  {
    id: '5',
    category: 'Study',
    title: 'Feynman Technique Tutor',
    subtitle: 'Explain complex theory to a 10-year old',
    prompt: 'Explain how neural network backpropagation works using the Feynman Technique. Use relatable everyday analogies, avoid jargon, then test my understanding with 2 quiz questions.',
  },
  {
    id: '6',
    category: 'Business',
    title: 'SaaS Unit Economics',
    subtitle: 'LTV, CAC, Payback Period & Gross Margins',
    prompt: 'Calculate SaaS unit economics: given CAC of $450, ARPU of $79/mo, gross margin 82%, and monthly churn 2.1%, determine LTV:CAC ratio and months to payback.',
  },
  {
    id: '7',
    category: 'Creative',
    title: 'Sci-Fi Worldbuilder',
    subtitle: 'Construct laws of physics & galactic politics',
    prompt: 'Design a believable science fiction civilization living around a neutron star, including their energy harvesting methods, language, and cultural ethics.',
  },
  {
    id: '8',
    category: 'Life',
    title: 'Deep Work Day Planner',
    subtitle: 'Time-block your schedule by energy cycles',
    prompt: 'Create an optimized daily schedule for 4 hours of deep analytical coding, 2 hours of creative writing, and workout recovery based on circadian ultradian rhythms.',
  },
];

export default function ExploreModal({
  isOpen,
  onClose,
  onSelectTemplate,
}: ExploreModalProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const categories = ['All', 'Writing', 'Coding', 'Study', 'Business', 'Creative', 'Life'];

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = DEFAULT_TEMPLATES.filter(tpl => {
    const matchesCat = activeCategory === 'All' || tpl.category === activeCategory;
    const matchesSearch =
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
      <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-[#171718] border border-[#E6E6E8] dark:border-[#2A2A2D] shadow-2xl p-6 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E6E8] dark:border-[#2A2A2D]">
          <div>
            <h2 className="text-base font-semibold text-[#0D0D0D] dark:text-[#F5F5F5]">
              Explore MINDLY Prompts
            </h2>
            <p className="text-xs text-[#6B6B70] dark:text-[#A1A1A6] mt-0.5">
              Curated master templates for coding, deep analysis, writing and creativity.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close template explorer"
            className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="py-4 space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-50 dark:bg-[#202024] border border-[#E6E6E8] dark:border-[#2A2A2D] text-xs text-neutral-900 dark:text-neutral-100 outline-none"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 pr-1">
          {filtered.map(tpl => (
            <div
              key={tpl.id}
              onClick={() => {
                onSelectTemplate(tpl.prompt);
                onClose();
              }}
              className="p-4 rounded-xl border border-[#E6E6E8] dark:border-[#2A2A2D] bg-neutral-50/50 dark:bg-[#1E1E22] hover:bg-neutral-100/80 dark:hover:bg-[#25252A] transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6B70] dark:text-[#A1A1A6]">
                    {tpl.category}
                  </span>
                  <button
                    onClick={(e) => toggleFavorite(tpl.id, e)}
                    className="p-1 text-neutral-400 hover:text-amber-500"
                  >
                    <Star
                      size={14}
                      className={favorites[tpl.id] ? 'text-amber-500 fill-amber-500' : ''}
                    />
                  </button>
                </div>
                <h3 className="text-sm font-semibold text-[#0D0D0D] dark:text-[#F5F5F5] group-hover:text-black dark:group-hover:text-white">
                  {tpl.title}
                </h3>
                <p className="text-xs text-[#6B6B70] dark:text-[#A1A1A6] mt-1 leading-snug line-clamp-2">
                  {tpl.subtitle}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-neutral-200/60 dark:border-neutral-800 text-[11px] font-medium text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
                Tap to use prompt →
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
