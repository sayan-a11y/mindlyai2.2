import { supabase } from './supabaseClient';
import { Chat, ChatFolder, Message, UserSettings, UserUsage, ModelType } from './types';

/**
 * Loads all chats and their messages from Supabase
 */
export async function loadChatsFromSupabase(): Promise<Chat[] | null> {
  try {
    const { data: chatsData, error: chatsError } = await supabase
      .from('chats')
      .select('*')
      .order('updated_at', { ascending: false });

    if (chatsError) {
      console.warn('[Supabase] Error loading chats:', chatsError.message);
      return null;
    }

    if (!chatsData || chatsData.length === 0) {
      return [];
    }

    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.warn('[Supabase] Error loading messages:', messagesError.message);
    }

    const allMessages: Record<string, Message[]> = {};
    (messagesData || []).forEach(m => {
      const msg: Message = {
        id: m.id,
        chatId: m.chat_id,
        role: m.role,
        content: m.content,
        model: m.model,
        attachments: m.attachments || [],
        imageResult: m.image_result || undefined,
        sources: m.sources || [],
        feedback: m.feedback,
        createdAt: m.created_at,
      };
      if (!allMessages[m.chat_id]) {
        allMessages[m.chat_id] = [];
      }
      allMessages[m.chat_id].push(msg);
    });

    return chatsData.map(c => ({
      id: c.id,
      title: c.title,
      model: (c.model as ModelType) || 'mindly-2.2-fast',
      pinned: Boolean(c.pinned),
      folderId: c.folder_id || null,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
      messages: allMessages[c.id] || [],
    }));
  } catch (err: any) {
    console.warn('[Supabase] Exception in loadChatsFromSupabase:', err?.message);
    return null;
  }
}

/**
 * Loads folders from Supabase
 */
export async function loadFoldersFromSupabase(): Promise<ChatFolder[] | null> {
  try {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('[Supabase] Error loading folders:', error.message);
      return null;
    }

    return (data || []).map(f => ({
      id: f.id,
      name: f.name,
      isCollapsed: Boolean(f.is_collapsed),
      createdAt: f.created_at,
      updatedAt: f.updated_at,
    }));
  } catch (err: any) {
    console.warn('[Supabase] Exception in loadFoldersFromSupabase:', err?.message);
    return null;
  }
}

/**
 * Saves or updates a chat in Supabase
 */
export async function saveChatToSupabase(chat: Chat): Promise<void> {
  try {
    await supabase.from('chats').upsert(
      {
        id: chat.id,
        title: chat.title,
        model: chat.model,
        pinned: chat.pinned,
        folder_id: chat.folderId || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
  } catch (err: any) {
    console.warn('[Supabase] Save chat failed:', err?.message);
  }
}

/**
 * Deletes a chat from Supabase (cascades to messages)
 */
export async function deleteChatFromSupabase(chatId: string): Promise<void> {
  try {
    await supabase.from('chats').delete().eq('id', chatId);
  } catch (err: any) {
    console.warn('[Supabase] Delete chat failed:', err?.message);
  }
}

/**
 * Saves a message into Supabase
 */
export async function saveMessageToSupabase(message: Message): Promise<void> {
  try {
    await supabase.from('messages').upsert(
      {
        id: message.id,
        chat_id: message.chatId,
        role: message.role,
        content: message.content,
        model: message.model || null,
        attachments: message.attachments || [],
        image_result: message.imageResult || null,
        sources: message.sources || [],
        feedback: message.feedback || null,
        created_at: message.createdAt || new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
  } catch (err: any) {
    console.warn('[Supabase] Save message failed:', err?.message);
  }
}

/**
 * Updates feedback on a message
 */
export async function updateMessageFeedbackInSupabase(
  messageId: string,
  feedback: 'up' | 'down' | null
): Promise<void> {
  try {
    await supabase.from('messages').update({ feedback }).eq('id', messageId);
  } catch (err: any) {
    console.warn('[Supabase] Update feedback failed:', err?.message);
  }
}

/**
 * Saves or updates a folder in Supabase
 */
export async function saveFolderToSupabase(folder: ChatFolder): Promise<void> {
  try {
    await supabase.from('folders').upsert(
      {
        id: folder.id,
        name: folder.name,
        is_collapsed: folder.isCollapsed,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
  } catch (err: any) {
    console.warn('[Supabase] Save folder failed:', err?.message);
  }
}

/**
 * Deletes a folder from Supabase
 */
export async function deleteFolderFromSupabase(folderId: string): Promise<void> {
  try {
    await supabase.from('folders').delete().eq('id', folderId);
  } catch (err: any) {
    console.warn('[Supabase] Delete folder failed:', err?.message);
  }
}

/**
 * Subscribes to Supabase Realtime events for live multi-tab & multi-device sync
 */
export function subscribeToSupabaseRealtime(callbacks: {
  onMessageInsert?: (message: Message) => void;
  onChatChange?: () => void;
}) {
  const channel = supabase
    .channel('mindly_realtime_sync')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      payload => {
        const m = payload.new;
        if (m && callbacks.onMessageInsert) {
          callbacks.onMessageInsert({
            id: m.id,
            chatId: m.chat_id,
            role: m.role,
            content: m.content,
            model: m.model,
            attachments: m.attachments || [],
            imageResult: m.image_result || undefined,
            sources: m.sources || [],
            feedback: m.feedback,
            createdAt: m.created_at,
          });
        }
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'chats' },
      () => {
        if (callbacks.onChatChange) {
          callbacks.onChatChange();
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
