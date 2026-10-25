'use client';

import React, { useState } from 'react';
import {
  X,
  Sliders,
  Check,
  Moon,
  Sun,
  Laptop,
  Crown,
  Zap,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { UserSettings, Memory, UserUsage } from '@/lib/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  usage: UserUsage;
  onPlanChange?: (plan: 'free' | 'plus' | 'pro') => void;
  onOpenUpgradeModal?: () => void;
  // Kept optional for compatibility
  memories?: Memory[];
  onAddMemory?: (text: string) => void;
  onDeleteMemory?: (id: string) => void;
  onClearAllChats?: () => void;
  onOpenClearAllModal?: () => void;
  onExportWorkspaceBackup?: () => void;
  onRestoreWorkspaceBackup?: (jsonStr: string) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  usage,
  onPlanChange,
  onOpenUpgradeModal,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'usage'>('general');

  if (!isOpen) return null;

  const currentPlan = usage.plan.toLowerCase() as 'free' | 'plus' | 'pro';

  const PLAN_DETAILS = [
    {
      id: 'free' as const,
      name: 'MINDLY Free',
      price: '$0',
      period: 'Forever free',
      desc: 'Instant everyday intelligence with sub-second response times.',
      icon: <Zap size={18} className="text-amber-500" />,
      features: [
        'MINDLY 2.2 Fast unlimited answers',
        '30 Fast model messages / day',
        'Standard reasoning queue',
        '5 Image generations / day',
      ],
    },
    {
      id: 'pro' as const,
      name: 'MINDLY Pro',
      price: '$20',
      period: '/ month',
      desc: '70B deep reasoning, advanced coding, and complex mathematics.',
      icon: <Crown size={18} className="text-emerald-500" />,
      features: [
        'MINDLY 2.2 Pro & Think access',
        '100 Pro model messages / day',
        'Priority high-speed GPU cluster',
        '25 HD Image generations / day',
      ],
    },
    {
      id: 'plus' as const,
      name: 'MINDLY Plus',
      price: '$35',
      period: '/ month',
      desc: 'Ultimate capacity for power users, researchers & engineers.',
      icon: <Sparkles size={18} className="text-indigo-500" />,
      features: [
        'Highest GPU priority & concurrency',
        'Unlimited deep thinking traces',
        'Early access to next-gen neural weights',
        'Unlimited HD FLUX image creation',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs select-none">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#171718] border border-[#E6E6E8] dark:border-[#2A2A2D] shadow-2xl p-5 sm:p-6 flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#E6E6E8] dark:border-[#2A2A2D]">
          <h2 className="text-base font-semibold text-[#0D0D0D] dark:text-[#F5F5F5]">
            Settings & Preferences
          </h2>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation: General and Plan & Usage */}
        <div className="flex items-center space-x-1.5 border-b border-[#E6E6E8] dark:border-[#2A2A2D] py-3 text-xs overflow-x-auto scrollbar-none">
          {[
            { id: 'general', label: 'General', icon: Sliders },
            { id: 'usage', label: 'Plan & Usage', icon: Crown },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#EDEDEF] dark:bg-[#26262B] text-black dark:text-white font-semibold shadow-2xs'
                    : 'text-[#6B6B70] dark:text-[#A1A1A6] hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              {/* Theme Selector */}
              <div>
                <label className="block text-xs font-medium text-[#0D0D0D] dark:text-[#F5F5F5] mb-2">
                  Appearance Theme
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'light', label: 'Light', icon: Sun },
                    { id: 'dark', label: 'Dark', icon: Moon },
                    { id: 'system', label: 'System', icon: Laptop },
                  ].map(t => {
                    const Icon = t.icon;
                    const isSelected = settings.theme === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          onUpdateSettings({ theme: t.id as any });
                          if (t.id === 'dark') {
                            document.documentElement.classList.add('dark');
                          } else if (t.id === 'light') {
                            document.documentElement.classList.remove('dark');
                          } else {
                            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                              document.documentElement.classList.add('dark');
                            } else {
                              document.documentElement.classList.remove('dark');
                            }
                          }
                        }}
                        className={`flex items-center justify-center space-x-2 p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-neutral-900 bg-neutral-100/80 dark:border-white dark:bg-[#26262B] text-black dark:text-white font-semibold'
                            : 'border-[#E6E6E8] dark:border-[#2A2A2D] text-[#6B6B70] dark:text-[#A1A1A6] hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                        }`}
                      >
                        <Icon size={15} />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Size Selector */}
              <div>
                <label className="block text-xs font-medium text-[#0D0D0D] dark:text-[#F5F5F5] mb-2">
                  Interface Text Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['small', 'medium', 'large'].map(sz => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => onUpdateSettings({ fontSize: sz as any })}
                      className={`p-2 rounded-xl border capitalize transition-all cursor-pointer ${
                        settings.fontSize === sz
                          ? 'border-neutral-900 bg-neutral-100/80 dark:border-white dark:bg-[#26262B] text-black dark:text-white font-semibold'
                          : 'border-[#E6E6E8] dark:border-[#2A2A2D] text-[#6B6B70] dark:text-[#A1A1A6] hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selector */}
              <div>
                <label className="block text-xs font-medium text-[#0D0D0D] dark:text-[#F5F5F5] mb-2">
                  Display Language
                </label>
                <select
                  value={settings.language}
                  onChange={e => onUpdateSettings({ language: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E6E6E8] dark:border-[#2A2A2D] bg-white dark:bg-[#202024] text-[#0D0D0D] dark:text-[#F5F5F5] outline-none"
                >
                  <option value="English">English</option>
                  <option value="Hindi">हिंदी (Hindi)</option>
                  <option value="Bengali">বাংলা (Bengali)</option>
                  <option value="Spanish">Español (Spanish)</option>
                  <option value="French">Français (French)</option>
                  <option value="German">Deutsch (German)</option>
                  <option value="Japanese">日本語 (Japanese)</option>
                </select>
              </div>

              {/* About MINDLY */}
              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-[#202024] border border-[#E6E6E8] dark:border-[#2A2A2D]">
                <div className="flex items-center space-x-2 mb-1">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    MINDLY AI 2.2 Core
                  </span>
                </div>
                <p className="text-[11px] text-[#6B6B70] dark:text-[#A1A1A6] leading-relaxed">
                  Clean monochrome interface designed for high-focus creative, engineering, and reasoning tasks.
                </p>
              </div>
            </div>
          )}

          {/* PLAN & USAGE TAB - SHOWS ACTIVE PLAN CLEARLY */}
          {activeTab === 'usage' && (
            <div className="space-y-4">
              {/* Active Plan Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-neutral-900 to-neutral-800 text-white dark:from-[#202024] dark:to-[#171718] border border-neutral-700/60 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-400">
                        Current Active Plan
                      </span>
                    </div>
                    <div className="text-xl font-bold mt-1 text-white flex items-center space-x-2">
                      <span>MINDLY {currentPlan.toUpperCase()} TIER</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        ACTIVE
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-300 dark:text-neutral-400 mt-0.5">
                      Your account has full active access. Quotas reset automatically daily at 00:00 UTC.
                    </p>
                  </div>

                  {onOpenUpgradeModal && currentPlan === 'free' && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenUpgradeModal();
                      }}
                      className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-100 transition-colors shadow-sm cursor-pointer whitespace-nowrap self-start sm:self-center"
                    >
                      Upgrade Plan
                    </button>
                  )}
                </div>
              </div>

              {/* All Plans Showcase (Highlighting which is active) */}
              <div>
                <h4 className="text-xs font-semibold text-[#0D0D0D] dark:text-[#F5F5F5] mb-2.5">
                  Available Membership Tiers
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {PLAN_DETAILS.map(p => {
                    const isActive = currentPlan === p.id;
                    return (
                      <div
                        key={p.id}
                        className={`rounded-2xl p-3.5 border transition-all flex flex-col justify-between ${
                          isActive
                            ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 dark:border-emerald-600 shadow-xs ring-1 ring-emerald-500/50'
                            : 'border-[#E6E6E8] dark:border-[#2A2A2D] bg-neutral-50/60 dark:bg-[#1E1E22]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="p-1.5 rounded-lg bg-white dark:bg-[#28282D] border border-neutral-200 dark:border-neutral-700">
                              {p.icon}
                            </div>
                            {isActive ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center space-x-1">
                                <Check size={10} strokeWidth={3} />
                                <span>ACTIVE</span>
                              </span>
                            ) : (
                              <span className="text-[10px] text-neutral-400 font-medium">
                                Available
                              </span>
                            )}
                          </div>

                          <div className="font-bold text-sm text-[#0D0D0D] dark:text-white">
                            {p.name}
                          </div>
                          <div className="flex items-baseline space-x-1 my-1">
                            <span className="text-base font-extrabold text-neutral-900 dark:text-white">
                              {p.price}
                            </span>
                            <span className="text-[10px] text-neutral-400">
                              {p.period}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#6B6B70] dark:text-[#A1A1A6] mb-3 leading-tight">
                            {p.desc}
                          </p>

                          <ul className="space-y-1.5 mb-4">
                            {p.features.map((feat, idx) => (
                              <li
                                key={idx}
                                className="flex items-start space-x-1.5 text-[10px] text-neutral-700 dark:text-neutral-300"
                              >
                                <Check size={11} className="text-emerald-500 shrink-0 mt-0.5" />
                                <span className="leading-tight">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {isActive ? (
                          <div className="w-full py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-center text-xs font-semibold">
                            Current Active Plan
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              if (onPlanChange) {
                                onPlanChange(p.id);
                              } else if (onOpenUpgradeModal) {
                                onClose();
                                onOpenUpgradeModal();
                              }
                            }}
                            className="w-full py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black text-center text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
                          >
                            Switch to {p.name.replace('MINDLY ', '')}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live Quota Meters */}
              <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#202024] border border-[#E6E6E8] dark:border-[#2A2A2D] space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200/80 dark:border-neutral-700/80 pb-2">
                  <span className="font-semibold text-neutral-900 dark:text-white text-xs">
                    Live Quota & Usage Meters
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    Resets in 3h 24m
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium text-neutral-800 dark:text-neutral-200">
                      <span>Fast Model Messages</span>
                      <span className="font-mono text-[11px] text-neutral-500">
                        {usage.fastMessagesUsed} / {usage.fastMessagesLimit} used
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            (usage.fastMessagesUsed / usage.fastMessagesLimit) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium text-neutral-800 dark:text-neutral-200">
                      <span>Pro Model Messages</span>
                      <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                        {usage.proMessagesUsed} / {usage.proMessagesLimit} used
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            (usage.proMessagesUsed / usage.proMessagesLimit) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1 font-medium text-neutral-800 dark:text-neutral-200">
                      <span>Image Generations</span>
                      <span className="font-mono text-[11px] text-amber-600 dark:text-amber-400">
                        {usage.imagesUsed} / {usage.imagesLimit} used
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            (usage.imagesUsed / usage.imagesLimit) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
