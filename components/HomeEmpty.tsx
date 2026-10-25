'use client';

import React from 'react';
import AppLogo from '@/components/AppLogo';

interface HomeEmptyProps {
  onSelectPrompt: (prompt: string, isImage?: boolean) => void;
  onLogoClick?: () => void;
}

export default function HomeEmpty({ onSelectPrompt, onLogoClick }: HomeEmptyProps) {
  const suggestions = [
    {
      title: 'Explain a topic',
      subtitle: 'in simple terms',
      action: () => onSelectPrompt('Explain quantum computing in simple terms'),
    },
    {
      title: 'Write a professional email',
      subtitle: 'for a job application',
      action: () => onSelectPrompt('Write a professional email for a senior software engineering job application'),
    },
    {
      title: 'Create an image',
      subtitle: 'of a serene landscape',
      action: () => onSelectPrompt('A serene mountain lake landscape at golden hour with crystal reflections', true),
    },
    {
      title: 'Help me with coding',
      subtitle: 'debug my Python code',
      action: () => onSelectPrompt('Help me debug my Python code:\n\ndef calculate_fibonacci(n):\n    if n <= 1: return n\n    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)'),
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-2xl mx-auto w-full select-none">
      {/* Centered Line-Style Static Brain Logo Mark */}
      <div onClick={onLogoClick} className="mb-6 flex items-center justify-center cursor-pointer">
        <AppLogo size="hero" />
      </div>

      {/* Main Headline */}
      <h1 className="text-[24px] md:text-[28px] font-semibold text-[#0D0D0D] dark:text-[#F5F5F5] tracking-[-0.01em] text-center mb-8">
        How can MINDLY 2.2 help you today?
      </h1>

      {/* Suggestion Cards: 2x2 grid on tablet & desktop, stacked 1 col on phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-[680px]">
        {suggestions.map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className="flex flex-col text-left p-4 rounded-xl bg-white dark:bg-[#171718] border border-[#E6E6E8] dark:border-[#2A2A2D] hover:bg-[#F7F7F8] dark:hover:bg-[#202024] hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)] group"
          >
            <span className="text-[14px] font-semibold text-[#0D0D0D] dark:text-[#F5F5F5] group-hover:text-black dark:group-hover:text-white">
              {item.title}
            </span>
            <span className="text-[13px] text-[#6B6B70] dark:text-[#A1A1A6] mt-0.5">
              {item.subtitle}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
