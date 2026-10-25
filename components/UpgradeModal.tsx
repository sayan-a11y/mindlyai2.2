'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Check, Crown, Zap, Sparkles } from 'lucide-react';

import AppLogo from '@/components/AppLogo';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: 'free' | 'plus' | 'pro';
  onPlanChange: (plan: 'free' | 'plus' | 'pro') => void;
}

export default function UpgradeModal({
  isOpen,
  onClose,
  currentPlan,
  onPlanChange,
}: UpgradeModalProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpgrade = (plan: 'plus' | 'pro') => {
    onPlanChange(plan);
    setSuccessMessage(`You are now upgraded to MINDLY ${plan.toUpperCase()}!`);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none">
      <div className="w-full max-w-4xl rounded-2xl bg-white dark:bg-[#171718] border border-[#E6E6E8] dark:border-[#2A2A2D] shadow-2xl p-6 md:p-8 flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Header with AppLogo */}
        <div className="flex items-center justify-between pb-5 border-b border-[#E6E6E8] dark:border-[#2A2A2D]">
          <div className="flex items-center space-x-3.5">
            <AppLogo size="lg" showWordmark={true} />
            <div className="h-6 w-px bg-neutral-300 dark:bg-neutral-700 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-[11px] font-semibold">
              <Crown size={13} className="text-amber-500" />
              <span>Subscription Plans</span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close upgrade modal"
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="my-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs font-semibold text-center animate-fade-in">
            {successMessage}
          </div>
        )}

        {/* Monthly / Annual Billing Toggle */}
        <div className="flex items-center justify-center my-6">
          <div className="flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-[#202024] border border-[#E6E6E8] dark:border-[#2A2A2D]">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-[#0D0D0D] text-black dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-white dark:bg-[#0D0D0D] text-black dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Free Plan */}
          <div className="rounded-2xl p-5 border border-[#E6E6E8] dark:border-[#2A2A2D] bg-neutral-50/40 dark:bg-[#1A1A1D] flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#6B6B70] dark:text-[#A1A1A6]">
                Free Starter
              </div>
              <div className="text-2xl font-bold mt-2 text-[#0D0D0D] dark:text-[#F5F5F5]">
                $0
                <span className="text-xs font-normal text-neutral-500"> / forever</span>
              </div>
              <p className="text-xs text-[#6B6B70] dark:text-[#A1A1A6] mt-1 mb-4">
                Essential conversational assistance for students & daily queries.
              </p>

              <ul className="space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                <li className="flex items-center space-x-2">
                  <Check size={14} className="text-emerald-500 shrink-0" />
                  <span>30 Fast messages / day</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check size={14} className="text-emerald-500 shrink-0" />
                  <span>10 Pro messages / day</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check size={14} className="text-emerald-500 shrink-0" />
                  <span>5 Images / day (Standard)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check size={14} className="text-emerald-500 shrink-0" />
                  <span>10 mins 3D voice session / day</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check size={14} className="text-emerald-500 shrink-0" />
                  <span>Up to 10 MB file uploads</span>
                </li>
              </ul>
            </div>

            <button
              disabled={currentPlan === 'free'}
              onClick={() => onPlanChange('free')}
              className="mt-6 w-full py-2.5 rounded-xl border border-[#E6E6E8] dark:border-[#2A2A2D] text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50"
            >
              {currentPlan === 'free' ? 'Current Plan' : 'Downgrade to Free'}
            </button>
          </div>

          {/* Plus Plan (Featured) */}
          <div className="relative rounded-2xl p-5 border-2 border-neutral-900 dark:border-white bg-white dark:bg-[#1E1E22] flex flex-col justify-between shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-[10px] font-bold uppercase tracking-wider">
              Most Popular
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                  MINDLY Plus
                </span>
                <Zap size={15} className="text-amber-500" />
              </div>
              <div className="text-2xl font-bold mt-2 text-[#0D0D0D] dark:text-[#F5F5F5]">
                {billingCycle === 'monthly' ? '$16' : '$12'}
                <span className="text-xs font-normal text-neutral-500"> / month</span>
              </div>
              <p className="text-xs text-[#6B6B70] dark:text-[#A1A1A6] mt-1 mb-4">
                For developers, professionals, and creators needing higher throughput.
              </p>

              <ul className="space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                <li className="flex items-center space-x-2">
                  <Check size={14} className="text-emerald-500 shrink-0" />
                  <span className="font-medium">300 Fast & 100 Pro messages / day</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check size={14} className="text-emerald-500 shrink-0" />
                  <span>50 Images / day (FLUX.1 Schnell)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check size={14} className="text-emerald-500 shrink-0" />
                  <span>60 mins 3D voice session / day</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check size={14} className="text-emerald-500 shrink-0" />
                  <span>Priority GPU inference queue</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check size={14} className="text-emerald-500 shrink-0" />
                  <span>Up to 50 MB file uploads & vision</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleUpgrade('plus')}
              className="mt-6 w-full py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              {currentPlan === 'plus' ? 'Current Plan' : 'Upgrade to Plus'}
            </button>
          </div>

          {/* Pro Plan */}
          <div className="rounded-2xl p-5 border border-[#E6E6E8] dark:border-[#2A2A2D] bg-neutral-50/40 dark:bg-[#1A1A1D] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6B70] dark:text-[#A1A1A6]">
                  MINDLY Pro
                </span>
                <Sparkles size={15} className="text-indigo-500" />
              </div>
              <div className="text-2xl font-bold mt-2 text-[#0D0D0D] dark:text-[#F5F5F5]">
                {billingCycle === 'monthly' ? '$32' : '$24'}
                <span className="text-xs font-normal text-neutral-500"> / month</span>
              </div>
              <p className="text-xs text-[#6B6B70] dark:text-[#A1A1A6] mt-1 mb-4">
                Unlimited capabilities with step-by-step Think model and HD renders.
              </p>

              <ul className="space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                <li className="flex items-center space-x-2">
                  <Check size={14} className="text-emerald-500 shrink-0" />
                  <span className="font-semibold">Unlimited Fast messages</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check size={14} className="text-emerald-500 shrink-0" />
                  <span>300 Pro messages / day</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check size={14} className="text-emerald-500 shrink-0" />
                  <span>HD Image models (SDXL / FLUX dev)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check size={14} className="text-emerald-500 shrink-0" />
                  <span>MINDLY Think step-by-step reasoning</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check size={14} className="text-emerald-500 shrink-0" />
                  <span>Up to 200 MB files & pgvector RAG</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleUpgrade('pro')}
              className="mt-6 w-full py-2.5 rounded-xl border border-neutral-900 dark:border-white text-xs font-semibold hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 transition-colors"
            >
              {currentPlan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
            </button>
          </div>
        </div>

        {/* Security / Terms footer */}
        <div className="mt-6 pt-4 border-t border-[#E6E6E8] dark:border-[#2A2A2D] flex flex-wrap items-center justify-between text-[11px] text-[#6B6B70] dark:text-[#A1A1A6]">
          <span>Cancel anytime. 14-day refund guarantee.</span>
          <span>Encrypted payment processing • No AI training on user data</span>
        </div>
      </div>
    </div>
  );
}
