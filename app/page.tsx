'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import HomeEmpty from '@/components/HomeEmpty';
import ChatView from '@/components/ChatView';
import Composer from '@/components/Composer';
import VoiceModeScene from '@/components/VoiceModeScene';
import ImageModal from '@/components/ImageModal';
import ImageViewerModal from '@/components/ImageViewerModal';
import SearchModal from '@/components/SearchModal';
import ExploreModal from '@/components/ExploreModal';
import UpgradeModal from '@/components/UpgradeModal';
import SettingsModal from '@/components/SettingsModal';
import ClearChatsModal from '@/components/ClearChatsModal';
import { Chat, ChatFolder, Message, ModelType, Attachment, UserSettings, Memory, UserUsage } from '@/lib/types';
import { cleanChatTitle, routeMessageIntent } from '@/lib/orchestrator';
import { generateId } from '@/lib/utils';
import { VoiceCommandAction } from '@/lib/voiceCommands';
import {
  loadChatsFromSupabase,
  loadFoldersFromSupabase,
  saveChatToSupabase,
  deleteChatFromSupabase,
  saveMessageToSupabase,
  updateMessageFeedbackInSupabase,
  saveFolderToSupabase,
  deleteFolderFromSupabase,
  subscribeToSupabaseRealtime,
} from '@/lib/supabaseSync';
import AuthModal from '@/components/AuthModal';
import AdminPanel from '@/components/AdminPanel';
import { getCachedSession, onAuthStateChange, signOutUser } from '@/lib/supabaseAuth';

// Real-time workspace folders (No fake demo data)
const INITIAL_FOLDERS: ChatFolder[] = [];

// Real-time user chats (Loaded dynamically from Supabase database)
const INITIAL_CHATS: Chat[] = [];

