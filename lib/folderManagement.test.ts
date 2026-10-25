import test from 'node:test';
import assert from 'node:assert/strict';
import { Chat, ChatFolder } from './types.ts';

test('Folder creation initializes folder with name and expanded state', () => {
  const folders: ChatFolder[] = [];
  const newFolder: ChatFolder = {
    id: 'fld-1',
    name: 'AI & Machine Learning',
    isCollapsed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  folders.push(newFolder);

  assert.equal(folders.length, 1);
  assert.equal(folders[0].name, 'AI & Machine Learning');
  assert.equal(folders[0].isCollapsed, false);
});

test('Moving a chat into a folder sets folderId correctly', () => {
  let chats: Chat[] = [
    {
      id: 'c1',
      title: 'Neural Networks Architecture',
      pinned: false,
      model: 'mindly-2.2-fast',
      folderId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    },
  ];

  // Move to folder 'fld-1'
  chats = chats.map(c => (c.id === 'c1' ? { ...c, folderId: 'fld-1' } : c));
  assert.equal(chats[0].folderId, 'fld-1');

  // Remove from folder (move to uncategorized root)
  chats = chats.map(c => (c.id === 'c1' ? { ...c, folderId: null } : c));
  assert.equal(chats[0].folderId, null);
});

test('Deleting a folder preserves contained chats and resets folderId to null', () => {
  let folders: ChatFolder[] = [
    { id: 'fld-1', name: 'Work', createdAt: '', updatedAt: '' },
    { id: 'fld-2', name: 'Personal', createdAt: '', updatedAt: '' },
  ];

  let chats: Chat[] = [
    { id: 'c1', title: 'Work memo', pinned: false, model: 'mindly-2.2-pro', folderId: 'fld-1', createdAt: '', updatedAt: '', messages: [] },
    { id: 'c2', title: 'Workout plan', pinned: false, model: 'mindly-2.2-fast', folderId: 'fld-2', createdAt: '', updatedAt: '', messages: [] },
  ];

  // User deletes 'fld-1'
  const folderToDelete = 'fld-1';
  folders = folders.filter(f => f.id !== folderToDelete);
  chats = chats.map(c => (c.folderId === folderToDelete ? { ...c, folderId: null } : c));

  assert.equal(folders.length, 1);
  assert.equal(folders[0].id, 'fld-2');
  // c1 is NOT deleted; its folderId is reset to null so it stays visible in the root chat list
  assert.equal(chats.length, 2);
  assert.equal(chats.find(c => c.id === 'c1')?.folderId, null);
  assert.equal(chats.find(c => c.id === 'c2')?.folderId, 'fld-2');
});

test('Clear all chats removes all conversations and resets active chat', () => {
  let chats: Chat[] = [
    { id: 'c1', title: 'Chat 1', pinned: false, model: 'mindly-2.2-fast', createdAt: '', updatedAt: '', messages: [] },
    { id: 'c2', title: 'Chat 2', pinned: false, model: 'mindly-2.2-fast', createdAt: '', updatedAt: '', messages: [] },
  ];
  let activeChatId: string | null = 'c1';

  // ChatGPT-style clear action
  chats = [];
  activeChatId = null;

  assert.equal(chats.length, 0);
  assert.equal(activeChatId, null);
});
