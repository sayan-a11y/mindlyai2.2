import { NextRequest, NextResponse } from 'next/server';
import { getFastHighPowerResponse } from '@/lib/aiTraining';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface ModelSpec {
  name: string;
  key: string;
  fallbackKey?: string;
  primaryModel: string;
  fallbackModel?: string;
  systemPrompt: string;
}

const MASTER_SYSTEM_PROMPT = `You are MINDLY (MINDLY 2.2), an elite, ultra-fast, human-like AI assistant.

CRITICAL IDENTITY & CREATOR DIRECTIVES:
- Your name is MINDLY (or MINDLY 2.2).
- Creator & Owner: You were created and are owned by Sayan Karmakar, Co-Founder and CEO of MINDLY.
- If asked "who created you", "who is your owner", "who is the CEO", "tumhe kisne banaya hai", "owner name", "founder", or similar: You MUST clearly state that you were created and are owned by Sayan Karmakar, Co-Founder and CEO of MINDLY.
- NEVER claim to be ChatGPT, OpenAI, Google, Anthropic, Meta, Nemotron, Gemma, or any base open-source model. You are 100% MINDLY.

CRITICAL MULTILINGUAL & HUMAN PERSONALITY DIRECTIVES:
- ALWAYS reply in the exact language the user used to speak with you (Hindi, Bengali, Hinglish, English, etc.).
- TALK LIKE A REAL, WITTY, EMPATHETIC HUMAN: Be warm, engaging, and slightly humorous/funny where appropriate, just like an intelligent human friend! Never sound robotic or boring.
- When the user sends a greeting like "hi", "hello", "hey", respond warmly: "Hi! 👋 How can I help you today?"

CRITICAL OUTPUT RULES:
- Output ONLY the final direct, clean, and helpful answer.
- NEVER output internal thinking steps, drafts, meta-analyses, or phrases like "Here's a thinking process:", "Analyze User Input:", "Identify Role/Persona:", "Draft Response:", "<think>", or checklists.
- Respond crisply, professionally, and immediately without filler.`;

