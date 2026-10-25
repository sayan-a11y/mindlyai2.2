import test from 'node:test';
import assert from 'node:assert/strict';
import { parseVoiceCommand } from './voiceCommands.ts';

test('parseVoiceCommand parses create folder in English, Hindi, and Bengali', () => {
  const enCmd = parseVoiceCommand('create folder Quantum Physics');
  assert.ok(enCmd);
  assert.equal(enCmd?.action, 'create_folder');
  assert.equal(enCmd?.payload, 'Quantum Physics');

  const hiCmd = parseVoiceCommand('Machine Learning naam ka folder banao');
  assert.ok(hiCmd);
  assert.equal(hiCmd?.action, 'create_folder');
  assert.equal(hiCmd?.payload, 'Machine Learning');

  const bnCmd = parseVoiceCommand('folder toiri koro Space Exploration');
  assert.ok(bnCmd);
  assert.equal(bnCmd?.action, 'create_folder');
  assert.equal(bnCmd?.payload, 'Space Exploration');
});

test('parseVoiceCommand parses new chat command', () => {
  const cmd1 = parseVoiceCommand('start a new chat');
  assert.equal(cmd1?.action, 'new_chat');

  const cmd2 = parseVoiceCommand('naya chat shuru karo');
  assert.equal(cmd2?.action, 'new_chat');
});

test('parseVoiceCommand parses file operations (export backup, export chat, attach file)', () => {
  const backup1 = parseVoiceCommand('export data now');
  assert.equal(backup1?.action, 'export_backup');

  const backup2 = parseVoiceCommand('workspace backup download karo');
  assert.equal(backup2?.action, 'export_backup');

  const chatExp = parseVoiceCommand('export chat as markdown');
  assert.equal(chatExp?.action, 'export_chat');

  const chatExpBn = parseVoiceCommand('chat save koro');
  assert.equal(chatExpBn?.action, 'export_chat');

  const attach = parseVoiceCommand('attach file');
  assert.equal(attach?.action, 'open_file_picker');

  const attachHi = parseVoiceCommand('file upload karo please');
  assert.equal(attachHi?.action, 'open_file_picker');

  const copy = parseVoiceCommand('copy response to clipboard');
  assert.equal(copy?.action, 'copy_response');
});

test('parseVoiceCommand parses system & display controls (fullscreen, web search, font, theme)', () => {
  const fs1 = parseVoiceCommand('toggle full screen');
  assert.equal(fs1?.action, 'toggle_fullscreen');

  const fs2 = parseVoiceCommand('boro screen koro');
  assert.equal(fs2?.action, 'toggle_fullscreen');

  const ws = parseVoiceCommand('turn on web search');
  assert.equal(ws?.action, 'toggle_web_search');

  const fontBigger = parseVoiceCommand('bigger font size please');
  assert.equal(fontBigger?.action, 'set_font_size');
  assert.equal(fontBigger?.payload, 'large');

  const fontSmaller = parseVoiceCommand('font chota karo');
  assert.equal(fontSmaller?.action, 'set_font_size');
  assert.equal(fontSmaller?.payload, 'small');

  const mute = parseVoiceCommand('awaaz band karo');
  assert.equal(mute?.action, 'mute_sound');

  const unmute = parseVoiceCommand('unmute audio');
  assert.equal(unmute?.action, 'unmute_sound');
});

test('parseVoiceCommand parses model switching and navigation', () => {
  const pro = parseVoiceCommand('switch to pro model');
  assert.equal(pro?.action, 'switch_model');
  assert.equal(pro?.payload, 'mindly-2.2-pro');

  const think = parseVoiceCommand('mindly think lagao');
  assert.equal(think?.action, 'switch_model');
  assert.equal(think?.payload, 'mindly-2.2-think');

  const fast = parseVoiceCommand('use mindly fast');
  assert.equal(fast?.action, 'switch_model');
  assert.equal(fast?.payload, 'mindly-2.2-fast');

  const sidebar = parseVoiceCommand('toggle sidebar menu');
  assert.equal(sidebar?.action, 'toggle_sidebar');

  const explore = parseVoiceCommand('open explore templates');
  assert.equal(explore?.action, 'open_explore');

  const scrollUp = parseVoiceCommand('scroll to top');
  assert.equal(scrollUp?.action, 'scroll_top');

  const scrollDown = parseVoiceCommand('niche jao');
  assert.equal(scrollDown?.action, 'scroll_bottom');
});

test('parseVoiceCommand parses mobile hardware controls (haptic, battery status)', () => {
  const haptic = parseVoiceCommand('phone vibrate karo');
  assert.equal(haptic?.action, 'trigger_haptic');

  const battery = parseVoiceCommand('check battery status');
  assert.equal(battery?.action, 'check_system_status');

  const chargeBn = parseVoiceCommand('charge koto ache');
  assert.equal(chargeBn?.action, 'check_system_status');
});

test('parseVoiceCommand parses generate image in English and Hindi', () => {
  const enImg = parseVoiceCommand('generate image of a cyberpunk futuristic city at night');
  assert.equal(enImg?.action, 'generate_image');
  assert.ok(enImg?.payload?.includes('cyberpunk futuristic city'));

  const hiImg = parseVoiceCommand('red sports car ki image banao');
  assert.equal(hiImg?.action, 'generate_image');
  assert.ok(hiImg?.payload?.includes('red sports car'));
});

test('parseVoiceCommand parses theme toggle and settings', () => {
  const themeCmd = parseVoiceCommand('switch to dark mode please');
  assert.equal(themeCmd?.action, 'toggle_theme');

  const settingsCmd = parseVoiceCommand('open settings');
  assert.equal(settingsCmd?.action, 'open_settings');
});

test('parseVoiceCommand returns null for non-command questions', () => {
  const q1 = parseVoiceCommand('what is photosynthesis?');
  assert.equal(q1, null);

  const q2 = parseVoiceCommand('kaise ho aap?');
  assert.equal(q2, null);
});
