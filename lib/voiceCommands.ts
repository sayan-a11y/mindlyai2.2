export type VoiceActionType =
  | 'create_folder'
  | 'new_chat'
  | 'generate_image'
  | 'toggle_theme'
  | 'search'
  | 'clear_all_chats'
  | 'open_settings'
  // Advanced PC / Laptop & Mobile Control
  | 'export_backup'
  | 'export_chat'
  | 'open_file_picker'
  | 'copy_response'
  | 'toggle_fullscreen'
  | 'toggle_web_search'
  | 'set_font_size'
  | 'mute_sound'
  | 'unmute_sound'
  | 'switch_model'
  | 'toggle_sidebar'
  | 'open_explore'
  | 'scroll_top'
  | 'scroll_bottom'
  | 'check_system_status'
  | 'trigger_haptic';

export interface VoiceCommandAction {
  action: VoiceActionType;
  payload?: string;
  feedbackEn: string;
  feedbackHi: string;
  feedbackBn: string;
  feedbackEs?: string;
}

export function parseVoiceCommand(rawText: string): VoiceCommandAction | null {
  if (!rawText) return null;
  const text = rawText.trim().toLowerCase();

  // 1. Create Folder
  // English: "create folder Quantum Physics", "make a folder named Work"
  // Hindi: "Research naam ka folder banao", "folder banao Projects"
  // Bengali: "Projects folder toiri koro", "notun folder banao"
  const folderEn = rawText.match(/(?:create|make|add)\s+(?:a\s+)?folder\s+(?:named|called\s+)?(.+)/i);
  const folderHi = rawText.match(/(?:folder)\s+(?:banao|banaiye|karo)\s+(.+)/i) || rawText.match(/(.+?)(?:\s+naam\s+ka)?\s+folder\s+(?:banao|banaiye)/i);
  const folderBn = rawText.match(/(?:foldar|folder)\s+toiri\s+koro\s+(.+)/i) || rawText.match(/(.+?)(?:\s+namer)?\s+folder\s+toiri\s+koro/i);

  if (folderEn || folderHi || folderBn) {
    const raw = (folderEn?.[1] || folderHi?.[1] || folderBn?.[1] || '').trim();
    const cleanName = raw
      .replace(/^(named|called|naam ka|namer)\s+/i, '')
      .replace(/\s+(naam ka|namer)$/i, '')
      .replace(/[.?!]$/, '')
      .trim();
    if (cleanName) {
      return {
        action: 'create_folder',
        payload: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
        feedbackEn: `Created folder "${cleanName}" for you.`,
        feedbackHi: `Aapke liye "${cleanName}" folder bana diya hai.`,
        feedbackBn: `Apnar jonno "${cleanName}" folder toiri kora hoyeche.`,
        feedbackEs: `Carpeta "${cleanName}" creada.`,
      };
    }
  }

  // 2. New Chat
  if (
    /^(new chat|start new chat|create new chat|start a new chat)$/i.test(text) ||
    text.includes('naya chat') ||
    text.includes('nayi baat') ||
    text.includes('notun chat') ||
    text.includes('nueva conversacion')
  ) {
    return {
      action: 'new_chat',
      feedbackEn: 'Starting a fresh conversation.',
      feedbackHi: 'Naya chat shuru kar rahe hain.',
      feedbackBn: 'Notun conversation shuru korchi.',
      feedbackEs: 'Iniciando una nueva conversación.',
    };
  }

  // 3. Export Workspace Backup (File Operation)
  if (
    text.includes('export data') ||
    text.includes('backup workspace') ||
    text.includes('export backup') ||
    text.includes('download backup') ||
    text.includes('backup data') ||
    text.includes('export all data') ||
    text.includes('data export karo') ||
    text.includes('backup download karo') ||
    text.includes('backup nao') ||
    text.includes('exportar datos')
  ) {
    return {
      action: 'export_backup',
      feedbackEn: 'Triggering complete workspace JSON backup download.',
      feedbackHi: 'Workspace ka full backup download kar rahe hain.',
      feedbackBn: 'Workspace er complete JSON backup download kora hocche.',
      feedbackEs: 'Descargando copia de seguridad del espacio de trabajo.',
    };
  }

  // 4. Export / Download Current Chat (File Operation)
  if (
    text.includes('export chat') ||
    text.includes('download chat') ||
    text.includes('save chat') ||
    text.includes('save conversation') ||
    text.includes('chat download karo') ||
    text.includes('chat save karo') ||
    text.includes('chat save koro') ||
    text.includes('guardar chat')
  ) {
    return {
      action: 'export_chat',
      feedbackEn: 'Exporting current conversation as Markdown file.',
      feedbackHi: 'Current chat ko Markdown file mein download kar rahe hain.',
      feedbackBn: 'Current chat ti Markdown file e download kora hocche.',
      feedbackEs: 'Exportando conversación actual en formato Markdown.',
    };
  }

  // 5. Attach / Upload File (File Operation)
  if (
    text.includes('attach file') ||
    text.includes('upload file') ||
    text.includes('open file') ||
    text.includes('attach document') ||
    text.includes('upload image') ||
    text.includes('file attach karo') ||
    text.includes('file upload karo') ||
    text.includes('file attach koro') ||
    text.includes('adjuntar archivo')
  ) {
    return {
      action: 'open_file_picker',
      feedbackEn: 'Opening file picker to select documents or images.',
      feedbackHi: 'File picker dialog khol rahe hain.',
      feedbackBn: 'File select korar dialog khola hoyeche.',
      feedbackEs: 'Abriendo selector de archivos.',
    };
  }

  // 6. Copy Response to Clipboard
  if (
    text.includes('copy response') ||
    text.includes('copy answer') ||
    text.includes('copy text') ||
    text.includes('copy to clipboard') ||
    text.includes('copy last message') ||
    text.includes('copy code') ||
    text.includes('jawab copy karo') ||
    text.includes('response copy karo') ||
    text.includes('clipboard par copy karo') ||
    text.includes('uttor copy koro') ||
    text.includes('copiar respuesta')
  ) {
    return {
      action: 'copy_response',
      feedbackEn: 'Copied the latest assistant response to clipboard.',
      feedbackHi: 'MINDLY ka aakhiri jawab clipboard par copy kar diya hai.',
      feedbackBn: 'Latest uttor clipboard e copy kora hoyeche.',
      feedbackEs: 'Respuesta copiada al portapapeles.',
    };
  }

  // 7. Fullscreen Toggle (PC & Mobile Display Control)
  if (
    text.includes('full screen') ||
    text.includes('fullscreen') ||
    text.includes('toggle full screen') ||
    text.includes('enter full screen') ||
    text.includes('exit full screen') ||
    text.includes('badi screen karo') ||
    text.includes('boro screen koro') ||
    text.includes('pantalla completa')
  ) {
    return {
      action: 'toggle_fullscreen',
      feedbackEn: 'Toggling full screen view for immersive mode.',
      feedbackHi: 'Full screen view switch kar rahe hain.',
      feedbackBn: 'Full screen view switch kora hoyeche.',
      feedbackEs: 'Cambiando a modo de pantalla completa.',
    };
  }

  // 8. Web Search Toggle
  if (
    text.includes('web search on') ||
    text.includes('web search off') ||
    text.includes('enable web search') ||
    text.includes('turn on web search') ||
    text.includes('disable web search') ||
    text.includes('turn off web search') ||
    text.includes('toggle web search') ||
    text.includes('web search chalu karo') ||
    text.includes('web search band karo') ||
    text.includes('internet search on karo')
  ) {
    return {
      action: 'toggle_web_search',
      feedbackEn: 'Toggled live web search capability.',
      feedbackHi: 'Live web search toggle kar diya hai.',
      feedbackBn: 'Live web search toggle kora hoyeche.',
      feedbackEs: 'Búsqueda web actualizada.',
    };
  }

  // 9. Font Size Adjustment
  if (text.includes('bigger font') || text.includes('large font') || text.includes('increase font') || text.includes('font bada karo') || text.includes('font boro koro')) {
    return {
      action: 'set_font_size',
      payload: 'large',
      feedbackEn: 'Font size increased to large.',
      feedbackHi: 'Font size bada kar diya hai.',
      feedbackBn: 'Font size boro kora hoyeche.',
      feedbackEs: 'Tamaño de fuente aumentado.',
    };
  }
  if (text.includes('smaller font') || text.includes('small font') || text.includes('decrease font') || text.includes('font chota karo') || text.includes('font choto koro')) {
    return {
      action: 'set_font_size',
      payload: 'small',
      feedbackEn: 'Font size set to compact.',
      feedbackHi: 'Font size chota kar diya hai.',
      feedbackBn: 'Font size choto kora hoyeche.',
      feedbackEs: 'Tamaño de fuente reducido.',
    };
  }
  if (text.includes('normal font') || text.includes('medium font') || text.includes('default font')) {
    return {
      action: 'set_font_size',
      payload: 'medium',
      feedbackEn: 'Font size reset to normal.',
      feedbackHi: 'Font size normal kar diya hai.',
      feedbackBn: 'Font size normal kora hoyeche.',
      feedbackEs: 'Tamaño de fuente normal.',
    };
  }

  // 10. Mute / Unmute Audio (Check unmute first to avoid false substring match on 'mute')
  if (
    text.includes('unmute sound') ||
    text.includes('unmute voice') ||
    text.includes('unmute audio') ||
    text.includes('unmute') ||
    text.includes('turn on sound') ||
    text.includes('awaaz chalu karo') ||
    text.includes('shobdo chalu koro')
  ) {
    return {
      action: 'unmute_sound',
      feedbackEn: 'Unmuted audio output.',
      feedbackHi: 'Awaaz chalu kar di gayi hai.',
      feedbackBn: 'Shobdo chalu kora hoyeche.',
      feedbackEs: 'Audio activado.',
    };
  }
  if (
    text.includes('mute sound') ||
    text.includes('mute voice') ||
    text.includes('mute audio') ||
    text.includes('mute') ||
    text.includes('turn off sound') ||
    text.includes('awaaz band karo') ||
    text.includes('shobdo bondho koro') ||
    text.includes('silenciar')
  ) {
    return {
      action: 'mute_sound',
      feedbackEn: 'Muted assistant audio output.',
      feedbackHi: 'Awaaz band kar di gayi hai.',
      feedbackBn: 'Shobdo bondho kora hoyeche.',
      feedbackEs: 'Audio silenciado.',
    };
  }

  // 11. Switch AI Engine Model
  if (text.includes('switch to pro') || text.includes('use mindly pro') || text.includes('mindly pro lagao') || text.includes('pro model')) {
    return {
      action: 'switch_model',
      payload: 'mindly-2.2-pro',
      feedbackEn: 'Switched model engine to MINDLY 2.2 Pro.',
      feedbackHi: 'MINDLY 2.2 Pro model select kar liya hai.',
      feedbackBn: 'MINDLY 2.2 Pro model switch kora hoyeche.',
      feedbackEs: 'Cambiado a MINDLY 2.2 Pro.',
    };
  }
  if (text.includes('switch to think') || text.includes('use mindly think') || text.includes('mindly think lagao') || text.includes('think model')) {
    return {
      action: 'switch_model',
      payload: 'mindly-2.2-think',
      feedbackEn: 'Switched model engine to MINDLY 2.2 Think (Deep Reasoner).',
      feedbackHi: 'MINDLY 2.2 Think deep reasoner select kar liya hai.',
      feedbackBn: 'MINDLY 2.2 Think deep reasoner model switch kora hoyeche.',
      feedbackEs: 'Cambiado a MINDLY 2.2 Think.',
    };
  }
  if (text.includes('switch to fast') || text.includes('use mindly fast') || text.includes('mindly fast lagao') || text.includes('fast model')) {
    return {
      action: 'switch_model',
      payload: 'mindly-2.2-fast',
      feedbackEn: 'Switched model engine to MINDLY 2.2 Fast (Ultra-low latency).',
      feedbackHi: 'MINDLY 2.2 Fast turbo engine select kar liya hai.',
      feedbackBn: 'MINDLY 2.2 Fast engine switch kora hoyeche.',
      feedbackEs: 'Cambiado a MINDLY 2.2 Fast.',
    };
  }

  // 12. Toggle Sidebar / Mobile Drawer
  if (
    text.includes('toggle sidebar') ||
    text.includes('open sidebar') ||
    text.includes('close sidebar') ||
    text.includes('toggle menu') ||
    text.includes('open menu') ||
    text.includes('close menu') ||
    text.includes('sidebar kholo') ||
    text.includes('menu kholo') ||
    text.includes('menu band karo')
  ) {
    return {
      action: 'toggle_sidebar',
      feedbackEn: 'Toggled navigation drawer.',
      feedbackHi: 'Menu drawer toggle kar diya hai.',
      feedbackBn: 'Navigation drawer toggle kora hoyeche.',
      feedbackEs: 'Menú lateral cambiado.',
    };
  }

  // 13. Open Explore Templates
  if (
    text.includes('open explore') ||
    text.includes('explore templates') ||
    text.includes('show templates') ||
    text.includes('browse templates') ||
    text.includes('templates dekhao') ||
    text.includes('explore kholo')
  ) {
    return {
      action: 'open_explore',
      feedbackEn: 'Opening prompt templates and explore catalog.',
      feedbackHi: 'Prompt templates aur explore catalog khol rahe hain.',
      feedbackBn: 'Prompt templates explore catalog khola hoyeche.',
      feedbackEs: 'Abriendo catálogo de plantillas.',
    };
  }

  // 14. Scroll Top / Scroll Bottom (Ergonomic PC/Mobile Navigation)
  if (text.includes('scroll to top') || text.includes('scroll up') || text.includes('go to top') || text.includes('upar jao') || text.includes('upore jao')) {
    return {
      action: 'scroll_top',
      feedbackEn: 'Scrolled smoothly to top of view.',
      feedbackHi: 'Screen ke top par scroll kar diya hai.',
      feedbackBn: 'View er upore scroll kora hoyeche.',
      feedbackEs: 'Desplazado al inicio.',
    };
  }
  if (text.includes('scroll to bottom') || text.includes('scroll down') || text.includes('go to bottom') || text.includes('niche jao') || text.includes('nicher dike jao')) {
    return {
      action: 'scroll_bottom',
      feedbackEn: 'Scrolled smoothly to bottom of view.',
      feedbackHi: 'Screen ke bottom par scroll kar diya hai.',
      feedbackBn: 'View er niche scroll kora hoyeche.',
      feedbackEs: 'Desplazado al final.',
    };
  }

  // 15. Check Device / System Status (Battery, Network, PC/Mobile)
  if (
    text.includes('battery status') ||
    text.includes('check battery') ||
    text.includes('system status') ||
    text.includes('device status') ||
    text.includes('battery kitni hai') ||
    text.includes('charge koto') ||
    text.includes('estado de bateria')
  ) {
    return {
      action: 'check_system_status',
      feedbackEn: 'Checking PC and mobile device diagnostics.',
      feedbackHi: 'Device battery aur network status check kar rahe hain.',
      feedbackBn: 'Device battery ebong network status check kora hocche.',
      feedbackEs: 'Verificando estado del dispositivo y batería.',
    };
  }

  // 16. Trigger Haptic Vibration (Mobile Hardware Control)
  if (
    text.includes('vibrate phone') ||
    text.includes('test haptic') ||
    text.includes('haptic feedback') ||
    text.includes('vibrate device') ||
    text.includes('vibrate karo') ||
    text.includes('phone vibrate karo') ||
    text.includes('vibrate koro')
  ) {
    return {
      action: 'trigger_haptic',
      feedbackEn: 'Triggered mobile haptic vibration pulse.',
      feedbackHi: 'Mobile haptic vibration trigger kar diya hai.',
      feedbackBn: 'Mobile haptic vibration trigger kora hoyeche.',
      feedbackEs: 'Vibración táctil activada.',
    };
  }

  // 17. Generate Image
  // English: "generate image of cyber dragon", "draw a sports car"
  // Hindi: "sports car ki image banao", "image banao mountain landscape"
  // Bengali: "chobi toiri koro spaceship", "image banao sunset"
  const imgEn = text.match(/(?:generate|create|make|draw)\s+(?:an?\s+)?image\s+(?:of\s+)?(.+)/i);
  const imgHi = text.match(/(?:image|tasveer|photo)\s+(?:banao|karo)\s+(.+)/i) || text.match(/(.+)\s+(?:ki\s+image|ki\s+photo|ki\s+tasveer)\s+(?:banao|karo)/i);
  const imgBn = text.match(/(?:chobi|image)\s+toiri\s+koro\s+(.+)/i) || text.match(/(.+)\s+chobi\s+toiri\s+koro/i);

  if (imgEn || imgHi || imgBn) {
    const prompt = (imgEn?.[1] || imgHi?.[1] || imgBn?.[1] || '').replace(/[.?!]$/, '').trim();
    if (prompt) {
      return {
        action: 'generate_image',
        payload: prompt,
        feedbackEn: `Generating image of ${prompt} now.`,
        feedbackHi: `${prompt} ki image bana rahe hain.`,
        feedbackBn: `${prompt} er chobi toiri korchi.`,
        feedbackEs: `Generando imagen de ${prompt}.`,
      };
    }
  }

  // 18. Toggle Theme (Dark / Light)
  if (
    text.includes('dark mode') ||
    text.includes('light mode') ||
    text.includes('theme badlo') ||
    text.includes('toggle theme') ||
    text.includes('theme change') ||
    text.includes('cambiar tema')
  ) {
    return {
      action: 'toggle_theme',
      feedbackEn: 'Switched appearance theme.',
      feedbackHi: 'Theme badal diya gaya hai.',
      feedbackBn: 'Theme change kora hoyeche.',
      feedbackEs: 'Tema visual actualizado.',
    };
  }

  // 19. Clear All Chats
  if (
    text.includes('clear all chats') ||
    text.includes('delete all chats') ||
    text.includes('saare chat delete') ||
    text.includes('sobai chat muche dao') ||
    text.includes('clear history') ||
    text.includes('borrar todos los chats')
  ) {
    return {
      action: 'clear_all_chats',
      feedbackEn: 'Opening delete confirmation.',
      feedbackHi: 'Chat delete karne ka dialog khol rahe hain.',
      feedbackBn: 'Chat delete confirmation khola hoyeche.',
      feedbackEs: 'Abriendo confirmación para borrar historial.',
    };
  }

  // 20. Search Chats
  const searchMatch = text.match(/(?:search|find|khojo|dekho)\s+(?:chats?\s+for\s+)?(.+)/i);
  if (searchMatch && !text.startsWith('how') && !text.startsWith('what') && !text.startsWith('why') && !text.startsWith('kya') && !text.startsWith('kaise')) {
    const query = searchMatch[1].replace(/[.?!]$/, '').trim();
    if (query) {
      return {
        action: 'search',
        payload: query,
        feedbackEn: `Searching your workspace for "${query}".`,
        feedbackHi: `"${query}" search kar rahe hain.`,
        feedbackBn: `"${query}" search kora hocche.`,
        feedbackEs: `Buscando "${query}" en conversaciones.`,
      };
    }
  }

  // 21. Open Settings
  if (
    text.includes('open settings') ||
    text.includes('show settings') ||
    text.includes('settings kholo') ||
    text.includes('settings dekhao') ||
    text.includes('abrir ajustes')
  ) {
    return {
      action: 'open_settings',
      feedbackEn: 'Opening Settings.',
      feedbackHi: 'Settings khol rahe hain.',
      feedbackBn: 'Settings khola hoyeche.',
      feedbackEs: 'Abriendo configuración.',
    };
  }

  return null;
}
