'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Mic, MicOff, Volume2, X, ChevronDown, ChevronUp, Sparkles, Check, Globe } from 'lucide-react';
import { parseVoiceCommand, VoiceCommandAction } from '@/lib/voiceCommands';

interface VoiceModeSceneProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'Listening...' | 'Thinking...' | 'Speaking...' | 'Muted';
  transcript: string;
  onSendMessage: (text: string) => void;
  selectedModel: string;
  onExecuteCommand?: (cmd: VoiceCommandAction) => void;
  lastAssistantMessage?: string;
}

// Pre-allocated reusable math helpers outside render loop (Zero GC)
const _vec3 = new THREE.Vector3();
const _dummyMatrix = new THREE.Matrix4();
const _dummyPosition = new THREE.Vector3();
const _dummyScale = new THREE.Vector3();
const _dummyQuaternion = new THREE.Quaternion();

export default function VoiceModeScene({
  isOpen,
  onClose,
  status: initialStatus,
  transcript,
  onSendMessage,
  selectedModel,
  onExecuteCommand,
  lastAssistantMessage,
}: VoiceModeSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [controlsCollapsed, setControlsCollapsed] = useState(false);
  const [activeLang, setActiveLang] = useState<'en-US' | 'hi-IN' | 'bn-IN' | 'es-ES'>('en-US');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [executedToast, setExecutedToast] = useState<string | null>(null);
  const [isSpeakingOut, setIsSpeakingOut] = useState(false);

  // Audio simulation / web audio hookup
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isInteractingRef = useRef(false);
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });
  const mousePreviousRef = useRef({ x: 0, y: 0 });

  // Mesh refs for animation
  const coreMeshRef = useRef<THREE.Mesh | null>(null);
  const gimbalRing1Ref = useRef<THREE.Mesh | null>(null);
  const gimbalRing2Ref = useRef<THREE.Mesh | null>(null);
  const gimbalRing3Ref = useRef<THREE.Mesh | null>(null);
  const instancedNodesRef = useRef<THREE.InstancedMesh | null>(null);

  // Recognition ref
  const recognitionRef = useRef<any>(null);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Spoken TTS Helper (Speaks aloud in active language)
  const speakSpokenResponse = useCallback((text: string, lang = activeLang) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const cleanSpeech = text
        .replace(/[`*#_~[\]()]/g, '')
        .replace(/```[\s\S]*?```/g, 'Code block omitted.')
        .slice(0, 350);

      const utterance = new SpeechSynthesisUtterance(cleanSpeech);
      utterance.lang = lang;
      utterance.rate = 1.05;
      utterance.onstart = () => setIsSpeakingOut(true);
      utterance.onend = () => setIsSpeakingOut(false);
      utterance.onerror = () => setIsSpeakingOut(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
      setIsSpeakingOut(false);
    }
  }, [activeLang]);

  // Voice Command Processing
  const handleProcessSpeech = useCallback((spokenText: string) => {
    if (!spokenText.trim()) return;

    // Mobile tactile feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(35);
      } catch {}
    }

    const cmd = parseVoiceCommand(spokenText);

    if (cmd && onExecuteCommand) {
      onExecuteCommand(cmd);
      const feedback =
        activeLang === 'hi-IN'
          ? cmd.feedbackHi
          : activeLang === 'bn-IN'
          ? cmd.feedbackBn
          : activeLang === 'es-ES' && cmd.feedbackEs
          ? cmd.feedbackEs
          : cmd.feedbackEn;
      setExecutedToast(`⚡ Executed: ${feedback}`);
      speakSpokenResponse(feedback, activeLang);
      setTimeout(() => setExecutedToast(null), 4000);
    } else {
      onSendMessage(spokenText);
    }
  }, [activeLang, onExecuteCommand, onSendMessage, speakSpokenResponse]);

  // Read incoming assistant message aloud when voice mode is open
  const lastSpokenRef = useRef<string | null>(null);
  useEffect(() => {
    if (isOpen && lastAssistantMessage && lastAssistantMessage !== lastSpokenRef.current && !isMuted) {
      lastSpokenRef.current = lastAssistantMessage;
      speakSpokenResponse(lastAssistantMessage, activeLang);
    }
  }, [isOpen, lastAssistantMessage, isMuted, activeLang, speakSpokenResponse]);

  // Multilingual Speech Recognition Lifecycle
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) return;

    try {
      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = activeLang;

      recognition.onresult = (e: any) => {
        if (isMutedRef.current) return;
        let interim = '';
        let final = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const item = e.results[i];
          if (item.isFinal) {
            final += item[0].transcript;
          } else {
            interim += item[0].transcript;
          }
        }
        const currentText = (final || interim).trim();
        setLiveTranscript(currentText);

        if (final.trim()) {
          handleProcessSpeech(final.trim());
          setLiveTranscript('');
        }
      };

      recognition.onerror = () => {
        // Auto-restart on silent pause
        try {
          if (!isMutedRef.current && isOpen) {
            recognition.stop();
          }
        } catch {}
      };

      recognition.onend = () => {
        if (isOpen && !isMutedRef.current) {
          try {
            recognition.start();
          } catch {}
        }
      };

      if (!isMuted) {
        recognition.start();
      }
      recognitionRef.current = recognition;

      return () => {
        try {
          recognition.stop();
        } catch {}
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      };
    } catch (err) {
      console.warn('SpeechRecognition initialization error:', err);
    }
  }, [isOpen, activeLang, isMuted, handleProcessSpeech]);

  // Three.js 3D Neural Scene setup
  useEffect(() => {
    if (!isOpen || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const isHeadless =
      typeof navigator !== 'undefined' &&
      (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0a0c);
    scene.fog = new THREE.FogExp2(0x0a0a0c, 0.04);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isHeadless,
      powerPreference: 'high-performance',
      alpha: false,
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Environment map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // Studio Lights
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(5, 5, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x6366f1, 3.5);
    rimLight.position.set(-6, -4, -4);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xf59e0b, 2.0, 15);
    fillLight.position.set(0, 0, 0);
    scene.add(fillLight);

    // 1. Central Neural PBR Core Sphere
    const coreGeo = new THREE.SphereGeometry(1.4, 48, 48);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x111116,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.35,
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);
    coreMeshRef.current = coreMesh;

    // 2. Gimbal Rings
    const createRing = (radius: number, tube: number, color: number) => {
      const ringGeo = new THREE.TorusGeometry(radius, tube, 24, 80);
      const ringMat = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.9,
        roughness: 0.15,
        wireframe: false,
      });
      return new THREE.Mesh(ringGeo, ringMat);
    };

    const ring1 = createRing(2.1, 0.035, 0xe4e4e7);
    const ring2 = createRing(2.6, 0.03, 0x6366f1);
    const ring3 = createRing(3.1, 0.025, 0xf59e0b);
    scene.add(ring1);
    scene.add(ring2);
    scene.add(ring3);
    gimbalRing1Ref.current = ring1;
    gimbalRing2Ref.current = ring2;
    gimbalRing3Ref.current = ring3;

    // 3. Orbital Particles
    const nodeCount = 64;
    const nodeGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa });
    const instancedMesh = new THREE.InstancedMesh(nodeGeo, nodeMat, nodeCount);

    for (let i = 0; i < nodeCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2.0 + Math.random() * 1.5;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      _dummyPosition.set(x, y, z);
      _dummyScale.set(1, 1, 1);
      _dummyQuaternion.identity();
      _dummyMatrix.compose(_dummyPosition, _dummyQuaternion, _dummyScale);
      instancedMesh.setMatrixAt(i, _dummyMatrix);
    }
    instancedMesh.instanceMatrix.needsUpdate = true;
    scene.add(instancedMesh);
    instancedNodesRef.current = instancedMesh;

    // Interaction handlers
    const onPointerDown = (e: PointerEvent) => {
      isInteractingRef.current = true;
      mousePreviousRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isInteractingRef.current) return;
      const deltaX = e.clientX - mousePreviousRef.current.x;
      const deltaY = e.clientY - mousePreviousRef.current.y;
      targetRotationRef.current.y += deltaX * 0.005;
      targetRotationRef.current.x += deltaY * 0.005;
      mousePreviousRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isInteractingRef.current = false;
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Resize Handler
    const onResize = () => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth inertia rotation
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.08;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.08;

      if (coreMeshRef.current) {
        coreMeshRef.current.rotation.x = currentRotationRef.current.x + Math.sin(elapsedTime * 0.6) * 0.1;
        coreMeshRef.current.rotation.y = currentRotationRef.current.y + elapsedTime * 0.4;

        // Dynamic scale based on speaking state
        const pulse = isSpeakingOut
          ? 1.0 + Math.sin(elapsedTime * 8) * 0.08
          : 1.0 + Math.sin(elapsedTime * 2) * 0.02;
        coreMeshRef.current.scale.set(pulse, pulse, pulse);
      }

      if (gimbalRing1Ref.current) {
        gimbalRing1Ref.current.rotation.x = elapsedTime * 0.45;
        gimbalRing1Ref.current.rotation.y = elapsedTime * 0.35;
      }
      if (gimbalRing2Ref.current) {
        gimbalRing2Ref.current.rotation.y = -elapsedTime * 0.55;
        gimbalRing2Ref.current.rotation.z = elapsedTime * 0.3;
      }
      if (gimbalRing3Ref.current) {
        gimbalRing3Ref.current.rotation.x = -elapsedTime * 0.35;
        gimbalRing3Ref.current.rotation.z = -elapsedTime * 0.45;
      }

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [isOpen, isSpeakingOut]);

  if (!isOpen) return null;

  const currentStatusDisplay = isMuted
    ? 'Muted'
    : isSpeakingOut
    ? 'Speaking...'
    : liveTranscript
    ? 'Processing...'
    : 'Listening...';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0A0A0C] text-white overflow-hidden select-none animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 border-b border-neutral-800/40 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-700/60 flex items-center justify-center text-amber-500 shadow-sm">
            <Sparkles size={16} />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-wide flex items-center gap-2">
              <span>MINDLY 2.2 ASTRA VOICE AGENT</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Live Executive
              </span>
            </div>
            <div className="text-xs text-neutral-400">Model: {selectedModel} • Multilingual Voice Command Engine</div>
          </div>
        </div>

        {/* Language selector & status */}
        <div className="flex items-center space-x-3">
          {/* Multilingual Selector */}
          <div className="hidden sm:flex items-center space-x-1 p-1 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs">
            <Globe size={13} className="text-neutral-400 ml-1.5" />
            {[
              { id: 'en-US', label: 'English' },
              { id: 'hi-IN', label: 'हिंदी (Hindi)' },
              { id: 'bn-IN', label: 'বাংলা (Bengali)' },
              { id: 'es-ES', label: 'Español' },
            ].map(lang => (
              <button
                key={lang.id}
                type="button"
                onClick={() => setActiveLang(lang.id as any)}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer text-[11px] font-medium ${
                  activeLang === lang.id
                    ? 'bg-neutral-800 text-white shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <div
            className={`px-3 py-1 rounded-full border text-xs font-medium ${
              isSpeakingOut
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700'
                : 'bg-neutral-900 border-neutral-700/70 text-neutral-300'
            }`}
          >
            {currentStatusDisplay}
          </div>

          <button
            onClick={onClose}
            aria-label="Close voice mode"
            className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/60 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Full-Bleed Three.js Canvas Container */}
      <div
        ref={mountRef}
        data-testid="threejs-canvas-container"
        className="relative flex-1 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Executed Command Toast */}
      {executedToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 max-w-md w-[90%] px-4 py-2.5 rounded-2xl bg-emerald-950/90 border border-emerald-600/80 text-center text-xs text-emerald-200 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          {executedToast}
        </div>
      )}

      {/* Live Transcript / Subtitles */}
      {(liveTranscript || transcript) && (
        <div className="absolute top-32 left-1/2 -translate-x-1/2 max-w-xl w-[90%] px-5 py-3 rounded-2xl bg-[#141417]/95 border border-neutral-800 text-center text-sm text-neutral-200 pointer-events-none transition-all shadow-xl">
          <span className="text-[11px] uppercase tracking-wider text-amber-500 font-mono block mb-1">
            {liveTranscript ? 'Live Speech Recognition' : 'Assistant Spoken Preview'}
          </span>
          &ldquo;{liveTranscript || transcript}&rdquo;
        </div>
      )}

      {/* Bottom Floating Control Dock */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-2xl flex flex-col items-center">
        <button
          onClick={() => setControlsCollapsed(!controlsCollapsed)}
          className="mb-2 px-3 py-1 rounded-full bg-[#18181B] hover:bg-[#222226] border border-neutral-700/70 text-xs text-neutral-300 flex items-center space-x-1 transition-all cursor-pointer"
        >
          {controlsCollapsed ? (
            <>
              <ChevronUp size={14} />
              <span>Show Voice Commands</span>
            </>
          ) : (
            <>
              <ChevronDown size={14} />
              <span>Hide Controls</span>
            </>
          )}
        </button>

        {!controlsCollapsed && (
          <div className="w-full rounded-2xl bg-[#141418] border border-neutral-700/80 p-3.5 shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              {/* Mic Toggle Button */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-xs transition-colors cursor-pointer ${
                  isMuted
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : 'bg-white text-black hover:bg-neutral-200'
                }`}
              >
                {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                <span>{isMuted ? 'Muted' : 'Listening Active'}</span>
              </button>

              {/* Dynamic Sound Waveform Bars */}
              <div className="flex-1 flex items-center justify-center space-x-1 px-2 h-8">
                {[35, 75, 50, 90, 60, 85, 45, 95, 70, 50, 80, 65, 90, 45, 60].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-100 ${
                      isSpeakingOut
                        ? 'bg-emerald-400'
                        : liveTranscript
                        ? 'bg-amber-400'
                        : isMuted
                        ? 'bg-neutral-800'
                        : 'bg-neutral-500'
                    }`}
                    style={{
                      height: isMuted ? '4px' : `${Math.max(4, h * (isSpeakingOut ? 0.9 : 0.4))}px`,
                    }}
                  />
                ))}
              </div>

              {/* Quick Speech Command Shortcuts */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleProcessSpeech('create a new chat')}
                  className="px-2.5 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700 text-[11px] text-neutral-300 hover:text-white cursor-pointer"
                >
                  + New Chat
                </button>
                <button
                  type="button"
                  onClick={() => handleProcessSpeech('generate image of cosmic galaxy')}
                  className="px-2.5 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700 text-[11px] text-neutral-300 hover:text-white cursor-pointer"
                >
                  Generate Image
                </button>
              </div>
            </div>

            {/* Quick PC/Laptop & Mobile Action Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-neutral-800/80">
              <span className="text-[10px] uppercase font-mono text-neutral-400 shrink-0 mr-1">Controls:</span>
              <button
                type="button"
                onClick={() => handleProcessSpeech('export data')}
                className="px-2 py-1 rounded-md bg-neutral-800/80 hover:bg-neutral-700 text-[11px] text-neutral-300 hover:text-white shrink-0 cursor-pointer border border-neutral-700/60"
              >
                💾 Backup Data
              </button>
              <button
                type="button"
                onClick={() => handleProcessSpeech('export chat')}
                className="px-2 py-1 rounded-md bg-neutral-800/80 hover:bg-neutral-700 text-[11px] text-neutral-300 hover:text-white shrink-0 cursor-pointer border border-neutral-700/60"
              >
                📥 Save Chat
              </button>
              <button
                type="button"
                onClick={() => handleProcessSpeech('toggle full screen')}
                className="px-2 py-1 rounded-md bg-neutral-800/80 hover:bg-neutral-700 text-[11px] text-neutral-300 hover:text-white shrink-0 cursor-pointer border border-neutral-700/60"
              >
                🖥️ Full Screen
              </button>
              <button
                type="button"
                onClick={() => handleProcessSpeech('attach file')}
                className="px-2 py-1 rounded-md bg-neutral-800/80 hover:bg-neutral-700 text-[11px] text-neutral-300 hover:text-white shrink-0 cursor-pointer border border-neutral-700/60"
              >
                📎 Attach File
              </button>
              <button
                type="button"
                onClick={() => handleProcessSpeech('copy response')}
                className="px-2 py-1 rounded-md bg-neutral-800/80 hover:bg-neutral-700 text-[11px] text-neutral-300 hover:text-white shrink-0 cursor-pointer border border-neutral-700/60"
              >
                📋 Copy Text
              </button>
              <button
                type="button"
                onClick={() => handleProcessSpeech('toggle theme')}
                className="px-2 py-1 rounded-md bg-neutral-800/80 hover:bg-neutral-700 text-[11px] text-neutral-300 hover:text-white shrink-0 cursor-pointer border border-neutral-700/60"
              >
                🌓 Theme
              </button>
              <button
                type="button"
                onClick={() => handleProcessSpeech('switch to pro')}
                className="px-2 py-1 rounded-md bg-neutral-800/80 hover:bg-neutral-700 text-[11px] text-neutral-300 hover:text-white shrink-0 cursor-pointer border border-neutral-700/60"
              >
                ⚡ Pro Engine
              </button>
              <button
                type="button"
                onClick={() => handleProcessSpeech('check battery status')}
                className="px-2 py-1 rounded-md bg-neutral-800/80 hover:bg-neutral-700 text-[11px] text-neutral-300 hover:text-white shrink-0 cursor-pointer border border-neutral-700/60"
              >
                🔋 Battery
              </button>
              <button
                type="button"
                onClick={() => handleProcessSpeech('phone vibrate karo')}
                className="px-2 py-1 rounded-md bg-neutral-800/80 hover:bg-neutral-700 text-[11px] text-neutral-300 hover:text-white shrink-0 cursor-pointer border border-neutral-700/60"
              >
                📳 Haptic
              </button>
            </div>

            {/* Voice Command Hints Strip */}
            <div className="text-[11px] text-neutral-400 font-sans flex flex-wrap items-center justify-center gap-2 border-t border-neutral-800 pt-2 text-center">
              <span>Speak commands:</span>
              <span className="text-neutral-300 font-medium">&ldquo;Backup workspace&rdquo;</span>
              <span>·</span>
              <span className="text-neutral-300 font-medium">&ldquo;Save chat&rdquo;</span>
              <span>·</span>
              <span className="text-neutral-300 font-medium">&ldquo;Full screen karo&rdquo;</span>
              <span>·</span>
              <span className="text-neutral-300 font-medium">&ldquo;File upload karo&rdquo;</span>
              <span>·</span>
              <span className="text-neutral-300 font-medium">&ldquo;Battery check koro&rdquo;</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
