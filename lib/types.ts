export type ModelType =
  | 'mindly-2.2-fast'
  | 'mindly-2.2-pro'
  | 'mindly-2.2-think'
  | 'mindly-2.2-coding'
  | 'mindly-fast'
  | 'mindly-pro'
  | 'mindly-think'
  | 'mindly-coding';

export interface ModelInfo {
  id: ModelType;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  contextWindow: string;
  speed: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  base64?: string;
}

export interface Message {
  id: string;
  chatId: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;
  model?: ModelType;
  attachments?: Attachment[];
  sources?: { title: string; url: string; snippet?: string }[];
  imageResult?: {
    url: string;
    prompt: string;
    style: string;
    aspectRatio: string;
    model: string;
    seed: number;
  };
  feedback?: 'up' | 'down' | null;
  createdAt: string;
  isStreaming?: boolean;
}

export interface ChatFolder {
  id: string;
  name: string;
  color?: string;
  isCollapsed?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  id: string;
  title: string;
  pinned: boolean;
  model: ModelType;
  folderId?: string | null;
  group?: 'Today' | 'Yesterday' | 'Previous 7 days' | 'Older';
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

export interface Memory {
  id: string;
  text: string;
  sourceChatId?: string;
  enabled: boolean;
  createdAt: string;
}

export interface PromptTemplate {
  id: string;
  category: 'Writing' | 'Coding' | 'Study' | 'Business' | 'Creative' | 'Life';
  title: string;
  subtitle: string;
  prompt: string;
  isFavorite?: boolean;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  language: string;
  customInstructionsAboutMe: string;
  customInstructionsHowToReply: string;
  memoryEnabled: boolean;
  voiceId: string;
  voiceSpeed: number;
  autoPlayReplies: boolean;
  webSearchEnabled: boolean;
  personalApiKey?: string;
}

export interface UserUsage {
  plan: 'free' | 'plus' | 'pro';
  fastMessagesUsed: number;
  fastMessagesLimit: number;
  proMessagesUsed: number;
  proMessagesLimit: number;
  imagesUsed: number;
  imagesLimit: number;
  voiceMinutesUsed: number;
  voiceMinutesLimit: number;
}
