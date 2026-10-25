'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MessageSquare, ArrowRight } from 'lucide-react';
import { Chat } from '@/lib/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  chats: Chat[];
  onSelectChat: (id: string) => void;
}

export default function SearchModal({
  isOpen,
  onClose,
  chats,
  onSelectChat,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredChats = query.trim()
    ? chats.filter(c => {
        const q = query.toLowerCase();
        const titleMatch = c.title.toLowerCase().includes(q);
        const msgMatch = c.messages.some(m => m.content.toLowerCase().includes(q));
        return titleMatch || msgMatch;
      })
    : chats.slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/40 backdrop-blur-xs select-none">
      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#171718] border border-[#E6E6E8] dark:border-[#2A2A2D] shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E6E6E8] dark:border-[#2A2A2D]">
          <Search size={18} className="text-[#6B6B70] dark:text-[#A1A1A6] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search chats and messages..."
            className="flex-1 bg-transparent text-sm text-[#0D0D0D] dark:text-[#F5F5F5] placeholder-[#9A9AA0] outline-none"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400"
          >
            <X size={17} />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#6B6B70] dark:text-[#A1A1A6]">
            {query.trim() ? `Search Results (${filteredChats.length})` : 'Recent Chats'}
          </div>

          {filteredChats.length > 0 ? (
            <div className="space-y-1 mt-1">
              {filteredChats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => {
                    onSelectChat(chat.id);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-xl flex items-center justify-between hover:bg-[#EDEDEF] dark:hover:bg-[#232325] transition-colors group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <MessageSquare size={16} className="text-[#6B6B70] dark:text-[#A1A1A6] shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[#0D0D0D] dark:text-[#F5F5F5] truncate">
                        {chat.title}
                      </div>
                      <div className="text-xs text-[#6B6B70] dark:text-[#A1A1A6] truncate mt-0.5">
                        {chat.messages[chat.messages.length - 1]?.content.slice(0, 60) || 'No messages'}
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-[#9A9AA0]">
              No chats found matching &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        {/* Bottom Shortcut Hint */}
        <div className="px-4 py-2.5 bg-neutral-50 dark:bg-[#1F1F23] border-t border-[#E6E6E8] dark:border-[#2A2A2D] text-[11px] text-[#6B6B70] dark:text-[#A1A1A6] flex justify-between">
          <span>Search titles and message history</span>
          <span>Esc to exit</span>
        </div>
      </div>
    </div>
  );
}
