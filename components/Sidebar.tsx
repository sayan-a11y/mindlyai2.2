'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  SquarePen,
  Search,
  LayoutGrid,
  Crown,
  MoreHorizontal,
  Pin,
  Trash2,
  Edit2,
  Share2,
  Settings,
  HelpCircle,
  LogOut,
  LogIn,
  X,
} from 'lucide-react';
import { Chat, ChatFolder } from '@/lib/types';
import AppLogo from '@/components/AppLogo';

interface SidebarProps {
  chats: Chat[];
  folders?: ChatFolder[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onOpenSearch: () => void;
  onOpenExplore: () => void;
  onOpenUpgrade: () => void;
  onOpenSettings: () => void;
  onOpenVoiceMode?: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onDeleteChat: (id: string) => void;
  onRenameChat: (id: string, newTitle: string) => void;
  onTogglePin: (id: string) => void;
  onCreateFolder?: (name: string) => void;
  onRenameFolder?: (id: string, newName: string) => void;
  onDeleteFolder?: (id: string) => void;
  onToggleFolderCollapse?: (id: string) => void;
  onMoveChatToFolder?: (chatId: string, folderId: string | null) => void;
  onOpenClearAllModal: () => void;
  currentUser?: any | null;
  isAuthLoading?: boolean;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
  onSignOut?: () => void;
  onLogoClick?: () => void;
}

export default function Sidebar({
  chats,
  folders = [],
  activeChatId,
  onSelectChat,
  onNewChat,
  onOpenSearch,
  onOpenExplore,
  onOpenUpgrade,
  onOpenSettings,
  onOpenVoiceMode,
  isOpenMobile,
  onCloseMobile,
  onDeleteChat,
  onRenameChat,
  onTogglePin,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onToggleFolderCollapse,
  onMoveChatToFolder,
  onOpenClearAllModal,
  currentUser,
  isAuthLoading = false,
  onOpenAuth,
  onSignOut,
  onLogoClick,
}: SidebarProps) {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState('');

  // Group all chats directly by date timeline
  const todayChats = chats.filter(c => (c.group ? c.group === 'Today' : true));
  const yesterdayChats = chats.filter(c => c.group === 'Yesterday');
  const previous7DaysChats = chats.filter(c => c.group === 'Previous 7 days');
  const olderChats = chats.filter(c => c.group === 'Older');

  const handleStartRename = (chat: Chat) => {
    setRenamingId(chat.id);
    setRenameInput(chat.title);
    setMenuOpenId(null);
  };

  const handleFinishRename = (id: string) => {
    if (renameInput.trim()) {
      onRenameChat(id, renameInput.trim());
    }
    setRenamingId(null);
  };

  // Helper renderer for a single chat item row
  const renderChatItem = (chat: Chat, isIndented = false) => {
    const isActive = chat.id === activeChatId;

    return (
      <div
        key={chat.id}
        draggable
        onDragStart={e => {
          e.dataTransfer.setData('text/plain', chat.id);
          e.dataTransfer.effectAllowed = 'move';
        }}
        className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer ${
          isIndented ? 'ml-2 pl-2.5' : ''
        } ${
          isActive
            ? 'bg-[#EDEDEF] text-[#0D0D0D] font-medium dark:bg-[#232325] dark:text-[#F5F5F5]'
            : 'text-[#0D0D0D] hover:bg-[#F2F2F3] dark:text-[#D4D4D8] dark:hover:bg-[#1E1E22]'
        }`}
        onClick={() => {
          onSelectChat(chat.id);
          onCloseMobile();
        }}
      >
        <div className="flex items-center space-x-2.5 min-w-0 flex-1 pr-1">
          <MessageSquare size={15} className="text-[#6B6B70] dark:text-[#A1A1A6] shrink-0" />
          {renamingId === chat.id ? (
            <input
              type="text"
              value={renameInput}
              onChange={e => setRenameInput(e.target.value)}
              onBlur={() => handleFinishRename(chat.id)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleFinishRename(chat.id);
                if (e.key === 'Escape') setRenamingId(null);
              }}
              autoFocus
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-black px-1.5 py-0.5 rounded text-xs w-full border border-neutral-300 dark:border-neutral-700 outline-none"
            />
          ) : (
            <span className="truncate text-[13px] leading-snug">{chat.title}</span>
          )}
          {chat.pinned && (
            <Pin size={11} className="text-neutral-500 fill-neutral-500 shrink-0 ml-1" />
          )}
        </div>

        {/* Hover Three-dot Menu */}
        <div className="relative shrink-0">
          <button
            aria-label={`Options for ${chat.title}`}
            onClick={e => {
              e.stopPropagation();
              setMenuOpenId(menuOpenId === chat.id ? null : chat.id);
            }}
            className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 text-[#6B6B70] dark:text-[#A1A1A6] transition-opacity cursor-pointer"
          >
            <MoreHorizontal size={14} />
          </button>

          {menuOpenId === chat.id && (
            <div
              onClick={e => e.stopPropagation()}
              className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-white dark:bg-[#1C1C1F] border border-[#E6E6E8] dark:border-[#2A2A2D] shadow-xl py-1.5 z-30 text-xs"
            >
              <button
                onClick={() => {
                  onTogglePin(chat.id);
                  setMenuOpenId(null);
                }}
                className="w-full px-3 py-1.5 text-left flex items-center space-x-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
              >
                <Pin size={13} />
                <span>{chat.pinned ? 'Unpin' : 'Pin'}</span>
              </button>

              <button
                onClick={() => handleStartRename(chat)}
                className="w-full px-3 py-1.5 text-left flex items-center space-x-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
              >
                <Edit2 size={13} />
                <span>Rename</span>
              </button>

              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                  }
                  setMenuOpenId(null);
                }}
                className="w-full px-3 py-1.5 text-left flex items-center space-x-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
              >
                <Share2 size={13} />
                <span>Share</span>
              </button>

              <div className="my-1 border-t border-neutral-200 dark:border-neutral-800" />

              <button
                onClick={() => {
                  onDeleteChat(chat.id);
                  setMenuOpenId(null);
                }}
                className="w-full px-3 py-1.5 text-left flex items-center space-x-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderChatGroup = (title: string, groupChats: Chat[]) => {
    if (groupChats.length === 0) return null;
    return (
      <div className="mb-3">
        <div className="px-3 py-1 text-[12px] font-medium text-[#6B6B70] dark:text-[#A1A1A6]">
          {title}
        </div>
        <div className="space-y-0.5">
          {groupChats.map(chat => renderChatItem(chat, false))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#F7F7F8] dark:bg-[#171718] border-r border-[#E6E6E8] dark:border-[#2A2A2D] transition-transform duration-250 ease-out md:translate-x-0 w-[280px] md:static shrink-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header: Logo + MINDLY wordmark + Compose Button */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#E6E6E8]/60 dark:border-[#2A2A2D]/60">
          <div onClick={onLogoClick || onNewChat} className="cursor-pointer select-none">
            <AppLogo size="md" showWordmark={true} />
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => {
                onNewChat();
                onCloseMobile();
              }}
              aria-label="New chat compose"
              className="p-1.5 rounded-lg hover:bg-[#EDEDEF] dark:hover:bg-[#232325] text-[#0D0D0D] dark:text-[#F5F5F5] transition-colors cursor-pointer"
            >
              <SquarePen size={19} />
            </button>
            {/* Close button on mobile */}
            <button
              onClick={onCloseMobile}
              aria-label="Close sidebar drawer"
              className="p-1.5 rounded-lg hover:bg-[#EDEDEF] dark:hover:bg-[#232325] text-[#6B6B70] md:hidden cursor-pointer"
            >
              <X size={19} />
            </button>
          </div>
        </div>

        {/* Main Navigation Menu */}
        <div className="px-3 pt-3 pb-2 space-y-1">
          <button
            onClick={() => {
              onNewChat();
              onCloseMobile();
            }}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              activeChatId === null
                ? 'bg-[#EDEDEF] text-[#0D0D0D] dark:bg-[#232325] dark:text-[#F5F5F5]'
                : 'text-[#0D0D0D] hover:bg-[#EDEDEF]/60 dark:text-[#E4E4E7] dark:hover:bg-[#232325]'
            }`}
          >
            <SquarePen size={17} className="text-[#6B6B70] dark:text-[#A1A1A6]" />
            <span>New chat</span>
          </button>

          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-[#0D0D0D] hover:bg-[#EDEDEF]/60 dark:text-[#E4E4E7] dark:hover:bg-[#232325] transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <Search size={17} className="text-[#6B6B70] dark:text-[#A1A1A6]" />
              <span>Search chats</span>
            </div>
            <kbd className="hidden md:inline-block text-[11px] font-sans px-1.5 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800 text-neutral-500">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={onOpenExplore}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm text-[#0D0D0D] hover:bg-[#EDEDEF]/60 dark:text-[#E4E4E7] dark:hover:bg-[#232325] transition-colors cursor-pointer"
          >
            <LayoutGrid size={17} className="text-[#6B6B70] dark:text-[#A1A1A6]" />
            <span>Explore MINDLY</span>
          </button>

        </div>

        {/* Scrollable Center: Recent History */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          <div className="space-y-1">
            {renderChatGroup('Today', todayChats)}
            {renderChatGroup('Yesterday', yesterdayChats)}
            {renderChatGroup('Previous 7 days', previous7DaysChats)}
            {renderChatGroup('Older', olderChats)}

            {chats.length === 0 && (
              <div className="px-3 py-8 text-center text-xs text-[#9A9AA0]">
                No chats yet. Start a new chat.
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* STICKY BOTTOM SECTION */}
        {/* ======================================================== */}
        <div className="p-3 border-t border-[#E6E6E8] dark:border-[#2A2A2D] bg-[#F7F7F8] dark:bg-[#171718] space-y-2">
          {/* ChatGPT-style Clear All Chats Trigger in Sidebar */}
          {chats.length > 0 && (
            <button
              onClick={onOpenClearAllModal}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-[#6B6B70] dark:text-[#A1A1A6] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
              title="Delete all chat history"
            >
              <div className="flex items-center space-x-2">
                <Trash2 size={13} />
                <span>Clear all chats</span>
              </div>
              <span className="font-mono text-[11px] tabular-nums">
                ({chats.length})
              </span>
            </button>
          )}

          {/* Upgrade Plan button */}
          <button
            onClick={onOpenUpgrade}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-[#232325] border border-[#E6E6E8] dark:border-[#2A2A2D] hover:bg-neutral-50 dark:hover:bg-[#2a2a2d] transition-all shadow-xs cursor-pointer"
          >
            <div className="flex items-center space-x-2.5">
              <Crown size={16} className="text-amber-500" />
              <div className="text-left">
                <div className="text-xs font-semibold text-[#0D0D0D] dark:text-[#F5F5F5]">Upgrade plan</div>
                <div className="text-[11px] text-[#6B6B70] dark:text-[#A1A1A6]">Higher limits, HD models</div>
              </div>
            </div>
          </button>

          {/* Profile Row or Login Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-full flex items-center space-x-3 px-2 py-1.5 rounded-xl hover:bg-[#EDEDEF] dark:hover:bg-[#232325] transition-colors text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 uppercase">
                  {currentUser.user_metadata?.full_name
                    ? currentUser.user_metadata.full_name.slice(0, 2).toUpperCase()
                    : currentUser.email
                    ? currentUser.email.slice(0, 2).toUpperCase()
                    : 'MI'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold truncate text-[#0D0D0D] dark:text-[#F5F5F5]">
                    {currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Mindly User'}
                  </div>
                  <div className="text-[11px] text-[#6B6B70] dark:text-[#A1A1A6] truncate">
                    {currentUser.email || 'Pro Plan'}
                  </div>
                </div>
              </button>

              {/* Profile Dropdown */}
              {profileMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 rounded-2xl bg-white dark:bg-[#1C1C1F] border border-[#E6E6E8] dark:border-[#2A2A2D] shadow-xl p-1.5 z-50 text-xs">
                  <div className="px-3 py-1.5 border-b border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500 truncate">
                    {currentUser.email}
                  </div>
                  <button
                    onClick={() => {
                      onOpenSettings();
                      setProfileMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                  >
                    <Settings size={14} />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.open('https://mindly.space-z.ai/docs', '_blank');
                      }
                      setProfileMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                  >
                    <HelpCircle size={14} />
                    <span>Help & Documentation</span>
                  </button>
                  <div className="my-1 border-t border-neutral-200 dark:border-neutral-800" />
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      if (onSignOut) onSignOut();
                    }}
                    className="w-full px-3 py-2 rounded-lg flex items-center space-x-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          ) : isAuthLoading ? (
            /* Subtle skeleton matching button height to prevent any flash or flicker on refresh */
            <div className="h-[38px] w-full rounded-xl bg-neutral-200/60 dark:bg-[#1E1E22] animate-pulse" />
          ) : (
            <div className="space-y-1.5">
              <button
                onClick={() => onOpenAuth?.('login')}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl bg-[#1d68f6] hover:bg-[#1557d4] text-white font-semibold text-xs shadow-sm transition-all cursor-pointer active:scale-[0.99]"
              >
                <LogIn size={15} />
                <span>Log In / Create Account</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