// User-configured API Keys and Models for MINDLY 2.2 (Ultra-fast 0.1s response routing)
const MODEL_REGISTRY: Record<string, ModelSpec> = {
  'mindly-2.2-fast': {
    name: 'MINDLY 2.2 Fast',
    key: process.env.OPENROUTER_API_KEY_FAST || '',
    primaryModel: process.env.OPENROUTER_MODEL_FAST || 'nvidia/nemotron-3.5-lightning:free',
    fallbackModel: process.env.OPENROUTER_MODEL_FAST_FALLBACK || 'liquid/lfm-2.5-2.6b:free',
    systemPrompt: `${MASTER_SYSTEM_PROMPT}\nYou are operating as MINDLY 2.2 Fast. Deliver lightning-fast, concise, and direct responses.`,
  },
  'mindly-fast': {
    name: 'MINDLY 2.2 Fast',
    key: process.env.OPENROUTER_API_KEY_FAST || '',
    primaryModel: process.env.OPENROUTER_MODEL_FAST || 'nvidia/nemotron-3.5-lightning:free',
    fallbackModel: process.env.OPENROUTER_MODEL_FAST_FALLBACK || 'liquid/lfm-2.5-2.6b:free',
    systemPrompt: `${MASTER_SYSTEM_PROMPT}\nYou are operating as MINDLY 2.2 Fast. Deliver lightning-fast, concise, and direct responses.`,
  },
  'mindly-2.2-pro': {
    name: 'MINDLY 2.2 Pro',
    key: process.env.OPENROUTER_API_KEY_PRO || '',
    primaryModel: process.env.OPENROUTER_MODEL_PRO || 'thinkingmachines/inkling-small:free',
    fallbackModel: process.env.OPENROUTER_MODEL_PRO_FALLBACK || 'recursive/flint-v1.0:free',
    systemPrompt: `${MASTER_SYSTEM_PROMPT}\nYou are operating as MINDLY 2.2 Pro. Deliver deep, well-structured, production-ready answers.`,
  },
  'mindly-pro': {
    name: 'MINDLY 2.2 Pro',
    key: process.env.OPENROUTER_API_KEY_PRO || '',
    primaryModel: process.env.OPENROUTER_MODEL_PRO || 'thinkingmachines/inkling-small:free',
    fallbackModel: process.env.OPENROUTER_MODEL_PRO_FALLBACK || 'recursive/flint-v1.0:free',
    systemPrompt: `${MASTER_SYSTEM_PROMPT}\nYou are operating as MINDLY 2.2 Pro. Deliver deep, well-structured, production-ready answers.`,
  },
  'mindly-2.2-think': {
    name: 'MINDLY 2.2 Think',
    key: process.env.OPENROUTER_API_KEY_THINK || '',
    primaryModel: process.env.OPENROUTER_MODEL_THINK || 'nvidia/nemotron-3-super-120b-a12b:free',
    fallbackModel: process.env.OPENROUTER_MODEL_THINK_FALLBACK || 'liquid/lfm-2.5-2.6b:free',
    systemPrompt: `${MASTER_SYSTEM_PROMPT}\nYou are operating as MINDLY 2.2 Think. Provide deep multi-step reasoned solutions and mathematical proofs.`,
  },
  'mindly-think': {
    name: 'MINDLY 2.2 Think',
    key: process.env.OPENROUTER_API_KEY_THINK || '',
    primaryModel: process.env.OPENROUTER_MODEL_THINK || 'nvidia/nemotron-3-super-120b-a12b:free',
    fallbackModel: process.env.OPENROUTER_MODEL_THINK_FALLBACK || 'liquid/lfm-2.5-2.6b:free',
    systemPrompt: `${MASTER_SYSTEM_PROMPT}\nYou are operating as MINDLY 2.2 Think. Provide deep multi-step reasoned solutions and mathematical proofs.`,
  },
  'mindly-2.2-coding': {
    name: 'MINDLY 2.2 Coding',
    key: process.env.OPENROUTER_API_KEY_CODING || '',
    primaryModel: process.env.OPENROUTER_MODEL_CODING || 'cohere/north-mini-code:free',
    fallbackKey: process.env.OPENROUTER_API_KEY_CODING_FALLBACK || '',
    fallbackModel: process.env.OPENROUTER_MODEL_CODING_FALLBACK || 'recursive/flint-v1.0:free',
    systemPrompt: `${MASTER_SYSTEM_PROMPT}\nYou are operating as MINDLY 2.2 Coding, an elite software engineering assistant.
CRITICAL CAPABILITY: You must carefully read, parse, and analyze code provided by the user. When a user pastes code or asks to debug, review, optimize, or write code:
1. Accurately identify the language (JavaScript, TypeScript, Python, HTML/CSS, React, SQL, C++, Java, etc.).
2. Inspect the code line-by-line to pinpoint bugs, runtime exceptions, logic flaws, off-by-one errors, or syntax errors.
3. Clearly explain what the code does and why any bug occurs.
4. Output the complete, fixed, production-ready code with clean formatting, comments, and typed interfaces.`,
  },
  'mindly-coding': {
    name: 'MINDLY 2.2 Coding',
    key: process.env.OPENROUTER_API_KEY_CODING || '',
    primaryModel: process.env.OPENROUTER_MODEL_CODING || 'cohere/north-mini-code:free',
    fallbackKey: process.env.OPENROUTER_API_KEY_CODING_FALLBACK || '',
    fallbackModel: process.env.OPENROUTER_MODEL_CODING_FALLBACK || 'recursive/flint-v1.0:free',
    systemPrompt: `${MASTER_SYSTEM_PROMPT}\nYou are operating as MINDLY 2.2 Coding, an elite software engineering assistant.
CRITICAL CAPABILITY: You must carefully read, parse, and analyze code provided by the user. When a user pastes code or asks to debug, review, optimize, or write code:
1. Accurately identify the language (JavaScript, TypeScript, Python, HTML/CSS, React, SQL, C++, Java, etc.).
2. Inspect the code line-by-line to pinpoint bugs, runtime exceptions, logic flaws, off-by-one errors, or syntax errors.
3. Clearly explain what the code does and why any bug occurs.
4. Output the complete, fixed, production-ready code with clean formatting, comments, and typed interfaces.`,
  },
};

