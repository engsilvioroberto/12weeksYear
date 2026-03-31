
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Mic, MicOff, X, Sparkles, Loader2 } from 'lucide-react';
import { encode, decode, decodeAudioData } from '../lib/ai';

interface AICoachProps {
  onClose: () => void;
  context: string;
}

export const AICoach: React.FC<AICoachProps> = ({ onClose, context }) => {
  const [status, setStatus] = useState<'connecting' | 'active' | 'error'>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    const initLive = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const inputAudioContext = new AudioContext({ sampleRate: 16000 });
        const outputAudioContext = new AudioContext({ sampleRate: 24000 });
        audioContextRef.current = outputAudioContext;

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          callbacks: {
            onopen: () => {
              setStatus('active');
              const source = inputAudioContext.createMediaStreamSource(stream);
              const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
              scriptProcessor.onaudioprocess = (e) => {
                if (isMuted) return;
                const inputData = e.inputBuffer.getChannelData(0);
                const int16 = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                  int16[i] = inputData[i] * 32768;
                }
                const pcmBlob = {
                  data: encode(new Uint8Array(int16.buffer)),
                  mimeType: 'audio/pcm;rate=16000',
                };
                sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
              };
              source.connect(scriptProcessor);
              scriptProcessor.connect(inputAudioContext.destination);
            },
            onmessage: async (msg) => {
              const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
              if (audioData) {
                const buffer = await decodeAudioData(decode(audioData), outputAudioContext, 24000, 1);
                const source = outputAudioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(outputAudioContext.destination);
                
                const startTime = Math.max(nextStartTimeRef.current, outputAudioContext.currentTime);
                source.start(startTime);
                nextStartTimeRef.current = startTime + buffer.duration;
                
                sourcesRef.current.add(source);
                source.onended = () => sourcesRef.current.delete(source);
              }
              if (msg.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => s.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
              }
            },
            onerror: () => setStatus('error'),
            onclose: () => onClose()
          },
          config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: `Você é um mentor de performance baseado no livro "12 Week Year". 
            Ajude o usuário com sua RSR (Reunião Semanal de Responsabilidade). 
            Contexto atual do usuário: ${context}. Seja breve, direto e motivador.`,
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } }
          }
        });

        sessionRef.current = await sessionPromise;
      } catch (e) {
        console.error(e);
        setStatus('error');
      }
    };

    initLive();
    return () => {
      sessionRef.current?.close();
      audioContextRef.current?.close();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
      <div className="bg-gray-900 w-full max-w-lg rounded-[2rem] p-8 md:p-12 text-white text-center relative overflow-hidden shadow-2xl border border-white/10">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        <div className="relative mb-10 inline-block">
          <div className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-700 ${status === 'active' ? 'bg-emerald-500 scale-100 shadow-[0_0_40px_rgba(16,185,129,0.4)]' : 'bg-white/5 scale-90'}`}>
            {status === 'connecting' ? (
              <Loader2 size={40} className="text-white/40 animate-spin" />
            ) : (
              <Sparkles size={40} className="text-white animate-pulse" />
            )}
          </div>
          {status === 'active' && !isMuted && (
            <div className="absolute -inset-4 rounded-full border border-emerald-500/30 animate-ping duration-1000" />
          )}
        </div>
        
        <h2 className="text-2xl font-semibold mb-2">Mentor de Performance</h2>
        <p className="text-white/50 text-sm mb-12 max-w-xs mx-auto leading-relaxed">
          {status === 'connecting' ? 'Sintonizando com a sua visão...' : 'Ouvindo... Como foi a sua execução esta semana?'}
        </p>

        <div className="flex justify-center space-x-6">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-500 shadow-lg shadow-red-500/20' : 'bg-white/10 hover:bg-white/20'}`}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          <button 
            onClick={onClose}
            className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {status === 'error' && (
          <p className="mt-8 text-red-400 text-xs font-medium bg-red-400/10 py-2 px-4 rounded-lg inline-block">
            Ops! Falha na conexão. Verifique sua chave de API.
          </p>
        )}
      </div>
    </div>
  );
};
