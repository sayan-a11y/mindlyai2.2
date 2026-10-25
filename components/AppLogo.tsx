'use client';

import React from 'react';

interface AppLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  showWordmark?: boolean;
  animated?: boolean;
  onClick?: () => void;
  interactive?: boolean;
  variant?: 'adaptive' | 'black' | 'white' | 'blue';
}

export default function AppLogo({
  size = 'md',
  className = '',
  showWordmark = false,
  onClick,
  interactive = true,
  variant = 'adaptive',
}: AppLogoProps) {
  const sizeMap = {
    xs: { px: 18, text: 'text-xs', badge: 'text-[8px]', gap: 'gap-1.5' },
    sm: { px: 24, text: 'text-sm', badge: 'text-[9px]', gap: 'gap-2' },
    md: { px: 32, text: 'text-base', badge: 'text-[10px]', gap: 'gap-2.5' },
    lg: { px: 42, text: 'text-xl', badge: 'text-xs', gap: 'gap-3' },
    xl: { px: 56, text: 'text-2xl', badge: 'text-xs', gap: 'gap-3' },
    hero: { px: 76, text: 'text-3xl', badge: 'text-sm', gap: 'gap-3.5' },
  };

  const currentSize = sizeMap[size];

  return (
    <div
      className={`inline-flex items-center ${currentSize.gap} select-none ${
        interactive ? 'cursor-pointer group' : ''
      } ${className}`}
      onClick={onClick}
    >
      {/* High-Definition Brain Circuit Logo */}
      <div className="relative flex items-center justify-center shrink-0">
        <div className="relative transition-transform duration-200 group-hover:scale-105">
          {variant === 'blue' ? (
            <img
              src="/mindly-logo-blue.png"
              alt="MINDLY AI 2.2"
              width={currentSize.px}
              height={currentSize.px}
              className="object-contain filter drop-shadow-sm select-none pointer-events-none"
              style={{ width: currentSize.px, height: currentSize.px }}
            />
          ) : variant === 'black' ? (
            <img
              src="/mindly-logo-black.png"
              alt="MINDLY AI 2.2"
              width={currentSize.px}
              height={currentSize.px}
              className="object-contain filter drop-shadow-sm select-none pointer-events-none"
              style={{ width: currentSize.px, height: currentSize.px }}
            />
          ) : variant === 'white' ? (
            <img
              src="/mindly-logo-white.png"
              alt="MINDLY AI 2.2"
              width={currentSize.px}
              height={currentSize.px}
              className="object-contain filter drop-shadow-sm select-none pointer-events-none"
              style={{ width: currentSize.px, height: currentSize.px }}
            />
          ) : (
            <>
              {/* Adaptive for Light theme: Black strokes */}
              <img
                src="/mindly-logo-black.png"
                alt="MINDLY AI 2.2"
                width={currentSize.px}
                height={currentSize.px}
                className="dark:hidden object-contain filter drop-shadow-sm select-none pointer-events-none"
                style={{ width: currentSize.px, height: currentSize.px }}
              />
              {/* Adaptive for Dark theme: White strokes */}
              <img
                src="/mindly-logo-white.png"
                alt="MINDLY AI 2.2"
                width={currentSize.px}
                height={currentSize.px}
                className="hidden dark:block object-contain filter drop-shadow-sm select-none pointer-events-none"
                style={{ width: currentSize.px, height: currentSize.px }}
              />
            </>
          )}
        </div>
      </div>

      {/* Official Wordmark matching reference: "Mindly AI 2.2" */}
      {showWordmark && (
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-bold tracking-tight text-[#0D0D0D] dark:text-[#F5F5F5] ${currentSize.text} transition-colors group-hover:text-black dark:group-hover:text-white`}
          >
            Mindly AI
          </span>
          <span className={`font-extrabold text-[#1d68f6] ${currentSize.text}`}>
            2.2
          </span>
        </div>
      )}
    </div>
  );
}