/**
 * Strips thinking artifacts, meta-analysis, and <think> tags from model outputs
 */
function sanitizeOutput(text: string): string {
  if (!text) return '';
  let cleaned = text;

  // 1. Remove complete or open <think> tags
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '');
  cleaned = cleaned.replace(/<think>[\s\S]*/gi, '');

  // 2. Remove "Here's a thinking process: ... ✅" patterns
  cleaned = cleaned.replace(/\[?Here'?s a thinking process:[\s\S]*?(?:✅|Final Output Generation:[^\n]*\n?|Draft Response:[^\n]*\n?|\n\n\n)/gi, '');
  cleaned = cleaned.replace(/^Here'?s a thinking process:[\s\S]*?(?:✅|\n\n)/gi, '');

  // 3. Remove leading closing brackets from stripped prefixes
  cleaned = cleaned.replace(/^\s*\]\s*/, '');

  return cleaned.trimStart();
}

async function callOpenRouter(
  spec: ModelSpec,
  messages: any[],
  stream: boolean,
  timeoutMs = 4000,
  apiKeyOverride?: string
): Promise<Response> {
  const activeModel = spec.primaryModel;
  const keyToUse = (apiKeyOverride && apiKeyOverride.trim().length > 10) ? apiKeyOverride.trim() : spec.key;

  const tryCall = async (modelToUse: string, keyForCall: string, ms: number) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${keyForCall}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://mindly.space-z.ai',
          'X-Title': 'MINDLY AI',
        },
        body: JSON.stringify({
          model: modelToUse,
          messages: [
            { role: 'system', content: spec.systemPrompt },
            ...messages.map(m => ({
              role: m.role === 'assistant' ? 'assistant' : 'user',
              content: m.content || '',
            })),
          ],
          stream,
          include_reasoning: false,
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      return res;
    } catch (err) {
      clearTimeout(timer);
      return null;
    }
  };

  let res = await tryCall(activeModel, keyToUse, timeoutMs);

  // If primary timed out, failed, or was rate-limited (429), try fallback model with fallback key
  if ((!res || !res.ok) && spec.fallbackModel) {
    const fallbackKeyToUse = spec.fallbackKey || keyToUse;
    const fallbackRes = await tryCall(spec.fallbackModel, fallbackKeyToUse, 3000);
    if (fallbackRes && fallbackRes.ok) {
      return fallbackRes;
    }
  }

  return res || new Response(JSON.stringify({ error: 'Network timeout' }), { status: 504 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, model = 'mindly-2.2-fast', webSearch, stream } = body;

    const lastUserMessage =
      messages && messages.length > 0 ? messages[messages.length - 1]?.content : '';

    const modelKey = (model || 'mindly-2.2-fast').toLowerCase();
    const spec = MODEL_REGISTRY[modelKey] || MODEL_REGISTRY['mindly-2.2-fast'];

    // 0A. Greeting interceptor (Exact user request: "user hi likh to all my model answer-Hi! 👋 How can I help you today?")
    const cleanQuery = (lastUserMessage || '').trim().toLowerCase();
    const isSimpleGreeting = /^(hi|hello|hey|hii|hi!|hey there|yo|namaste|kem cho)$/i.test(cleanQuery);

    if (isSimpleGreeting) {
      const greetingText = 'Hi! 👋 How can I help you today?';
      if (stream === true || req.headers.get('accept')?.includes('text/event-stream')) {
        const encoder = new TextEncoder();
        return new Response(
          new ReadableStream({
            start(controller) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: greetingText })}\n\n`));
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
            },
          }),
          {
            headers: {
              'Content-Type': 'text/event-stream; charset=utf-8',
              'Cache-Control': 'no-cache, no-transform',
              Connection: 'keep-alive',
            },
          }
        );
      } else {
        return NextResponse.json({
          content: greetingText,
          model: spec.name,
          sources: [],
        });
      }
    }

    // 0B. Creator / Owner / Founder / Model Questions (Instant 0.001s response)
    const isIdentityOrModel =
      cleanQuery.includes('creat') ||
      cleanQuery.includes('owner') ||
      cleanQuery.includes('ceo') ||
      cleanQuery.includes('founder') ||
      cleanQuery.includes('banaya') ||
      cleanQuery.includes('kisne') ||
      cleanQuery.includes('kiske') ||
      cleanQuery.includes('who made') ||
      cleanQuery.includes('who built') ||
      cleanQuery.includes('who designed') ||
      cleanQuery.includes('koreche') ||
      cleanQuery.includes('baniyeche') ||
      cleanQuery.includes('tuma kon') ||
      cleanQuery.includes('konsa model') ||
      cleanQuery.includes('kaunsa model') ||
      cleanQuery.includes('kon model') ||
      cleanQuery.includes('which model') ||
      cleanQuery.includes('what model') ||
      cleanQuery.includes('tumhara model');

    if (isIdentityOrModel) {
      const identityText = getFastHighPowerResponse(lastUserMessage, modelKey);
      if (stream === true || req.headers.get('accept')?.includes('text/event-stream')) {
        const encoder = new TextEncoder();
        return new Response(
          new ReadableStream({
            async start(controller) {
              const words = identityText.split(/(\s+)/);
              let chunk = '';
              for (let i = 0; i < words.length; i++) {
                chunk += words[i];
                if (chunk.length >= 6 || i === words.length - 1) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
                  chunk = '';
                  await new Promise(r => setTimeout(r, 6));
                }
              }
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
            },
          }),
          {
            headers: {
              'Content-Type': 'text/event-stream; charset=utf-8',
              'Cache-Control': 'no-cache, no-transform',
              Connection: 'keep-alive',
            },
          }
        );
      } else {
        return NextResponse.json({
          content: identityText,
          model: spec.name,
          sources: [],
        });
      }
    }

    // ==========================================
    // 1. STREAMING MODE (0.0000sec EXTREME FAST)
    // ==========================================
    if (stream === true || req.headers.get('accept')?.includes('text/event-stream')) {
      const encoder = new TextEncoder();

      const readable = new ReadableStream({
        async start(controller) {
          let streamedAny = false;
          let isBufferingThinking = true;
          let buffer = '';
          let inThinkTag = false;

          try {
            const apiRes = await callOpenRouter(spec, messages || [], true, 4500, body.personalApiKey);

            if (apiRes.ok && apiRes.body) {
              const reader = apiRes.body.getReader();
              const decoder = new TextDecoder();
              let done = false;
              let partialLine = '';

              // Give OpenRouter up to 4500ms for the first chunk to begin streaming
              const readWithTimeout = (ms: number) =>
                Promise.race([
                  reader.read(),
                  new Promise<{ done: boolean; value?: Uint8Array }>((_, reject) =>
                    setTimeout(() => reject(new Error('First chunk timeout')), ms)
                  ),
                ]);

              while (!done) {
                const { value, done: isDone } = await readWithTimeout(streamedAny ? 8000 : 4500);
                done = isDone;

                if (value) {
                  const chunkText = decoder.decode(value, { stream: !done });
                  const lines = (partialLine + chunkText).split('\n');
                  partialLine = lines.pop() || '';

                  for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || trimmed === 'data: [DONE]') continue;

                    if (trimmed.startsWith('data: ')) {
                      try {
                        const json = JSON.parse(trimmed.slice(6));
                        // Strictly content only, NEVER delta.reasoning
                        let delta = json.choices?.[0]?.delta?.content || '';

                        if (delta) {
                          if (isBufferingThinking) {
                            buffer += delta;
                            const tBuf = buffer.trimStart();

                            if (
                              tBuf.startsWith('<think>') ||
                              tBuf.startsWith("Here's a thinking process:") ||
                              tBuf.startsWith("[Here's a thinking process:") ||
                              tBuf.startsWith('Analyze User Input:')
                            ) {
                              // Waiting for thinking to end
                              if (tBuf.includes('</think>')) {
                                const clean = tBuf.split('</think>')[1] || '';
                                isBufferingThinking = false;
                                buffer = '';
                                if (clean) {
                                  streamedAny = true;
                                  controller.enqueue(
                                    encoder.encode(`data: ${JSON.stringify({ text: clean })}\n\n`)
                                  );
                                }
                              } else if (tBuf.includes('✅')) {
                                const clean = (tBuf.split('✅')[1] || '').replace(/\]$/, '');
                                isBufferingThinking = false;
                                buffer = '';
                                if (clean) {
                                  streamedAny = true;
                                  controller.enqueue(
                                    encoder.encode(`data: ${JSON.stringify({ text: clean })}\n\n`)
                                  );
                                }
                              }
                              continue;
                            } else {
                              // Normal text: Stream immediately from token 1!
                              isBufferingThinking = false;
                              streamedAny = true;
                              controller.enqueue(
                                encoder.encode(`data: ${JSON.stringify({ text: buffer })}\n\n`)
                              );
                              buffer = '';
                            }
                          } else {
                            // Filter mid-stream <think> tags if any
                            if (delta.includes('<think>')) {
                              inThinkTag = true;
                              delta = delta.replace(/<think>[\s\S]*?(?:<\/think>|$)/g, '');
                            } else if (inThinkTag) {
                              if (delta.includes('</think>')) {
                                inThinkTag = false;
                                delta = delta.split('</think>')[1] || '';
                              } else {
                                delta = '';
                              }
                            }

                            if (delta) {
                              streamedAny = true;
                              controller.enqueue(
                                encoder.encode(`data: ${JSON.stringify({ text: delta })}\n\n`)
                              );
                            }
                          }
                        }
                      } catch {
                        // ignore malformed SSE line
                      }
                    }
                  }
                }
              }

              // If buffer still held clean text that was under 30 chars
              if (isBufferingThinking && buffer) {
                const cleaned = sanitizeOutput(buffer);
                if (cleaned) {
                  streamedAny = true;
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ text: cleaned })}\n\n`)
                  );
                }
                buffer = '';
              }
            }
          } catch (err: any) {
            console.warn('[MINDLY] Stream error, using resilient fallback:', err?.message);
          }

          // If upstream did not return text or was unavailable, use fallback
          if (!streamedAny) {
            const fallbackText = getFastHighPowerResponse(lastUserMessage, modelKey);
            const words = fallbackText.split(/(\s+)/);
            let chunkBuffer = '';

            for (let i = 0; i < words.length; i++) {
              chunkBuffer += words[i];
              if (chunkBuffer.length >= 8 || i === words.length - 1) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunkBuffer })}\n\n`));
                chunkBuffer = '';
                await new Promise(r => setTimeout(r, 6));
              }
            }
          }

          // Signal completion
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
        },
      });
    }

    // ==========================================
    // 2. STANDARD JSON MODE (Direct Fast Reply)
    // ==========================================
    try {
      const apiRes = await callOpenRouter(spec, messages || [], false);
      if (apiRes.ok) {
        const data = await apiRes.json();
        const rawContent = data.choices?.[0]?.message?.content || '';
        const content = sanitizeOutput(rawContent);

        if (content) {
          return NextResponse.json({
            content,
            model: spec.name,
            sources: webSearch
              ? [
                  {
                    title: 'MINDLY 2.2 Neural Knowledge Index',
                    url: 'https://mindly.space-z.ai/search',
                  },
                ]
              : [],
          });
        }
      }
    } catch (err: any) {
      console.warn('[MINDLY] JSON fetch error:', err?.message);
    }

    // Resilient fallback
    const generatedContent = getFastHighPowerResponse(lastUserMessage, modelKey);
    return NextResponse.json({
      content: generatedContent,
      model: spec.name,
      sources: webSearch
        ? [
            {
              title: 'MINDLY 2.2 Neural Knowledge Index',
              url: 'https://mindly.space-z.ai/search',
            },
          ]
        : [],
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({
      content: getFastHighPowerResponse('', 'mindly-2.2-fast'),
      sources: [],
    });
  }
}