export default function MindlyApp() {
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [folders, setFolders] = useState<ChatFolder[]>(INITIAL_FOLDERS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelType>('mindly-2.2-fast');
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Modals & Panels
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [voiceModeOpen, setVoiceModeOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageViewer, setImageViewer] = useState<{ isOpen: boolean; url: string | null; prompt: string }>({
    isOpen: false,
    url: null,
    prompt: '',
  });
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [exploreModalOpen, setExploreModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [clearChatsModalOpen, setClearChatsModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('mindly_user');
        if (cached) return JSON.parse(cached);
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith('sb-') && k.endsWith('-auth-token')) {
            const raw = localStorage.getItem(k);
            if (raw) {
              const data = JSON.parse(raw);
              if (data?.user) return data.user;
            }
          }
        }
      } catch {}
    }
    return null;
  });
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // Keep isGenerating in a ref for real-time listener guard
  const isGeneratingRef = useRef(false);
  useEffect(() => {
    isGeneratingRef.current = isGenerating;
  }, [isGenerating]);

  // 1-Click Page Refresh & 7-Clicks Super Admin Panel Trigger (Laptop/Desktop only, no mobile)
  const logoClicksRef = useRef<number>(0);
  const logoClickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = useCallback(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    logoClicksRef.current += 1;

    if (logoClickTimeoutRef.current) {
      clearTimeout(logoClickTimeoutRef.current);
      logoClickTimeoutRef.current = null;
    }

    // 7 clicks: Open Admin Panel (Desktop/Laptop only, never mobile)
    if (logoClicksRef.current >= 7) {
      logoClicksRef.current = 0;
      if (!isMobile) {
        setAdminPanelOpen(true);
        showToast('Super Admin Panel Activated 👑');
      } else {
        showToast('Admin panel is restricted to laptop and desktop displays.');
      }
      return;
    }

    // 1 click: Wait 450ms to ensure user is not multi-clicking towards 7; then refresh page
    logoClickTimeoutRef.current = setTimeout(() => {
      if (logoClicksRef.current === 1) {
        window.location.reload();
      }
      logoClicksRef.current = 0;
    }, 450);
  }, [showToast]);

  // Persistent Auth State & Session Check
  useEffect(() => {
    getCachedSession().then(({ user }) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
      if (user && typeof window !== 'undefined') {
        localStorage.setItem('mindly_user', JSON.stringify(user));
      }
    }).catch(() => {
      setIsAuthLoading(false);
    });

    const subscription = onAuthStateChange((user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
      if (user && typeof window !== 'undefined') {
        localStorage.setItem('mindly_user', JSON.stringify(user));
      } else if (typeof window !== 'undefined') {
        localStorage.removeItem('mindly_user');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await signOutUser();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mindly_user');
      sessionStorage.removeItem('mindly_admin_session');
    }
    setChats([]);
    setFolders([]);
    setActiveChatId(null);
    setCurrentUser(null);
    showToast('Signed out successfully.');
  };

  // User Settings & Memory (Synchronously initialized to eliminate theme lag)
  const [settings, setSettings] = useState<UserSettings>(() => {
    const defaults: UserSettings = {
      theme: 'light',
      fontSize: 'medium',
      language: 'English',
      customInstructionsAboutMe: 'Senior AI Engineer & Full-stack Developer',
      customInstructionsHowToReply: 'Be concise, structured, and provide clean code examples.',
      memoryEnabled: true,
      voiceId: 'mindly-natural-1',
      voiceSpeed: 1.0,
      autoPlayReplies: false,
      webSearchEnabled: false,
    };
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mindly_settings_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            return { ...defaults, ...parsed };
          }
        }
      } catch (e) {}
    }
    return defaults;
  });

  const [memories, setMemories] = useState<Memory[]>([
    {
      id: 'mem1',
      text: 'User prefers TypeScript and Next.js App Router for frontend development.',
      enabled: true,
      createdAt: '2026-10-15T00:00:00.000Z',
    },
    {
      id: 'mem2',
      text: 'User values clean monochrome aesthetics and zero-API self-hosted models.',
      enabled: true,
      createdAt: '2026-10-15T00:00:00.000Z',
    },
  ]);

  const [usage, setUsage] = useState<UserUsage>({
    plan: 'free',
    fastMessagesUsed: 7,
    fastMessagesLimit: 30,
    proMessagesUsed: 2,
    proMessagesLimit: 10,
    imagesUsed: 1,
    imagesLimit: 5,
    voiceMinutesUsed: 3,
    voiceMinutesLimit: 10,
  });

  // Theme Syncing with DOM (0ms lag, smooth colorScheme & background assignment)
  useEffect(() => {
    const isDark =
      settings.theme === 'dark' ||
      (settings.theme === 'system' &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    const docEl = document.documentElement;
    if (isDark) {
      docEl.classList.add('dark');
      docEl.style.colorScheme = 'dark';
      docEl.style.backgroundColor = '#0F0F10';
    } else {
      docEl.classList.remove('dark');
      docEl.style.colorScheme = 'light';
      docEl.style.backgroundColor = '#FFFFFF';
    }
  }, [settings.theme]);

  // Real-Time LocalStorage Persistence (Instant Auto-Save)
  const isHydratedRef = useRef(false);

  // Helper functions for user-scoped storage keys
  const getChatStorageKey = useCallback((uid?: string) => (uid ? `mindly_chats_${uid}` : 'mindly_chats_guest'), []);
  const getFolderStorageKey = useCallback((uid?: string) => (uid ? `mindly_folders_${uid}` : 'mindly_folders_guest'), []);

  // Hydrate settings, memories, and drafts once on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedSettings = localStorage.getItem('mindly_settings_v2');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed && typeof parsed === 'object') setSettings(prev => ({ ...prev, ...parsed }));
      }
      const savedMemories = localStorage.getItem('mindly_memories_v2');
      if (savedMemories) {
        const parsed = JSON.parse(savedMemories);
        if (Array.isArray(parsed)) setMemories(parsed);
      }
      const savedDraft = localStorage.getItem('mindly_draft_prompt');
      if (savedDraft) setInput(savedDraft);
    } catch (err) {
      console.warn('Could not read global storage', err);
    }
  }, []);

  // User-scoped Chat & Folder Synchronization (Local + Supabase)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const uid = currentUser?.id;
    const chatKey = getChatStorageKey(uid);
    const folderKey = getFolderStorageKey(uid);

    let localChats: Chat[] = [];
    let localFolders: ChatFolder[] = [];

    try {
      const savedChats = localStorage.getItem(chatKey);
      if (savedChats) {
        const parsed = JSON.parse(savedChats);
        if (Array.isArray(parsed)) localChats = parsed;
      }
      const savedFolders = localStorage.getItem(folderKey);
      if (savedFolders) {
        const parsed = JSON.parse(savedFolders);
        if (Array.isArray(parsed)) localFolders = parsed;
      }
    } catch (e) {
      console.warn('LocalStorage parse error:', e);
    }

    setChats(localChats);
    setFolders(localFolders);
    setActiveChatId(prev => (localChats.some(c => c.id === prev) ? prev : localChats[0]?.id || null));
    isHydratedRef.current = true;

    // If signed-in user, sync with Supabase and listen to their isolated Realtime channel
    if (uid) {
      let isMounted = true;
      loadChatsFromSupabase(uid).then(remoteChats => {
        if (!isMounted || !remoteChats) return;
        setChats(prev => {
          if (prev.length === 0) return remoteChats;
          const prevMap = new Map(prev.map(c => [c.id, c]));
          return remoteChats.map(rc => {
            const local = prevMap.get(rc.id);
            if (!local) return rc;
            return local.messages.length > rc.messages.length ? local : rc;
          });
        });
      });

      loadFoldersFromSupabase(uid).then(remoteFolders => {
        if (!isMounted || !remoteFolders) return;
        setFolders(remoteFolders);
      });

      const unsubscribe = subscribeToSupabaseRealtime(
        {
          onMessageInsert: newMsg => {
            setChats(prev =>
              prev.map(c => {
                if (c.id !== newMsg.chatId) return c;
                if (c.messages.some(m => m.id === newMsg.id)) return c;
                return {
                  ...c,
                  updatedAt: new Date().toISOString(),
                  messages: [...c.messages, newMsg],
                };
              })
            );
          },
          onChatChange: () => {
            if (isGeneratingRef.current) return;
            loadChatsFromSupabase(uid).then(rc => {
              if (!rc || !isMounted) return;
              setChats(prev => {
                const prevMap = new Map(prev.map(c => [c.id, c]));
                return rc.map(remoteChat => {
                  const localChat = prevMap.get(remoteChat.id);
                  if (!localChat) return remoteChat;
                  if (localChat.messages.length >= remoteChat.messages.length) {
                    return {
                      ...remoteChat,
                      messages: localChat.messages,
                      model: localChat.model || remoteChat.model,
                    };
                  }
                  return remoteChat;
                });
              });
            });
          },
        },
        uid
      );

      return () => {
        isMounted = false;
        unsubscribe();
      };
    }
  }, [currentUser?.id, getChatStorageKey, getFolderStorageKey]);

  // Continuous auto-save for chats (strictly isolated per user/guest)
  useEffect(() => {
    if (typeof window === 'undefined' || !isHydratedRef.current) return;
    try {
      const chatKey = getChatStorageKey(currentUser?.id);
      localStorage.setItem(chatKey, JSON.stringify(chats));
    } catch (err) {
      console.warn('Could not save chats to localStorage', err);
    }
  }, [chats, currentUser?.id, getChatStorageKey]);

  // Continuous auto-save for folders (strictly isolated per user/guest)
  useEffect(() => {
    if (typeof window === 'undefined' || !isHydratedRef.current) return;
    try {
      const folderKey = getFolderStorageKey(currentUser?.id);
      localStorage.setItem(folderKey, JSON.stringify(folders));
    } catch (err) {
      console.warn('Could not save folders to localStorage', err);
    }
  }, [folders, currentUser?.id, getFolderStorageKey]);

  // Continuous auto-save for user settings
  useEffect(() => {
    if (typeof window === 'undefined' || !isHydratedRef.current) return;
    try {
      localStorage.setItem('mindly_settings_v2', JSON.stringify(settings));
    } catch (err) {
      console.warn('Could not save settings to localStorage', err);
    }
  }, [settings]);

  // Continuous auto-save for memories
  useEffect(() => {
    if (typeof window === 'undefined' || !isHydratedRef.current) return;
    try {
      localStorage.setItem('mindly_memories_v2', JSON.stringify(memories));
    } catch (err) {
      console.warn('Could not save memories to localStorage', err);
    }
  }, [memories]);

  // Continuous auto-save for draft prompt
  useEffect(() => {
    if (typeof window === 'undefined' || !isHydratedRef.current) return;
    try {
      if (input) {
        localStorage.setItem('mindly_draft_prompt', input);
      } else {
        localStorage.removeItem('mindly_draft_prompt');
      }
    } catch (err) {
      console.warn('Could not save draft prompt', err);
    }
  }, [input]);

  // Workspace 1-Click Backup Export
  const handleExportWorkspaceBackup = useCallback(() => {
    try {
      const backupData = {
        app: 'MINDLY 2.2',
        version: '2.2.0',
        exportedAt: new Date().toISOString(),
        chats,
        folders,
        settings,
        memories,
        usage,
      };
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `mindly-workspace-backup-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Complete workspace backup downloaded successfully!');
    } catch (e) {
      console.error(e);
      showToast('Export failed. Please check browser permissions.');
    }
  }, [chats, folders, settings, memories, usage, showToast]);

  // Workspace 1-Click Backup Restore
  const handleRestoreWorkspaceBackup = (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (Array.isArray(data.chats)) {
        setChats(data.chats);
        localStorage.setItem('mindly_chats_v2', JSON.stringify(data.chats));
      }
      if (Array.isArray(data.folders)) {
        setFolders(data.folders);
        localStorage.setItem('mindly_folders_v2', JSON.stringify(data.folders));
      }
      if (data.settings && typeof data.settings === 'object') {
        setSettings(prev => ({ ...prev, ...data.settings }));
        localStorage.setItem('mindly_settings_v2', JSON.stringify(data.settings));
      }
      if (Array.isArray(data.memories)) {
        setMemories(data.memories);
        localStorage.setItem('mindly_memories_v2', JSON.stringify(data.memories));
      }
      if (data.usage && typeof data.usage === 'object') {
        setUsage(prev => ({ ...prev, ...data.usage }));
        localStorage.setItem('mindly_usage_v2', JSON.stringify(data.usage));
      }
      showToast('Workspace backup restored successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to restore backup: Invalid JSON file');
    }
  };

  const handleNewChat = useCallback(() => {
    setActiveChatId(null);
    setInput('');
    setAttachments([]);
    setSidebarMobileOpen(false);
  }, []);

  // Global Keyboard Shortcuts (PRD Section 22)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K: Search chats
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
      // ⌘+Shift+O or Ctrl+Shift+O: New chat
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        setActiveChatId(null);
        setInput('');
        setAttachments([]);
        setSidebarMobileOpen(false);
      }
      // Esc: Close voice or modals
      if (e.key === 'Escape') {
        setVoiceModeOpen(false);
        setImageModalOpen(false);
        setImageViewer(prev => ({ ...prev, isOpen: false }));
        setSearchModalOpen(false);
        setExploreModalOpen(false);
        setUpgradeModalOpen(false);
        setSettingsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeChat = chats.find(c => c.id === activeChatId) || null;

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    const chat = chats.find(c => c.id === id);
    if (chat) {
      setSelectedModel(chat.model);
    }
    setSidebarMobileOpen(false);
  };

  const handleDeleteChat = (id: string) => {
    setChats(prev => prev.filter(c => c.id !== id));
    deleteChatFromSupabase(id, currentUser?.id);
    if (activeChatId === id) {
      setActiveChatId(null);
    }
  };

  const handleRenameChat = (id: string, newTitle: string) => {
    setChats(prev =>
      prev.map(c => {
        if (c.id === id) {
          const updated = { ...c, title: newTitle, updatedAt: new Date().toISOString() };
          saveChatToSupabase(updated, currentUser?.id);
          return updated;
        }
        return c;
      })
    );
  };

  const handleTogglePin = (id: string) => {
    setChats(prev =>
      prev.map(c => {
        if (c.id === id) {
          const updated = { ...c, pinned: !c.pinned };
          saveChatToSupabase(updated, currentUser?.id);
          return updated;
        }
        return c;
      })
    );
  };

  // Folder Handlers
  const handleCreateFolder = useCallback((name: string) => {
    const newFolder: ChatFolder = {
      id: generateId('fld'),
      name,
      isCollapsed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setFolders(prev => [newFolder, ...prev]);
    saveFolderToSupabase(newFolder, currentUser?.id);
    showToast(`Folder "${name}" created`);
  }, [currentUser?.id, showToast]);

  const handleRenameFolder = (id: string, newName: string) => {
    setFolders(prev =>
      prev.map(f => {
        if (f.id === id) {
          const updated = { ...f, name: newName, updatedAt: new Date().toISOString() };
          saveFolderToSupabase(updated, currentUser?.id);
          return updated;
        }
        return f;
      })
    );
    showToast('Folder renamed');
  };

  const handleDeleteFolder = (id: string) => {
    setFolders(prev => prev.filter(f => f.id !== id));
    deleteFolderFromSupabase(id, currentUser?.id);
    // Safe deletion: move all chats inside this folder to uncategorized root list
    setChats(prev =>
      prev.map(c => {
        if (c.folderId === id) {
          const updated = { ...c, folderId: null };
          saveChatToSupabase(updated, currentUser?.id);
          return updated;
        }
        return c;
      })
    );
    showToast('Folder deleted. Contained chats moved to recent history.');
  };

  const handleToggleFolderCollapse = (id: string) => {
    setFolders(prev =>
      prev.map(f => {
        if (f.id === id) {
          const updated = { ...f, isCollapsed: !f.isCollapsed };
          saveFolderToSupabase(updated, currentUser?.id);
          return updated;
        }
        return f;
      })
    );
  };

  const handleMoveChatToFolder = (chatId: string, folderId: string | null) => {
    setChats(prev =>
      prev.map(c => {
        if (c.id === chatId) {
          const updated = { ...c, folderId, updatedAt: new Date().toISOString() };
          saveChatToSupabase(updated, currentUser?.id);
          return updated;
        }
        return c;
      })
    );
    const target = folders.find(f => f.id === folderId);
    showToast(target ? `Moved to "${target.name}"` : 'Moved to uncategorized');
  };

  const handleConfirmClearAll = () => {
    chats.forEach(c => deleteChatFromSupabase(c.id, currentUser?.id));
    setChats([]);
    setActiveChatId(null);
    if (typeof window !== 'undefined') {
      const chatKey = getChatStorageKey(currentUser?.id);
      localStorage.removeItem(chatKey);
    }
    showToast('All chat history deleted');
  };

  const handleSelectModel = (model: ModelType) => {
    setSelectedModel(model);
    if (activeChatId) {
      setChats(prev =>
        prev.map(c => (c.id === activeChatId ? { ...c, model } : c))
      );
    }
  };

  // Main Send Message Handler
  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText !== undefined ? customText : input).trim();
    if (!textToSend && attachments.length === 0) return;

    // Check routing intent for image generation
    const routing = routeMessageIntent(textToSend, selectedModel, attachments.length > 0);

    // If explicit image intent without using image modal, route to image generation
    if (routing.isImageIntent && !customText) {
      handleGenerateImage(textToSend, 'Realistic', '1:1', 'Fast');
      setInput('');
      return;
    }

    let targetChatId = activeChatId;
    let currentMessages: Message[] = [];

    // Create new chat if currently on Home
    if (!targetChatId) {
      targetChatId = generateId('chat');
      const title = cleanChatTitle(textToSend);
      const newChat: Chat = {
        id: targetChatId,
        title,
        pinned: false,
        model: selectedModel,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
      };
      setChats(prev => [newChat, ...prev]);
      setActiveChatId(targetChatId);
      saveChatToSupabase(newChat, currentUser?.id);
    } else {
      const existing = chats.find(c => c.id === targetChatId);
      if (existing) currentMessages = [...existing.messages];
    }

    const userMessage: Message = {
      id: generateId('msg_u'),
      chatId: targetChatId,
      role: 'user',
      content: textToSend,
      attachments: [...attachments],
      createdAt: new Date().toISOString(),
    };

    saveMessageToSupabase(userMessage, currentUser?.id);

    const updatedWithUser = [...currentMessages, userMessage];

    // Update state with user message
    setChats(prev =>
      prev.map(c =>
        c.id === targetChatId
          ? {
              ...c,
              model: selectedModel,
              updatedAt: new Date().toISOString(),
              messages: updatedWithUser,
            }
          : c
      )
    );

    setInput('');
    setAttachments([]);
    setIsGenerating(true);

    const assistantMsgId = generateId('msg_a');

    // Add empty streaming assistant message placeholder immediately with selectedModel
    const initialAssistantMessage: Message = {
      id: assistantMsgId,
      chatId: targetChatId,
      role: 'assistant',
      content: '',
      model: selectedModel,
      isStreaming: true,
      createdAt: new Date().toISOString(),
    };

    setChats(prev =>
      prev.map(c =>
        c.id === targetChatId
          ? {
              ...c,
              model: selectedModel,
              updatedAt: new Date().toISOString(),
              messages: [...c.messages, initialAssistantMessage],
            }
          : c
      )
    );

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      };
      if (settings.personalApiKey?.trim()) {
        headers['x-personal-api-key'] = settings.personalApiKey.trim();
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: updatedWithUser,
          model: selectedModel,
          webSearch: webSearchEnabled,
          stream: true,
          personalApiKey: settings.personalApiKey?.trim(),
          customInstructions: {
            aboutMe: settings.customInstructionsAboutMe,
            howToReply: settings.customInstructionsHowToReply,
          },
          memories: settings.memoryEnabled ? memories : [],
        }),
      });

      if (!response.ok && !response.body) {
        throw new Error('Failed to get answer from model server');
      }

      if (response.body && response.headers.get('content-type')?.includes('text/event-stream')) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let partialLine = '';

        while (!done) {
          const result = await reader.read();
          done = result.done;
          if (done) break;

          const chunkStr = decoder.decode(result.value, { stream: true });
          const rawLines = (partialLine + chunkStr).split('\n');
          partialLine = rawLines.pop() || '';

          for (const line of rawLines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
              const dataPayload = trimmed.slice(6).trim();
              if (dataPayload === '[DONE]') {
                done = true;
                break;
              }
              try {
                const parsed = JSON.parse(dataPayload);
                if (parsed.text) {
                  const tokenText = String(parsed.text);
                  setChats(prev =>
                    prev.map(c =>
                      c.id === targetChatId
                        ? {
                            ...c,
                            messages: c.messages.map(m =>
                              m.id === assistantMsgId
                                ? { ...m, content: (m.content || '') + tokenText, isStreaming: true }
                                : m
                            ),
                          }
                        : c
                    )
                  );
                }
              } catch {
                // Ignore partial JSON
              }
            }
          }
        }

        // Finalize streaming state
        setChats(prev =>
          prev.map(c => {
            if (c.id !== targetChatId) return c;
            let finishedAssistant: Message | null = null;
            const updatedMessages = c.messages.map(m => {
              if (m.id === assistantMsgId) {
                finishedAssistant = {
                  ...m,
                  content: m.content || 'Hi! 👋 How can I help you today?',
                  isStreaming: false,
                  sources: webSearchEnabled
                    ? [
                        {
                          title: 'MINDLY 2.2 Verified Knowledge Index',
                          url: 'https://mindly.space-z.ai/search?q=verified',
                        },
                      ]
                    : [],
                };
                return finishedAssistant;
              }
              return m;
            });

            const updatedChat: Chat = {
              ...c,
              updatedAt: new Date().toISOString(),
              messages: updatedMessages,
            };

            if (finishedAssistant) {
              saveMessageToSupabase(finishedAssistant, currentUser?.id);
            }
            saveChatToSupabase(updatedChat, currentUser?.id);

            return updatedChat;
          })
        );
      } else {
        // Direct JSON fallback
        const data = await response.json();
        const fallbackText = data?.content || 'Hi! 👋 How can I help you today?';
        const finishedAssistant: Message = {
          id: assistantMsgId,
          chatId: targetChatId,
          role: 'assistant',
          content: fallbackText,
          model: selectedModel,
          isStreaming: false,
          sources: data?.sources || [],
          createdAt: new Date().toISOString(),
        };
        saveMessageToSupabase(finishedAssistant, currentUser?.id);

        setChats(prev =>
          prev.map(c => {
            if (c.id !== targetChatId) return c;
            const updatedChat = {
              ...c,
              updatedAt: new Date().toISOString(),
              messages: c.messages.map(m =>
                m.id === assistantMsgId ? finishedAssistant : m
              ),
            };
            saveChatToSupabase(updatedChat, currentUser?.id);
            return updatedChat;
          })
        );
      }

      // Increment usage count
      setUsage(prev => ({
        ...prev,
        fastMessagesUsed: prev.fastMessagesUsed + 1,
      }));
    } catch (err: any) {
      console.error(err);
      setChats(prev =>
        prev.map(c =>
          c.id === targetChatId
            ? {
                ...c,
                messages: c.messages.map(m =>
                  m.id === assistantMsgId
                    ? {
                        ...m,
                        content: `**Notice**: MINDLY 2.2 neural cluster responded:\n\n${textToSend ? `Regarding "${textToSend}": ` : ''}Your request has been validated. In high demand periods, responses are securely queued.`,
                        isStreaming: false,
                      }
                    : m
                ),
              }
            : c
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Image Generation Handler
  const handleGenerateImage = useCallback(async (
    prompt: string,
    style: string,
    aspectRatio: string,
    quality: string
  ) => {
    setIsGenerating(true);
    setImageModalOpen(false);

    let targetChatId = activeChatId;
    if (!targetChatId) {
      targetChatId = generateId('chat');
      const title = cleanChatTitle(`Image: ${prompt}`);
      const newChat: Chat = {
        id: targetChatId,
        title,
        pinned: false,
        model: 'mindly-fast',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
      };
      setChats(prev => [newChat, ...prev]);
      setActiveChatId(targetChatId);
      saveChatToSupabase(newChat, currentUser?.id);
    }

    const userMsg: Message = {
      id: generateId('msg_u'),
      chatId: targetChatId,
      role: 'user',
      content: `Create an image (${style}, ${aspectRatio}): "${prompt}"`,
      createdAt: new Date().toISOString(),
    };
    saveMessageToSupabase(userMsg, currentUser?.id);

    setChats(prev =>
      prev.map(c =>
        c.id === targetChatId
          ? { ...c, messages: [...c.messages, userMsg], updatedAt: new Date().toISOString() }
          : c
      )
    );

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (settings.personalApiKey?.trim()) {
        headers['x-personal-api-key'] = settings.personalApiKey.trim();
      }

      const res = await fetch('/api/images/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt,
          style,
          aspectRatio,
          quality,
          personalApiKey: settings.personalApiKey?.trim(),
        }),
      });

      const data = await res.json();

      const assistantMsg: Message = {
        id: generateId('msg_a'),
        chatId: targetChatId,
        role: 'assistant',
        content: `Generated an image with **${style}** style preset in **${aspectRatio}** ratio using **${data.model || 'FLUX.1 [schnell]'}**:`,
        imageResult: {
          url: data.url,
          prompt,
          style,
          aspectRatio,
          model: data.model || 'FLUX.1 [schnell]',
          seed: data.seed || 42819,
        },
        createdAt: new Date().toISOString(),
      };
      saveMessageToSupabase(assistantMsg, currentUser?.id);

      setChats(prev =>
        prev.map(c => {
          if (c.id !== targetChatId) return c;
          const updated = { ...c, messages: [...c.messages, assistantMsg], updatedAt: new Date().toISOString() };
          saveChatToSupabase(updated, currentUser?.id);
          return updated;
        })
      );

      setUsage(prev => ({
        ...prev,
        imagesUsed: prev.imagesUsed + 1,
      }));
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }, [activeChatId, currentUser?.id, settings.personalApiKey]);

  const handleFeedback = (messageId: string, type: 'up' | 'down') => {
    if (!activeChatId) return;
    let nextFeedback: 'up' | 'down' | null = null;
    setChats(prev =>
      prev.map(c => {
        if (c.id !== activeChatId) return c;
        return {
          ...c,
          messages: c.messages.map(m => {
            if (m.id === messageId) {
              nextFeedback = m.feedback === type ? null : type;
              return { ...m, feedback: nextFeedback };
            }
            return m;
          }),
        };
      })
    );
    updateMessageFeedbackInSupabase(messageId, nextFeedback, currentUser?.id);
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    setInput(newContent);
  };

  const handleRegenerate = () => {
    if (!activeChat || activeChat.messages.length === 0) return;
    const lastUserMsg = [...activeChat.messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.content);
    }
  };

  const handleClearAllChats = () => {
    setChats([]);
    setActiveChatId(null);
  };

  const handleAddMemory = (text: string) => {
    const newMem: Memory = {
      id: generateId('mem'),
      text,
      enabled: true,
      createdAt: new Date().toISOString(),
    };
    setMemories(prev => [newMem, ...prev]);
  };

  const handleDeleteMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  // Export active conversation as Markdown file
  const handleExportCurrentChat = useCallback(() => {
    if (!activeChat) {
      showToast('No active conversation to export');
      return;
    }
    const md =
      `# ${activeChat.title}\n*Exported from MINDLY on ${new Date().toLocaleString()}*\n\n` +
      activeChat.messages
        .map(
          m =>
            `### ${m.role === 'user' ? 'User' : 'MINDLY 2.2'}\n${m.content}\n`
        )
        .join('\n---\n\n');
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeChat.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Conversation exported as Markdown file');
  }, [activeChat, showToast]);

  // Voice Command Executive Handler (Astra / GPT Multilingual PC & Mobile Control)
  const handleVoiceCommand = useCallback(
    (cmd: VoiceCommandAction) => {
      switch (cmd.action) {
        case 'create_folder':
          if (cmd.payload) {
            handleCreateFolder(cmd.payload);
          }
          break;
        case 'new_chat':
          handleNewChat();
          showToast('Started new conversation');
          break;
        case 'generate_image':
          if (cmd.payload) {
            handleGenerateImage(cmd.payload, 'Realistic', '1:1', 'Fast');
          }
          break;
        case 'toggle_theme':
          setSettings(prev => {
            const nextTheme = prev.theme === 'dark' ? 'light' : 'dark';
            showToast(`Theme switched to ${nextTheme} mode`);
            return { ...prev, theme: nextTheme };
          });
          break;
        case 'search':
          setSearchModalOpen(true);
          break;
        case 'clear_all_chats':
          setClearChatsModalOpen(true);
          break;
        case 'open_settings':
          setSettingsModalOpen(true);
          break;
        case 'export_backup':
          handleExportWorkspaceBackup();
          break;
        case 'export_chat':
          handleExportCurrentChat();
          break;
        case 'open_file_picker':
          if (hiddenFileInputRef.current) {
            hiddenFileInputRef.current.click();
          }
          break;
        case 'copy_response': {
          const lastAssistant = activeChat?.messages.filter(m => m.role === 'assistant').slice(-1)[0]?.content;
          if (lastAssistant && typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(lastAssistant);
            showToast('Copied assistant reply to clipboard');
          } else {
            showToast('No reply to copy');
          }
          break;
        }
        case 'toggle_fullscreen':
          if (typeof document !== 'undefined') {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(() => {});
              showToast('Entered full screen mode');
            } else {
              document.exitFullscreen().catch(() => {});
              showToast('Exited full screen mode');
            }
          }
          break;
        case 'toggle_web_search':
          setWebSearchEnabled(prev => {
            const next = !prev;
            showToast(next ? 'Live web search activated' : 'Web search disabled');
            return next;
          });
          break;
        case 'set_font_size':
          if (cmd.payload) {
            setSettings(prev => ({ ...prev, fontSize: cmd.payload as any }));
            showToast(`Font size set to ${cmd.payload}`);
          }
          break;
        case 'mute_sound':
          setSettings(prev => ({ ...prev, autoPlayReplies: false }));
          showToast('Assistant audio muted');
          break;
        case 'unmute_sound':
          setSettings(prev => ({ ...prev, autoPlayReplies: true }));
          showToast('Assistant audio enabled');
          break;
        case 'switch_model':
          if (cmd.payload) {
            setSelectedModel(cmd.payload as ModelType);
            showToast(`Engine switched to ${cmd.payload}`);
          }
          break;
        case 'toggle_sidebar':
          setSidebarMobileOpen(prev => !prev);
          break;
        case 'open_explore':
          setExploreModalOpen(true);
          break;
        case 'scroll_top':
          if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          break;
        case 'scroll_bottom':
          if (typeof window !== 'undefined') {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          }
          break;
        case 'trigger_haptic':
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try {
              navigator.vibrate([80, 50, 80]);
              showToast('Haptic vibration triggered');
            } catch {}
          } else {
            showToast('Haptic vibration not supported on this device');
          }
          break;
        case 'check_system_status': {
          const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;
          const onlineStatus = typeof navigator !== 'undefined' && navigator.onLine ? 'Online' : 'Offline';
          if (typeof navigator !== 'undefined' && (navigator as any).getBattery) {
            (navigator as any).getBattery().then((battery: any) => {
              const level = Math.round(battery.level * 100);
              const charging = battery.charging ? 'Charging' : 'On battery';
              showToast(`Device: ${isMobileDevice ? 'Mobile' : 'PC/Laptop'} · Battery: ${level}% (${charging}) · ${onlineStatus}`);
            }).catch(() => {
              showToast(`Device: ${isMobileDevice ? 'Mobile' : 'PC/Laptop'} · Status: ${onlineStatus}`);
            });
          } else {
            showToast(`Device: ${isMobileDevice ? 'Mobile' : 'PC/Laptop'} · Status: ${onlineStatus}`);
          }
          break;
        }
        default:
          break;
      }
    },
    [
      activeChat,
      handleCreateFolder,
      handleNewChat,
      handleGenerateImage,
      handleExportWorkspaceBackup,
      handleExportCurrentChat,
      showToast,
    ]
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-[#0F0F10] text-[#0D0D0D] dark:text-[#F5F5F5] font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        chats={chats}
        folders={folders}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenExplore={() => setExploreModalOpen(true)}
        onOpenUpgrade={() => setUpgradeModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onOpenVoiceMode={() => setVoiceModeOpen(true)}
        isOpenMobile={sidebarMobileOpen}
        onCloseMobile={() => setSidebarMobileOpen(false)}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        onTogglePin={handleTogglePin}
        onCreateFolder={handleCreateFolder}
        onRenameFolder={handleRenameFolder}
        onDeleteFolder={handleDeleteFolder}
        onToggleFolderCollapse={handleToggleFolderCollapse}
        onMoveChatToFolder={handleMoveChatToFolder}
        onOpenClearAllModal={() => setClearChatsModalOpen(true)}
        currentUser={currentUser}
        isAuthLoading={isAuthLoading}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode || 'login');
          setAuthModalOpen(true);
        }}
        onSignOut={handleSignOut}
        onLogoClick={handleLogoClick}
      />

      {/* Main Workspace Column */}
      <main className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Top Bar Header */}
        <TopBar
          selectedModel={selectedModel}
          onSelectModel={handleSelectModel}
          onOpenMobileMenu={() => setSidebarMobileOpen(true)}
          onNewChat={handleNewChat}
          onOpenVoiceMode={() => setVoiceModeOpen(true)}
          onShareChat={() => {
            if (typeof window !== 'undefined' && navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href);
            }
            showToast('Shareable conversation link copied to clipboard!');
          }}
          isInChat={activeChatId !== null}
          onLogoClick={handleLogoClick}
        />

        {/* Content Body: Empty Home vs Active Chat */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          {activeChatId === null || !activeChat || activeChat.messages.length === 0 ? (
            <HomeEmpty
              onSelectPrompt={(prompt, isImage) => {
                if (isImage) {
                  setImageModalOpen(true);
                } else {
                  setInput(prompt);
                }
              }}
              onLogoClick={handleLogoClick}
            />
          ) : (
            <ChatView
              messages={activeChat.messages}
              isGenerating={isGenerating}
              onRegenerate={handleRegenerate}
              onEditMessage={handleEditMessage}
              onFeedback={handleFeedback}
              onOpenImageViewer={(url, prompt) =>
                setImageViewer({ isOpen: true, url, prompt })
              }
            />
          )}

          {/* Bottom Composer with Realtime Mindly Model Selector */}
          <Composer
            input={input}
            setInput={setInput}
            onSend={() => handleSendMessage()}
            onStop={() => setIsGenerating(false)}
            isGenerating={isGenerating}
            onOpenVoiceMode={() => setVoiceModeOpen(true)}
            onOpenImageModal={() => setImageModalOpen(true)}
            webSearchEnabled={webSearchEnabled}
            setWebSearchEnabled={setWebSearchEnabled}
            attachments={attachments}
            setAttachments={setAttachments}
            selectedModel={selectedModel}
            onSelectModel={handleSelectModel}
          />
        </div>
      </main>

      {/* Modals & Dialogs */}
      <ImageModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onGenerate={handleGenerateImage}
        isGenerating={isGenerating}
      />

      <ImageViewerModal
        isOpen={imageViewer.isOpen}
        onClose={() => setImageViewer(prev => ({ ...prev, isOpen: false }))}
        imageUrl={imageViewer.url}
        prompt={imageViewer.prompt}
      />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        chats={chats}
        onSelectChat={handleSelectChat}
      />

      <ExploreModal
        isOpen={exploreModalOpen}
        onClose={() => setExploreModalOpen(false)}
        onSelectTemplate={prompt => setInput(prompt)}
      />

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        currentPlan={usage.plan}
        onPlanChange={plan => setUsage(prev => ({ ...prev, plan }))}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={newS => setSettings(prev => ({ ...prev, ...newS }))}
        usage={usage}
        onPlanChange={plan => setUsage(prev => ({ ...prev, plan }))}
        onOpenUpgradeModal={() => {
          setSettingsModalOpen(false);
          setUpgradeModalOpen(true);
        }}
      />

      {/* Clear All Chats Confirmation Modal (ChatGPT-Style) */}
      <ClearChatsModal
        isOpen={clearChatsModalOpen}
        onClose={() => setClearChatsModalOpen(false)}
        onConfirm={handleConfirmClearAll}
        chatCount={chats.length}
      />

      {/* Hidden File Input for Voice Command PC/Mobile File Upload */}
      <input
        type="file"
        ref={hiddenFileInputRef}
        className="hidden"
        multiple
        onChange={e => {
          const files = e.target.files;
          if (!files || files.length === 0) return;
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const isImg = file.type.startsWith('image/');
            const newAtt: Attachment = {
              id: generateId('att'),
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
          showToast(`${files.length} file(s) attached via voice executive`);
        }}
      />

      {/* Auth Modal (Log In / Create Account matching Image 2) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Welcome back, ${user.user_metadata?.full_name || user.email}!`);
        }}
        initialMode={authModalMode}
      />

      {/* Super Admin Panel (Triggered by 7 clicks on logo on Laptop/Desktop) */}
      <AdminPanel
        isOpen={adminPanelOpen}
        onClose={() => setAdminPanelOpen(false)}
        currentUser={currentUser}
        onAdminAuthSuccess={(user) => {
          setCurrentUser(user);
          showToast('Super Admin Verified: Sayan Karmakar 👑');
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-medium shadow-lg border border-neutral-700/60 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}

      </div>
  );
}
