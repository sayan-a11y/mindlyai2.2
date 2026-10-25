import { supabase } from './supabaseClient';
import { Chat, ChatFolder, Message, ModelType } from './types';

/**
 * Loads chats and messages belonging ONLY to the authenticated user from Supabase
 */
export async function loadChatsFromSupabase(userId?: string): Promise<Chat[] | null> {
  try {
    let targetUserId = userId;
    if (!targetUserId) {
      const { data } = await supabase.auth.getUser();
      targetUserId = data.user?.id;
    }

    // Unauthenticated guest users do not query cloud database
    if (!targetUserId) {
      return null;
    }

    const { data: chatsData, error: chatsError } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', targetUserId)
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
      .eq('user_id', targetUserId)
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
 * Loads folders belonging ONLY to the authenticated user from Supabase
 */
export async function loadFoldersFromSupabase(userId?: string): Promise<ChatFolder[] | null> {
  try {
    let targetUserId = userId;
    if (!targetUserId) {
      const { data } = await supabase.auth.getUser();
      targetUserId = data.user?.id;
    }

    if (!targetUserId) {
      return null;
    }

    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('user_id', targetUserId)
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
 * Saves or updates a chat in Supabase scoped to the user
 */
export async function saveChatToSupabase(chat: Chat, userId?: string): Promise<void> {
  try {
    let targetUserId = userId;
    if (!targetUserId) {
      const { data } = await supabase.auth.getUser();
      targetUserId = data.user?.id;
    }

    // Guest chats stay purely in local storage
    if (!targetUserId) return;

    await supabase.from('chats').upsert(
      {
        id: chat.id,
        user_id: targetUserId,
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
 * Deletes a chat from Supabase (scoped strictly to user)
 */
export async function deleteChatFromSupabase(chatId: string, userId?: string): Promise<void> {
  try {
    let targetUserId = userId;
    if (!targetUserId) {
      const { data } = await supabase.auth.getUser();
      targetUserId = data.user?.id;
    }

    if (!targetUserId) return;

    await supabase.from('chats').delete().eq('id', chatId).eq('user_id', targetUserId);
    await supabase.from('messages').delete().eq('chat_id', chatId).eq('user_id', targetUserId);
  } catch (err: any) {
    console.warn('[Supabase] Delete chat failed:', err?.message);
  }
}

/**
 * Saves a message into Supabase scoped strictly to user
 */
export async function saveMessageToSupabase(message: Message, userId?: string): Promise<void> {
  try {
    let targetUserId = userId;
    if (!targetUserId) {
      const { data } = await supabase.auth.getUser();
      targetUserId = data.user?.id;
    }

    if (!targetUserId) return;

    await supabase.from('messages').upsert(
      {
        id: message.id,
        user_id: targetUserId,
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
  feedback: 'up' | 'down' | null,
  userId?: string
): Promise<void> {
  try {
    let targetUserId = userId;
    if (!targetUserId) {
      const { data } = await supabase.auth.getUser();
      targetUserId = data.user?.id;
    }

    let query = supabase.from('messages').update({ feedback }).eq('id', messageId);
    if (targetUserId) {
      query = query.eq('user_id', targetUserId);
    }
    await query;
  } catch (err: any) {
    console.warn('[Supabase] Update feedback failed:', err?.message);
  }
}

/**
 * Saves or updates a folder in Supabase scoped to user
 */
export async function saveFolderToSupabase(folder: ChatFolder, userId?: string): Promise<void> {
  try {
    let targetUserId = userId;
    if (!targetUserId) {
      const { data } = await supabase.auth.getUser();
      targetUserId = data.user?.id;
    }

    if (!targetUserId) return;

    await supabase.from('folders').upsert(
      {
        id: folder.id,
        user_id: targetUserId,
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
 * Deletes a folder from Supabase scoped to user
 */
export async function deleteFolderFromSupabase(folderId: string, userId?: string): Promise<void> {
  try {
    let targetUserId = userId;
    if (!targetUserId) {
      const { data } = await supabase.auth.getUser();
      targetUserId = data.user?.id;
    }

    if (!targetUserId) return;

    await supabase.from('folders').delete().eq('id', folderId).eq('user_id', targetUserId);
  } catch (err: any) {
    console.warn('[Supabase] Delete folder failed:', err?.message);
  }
}

/**
 * Subscribes to Supabase Realtime events strictly isolated to the user
 */
export function subscribeToSupabaseRealtime(
  callbacks: {
    onMessageInsert?: (message: Message) => void;
    onChatChange?: () => void;
  },
  userId?: string
) {
  // Never broadcast or listen across all users
  if (!userId) {
    return () => {};
  }

  const channel = supabase
    .channel(`mindly_sync_${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `user_id=eq.${userId}`,
      },
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
      {
        event: '*',
        schema: 'public',
        table: 'chats',
        filter: `user_id=eq.${userId}`,
      },
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
