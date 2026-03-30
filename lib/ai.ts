
import { GoogleGenAI, Modality, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function transcribeAudio(base64Audio: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          { text: "Transcenda este áudio para texto em Português do Brasil. Retorne apenas a transcrição, sem comentários." },
          { inlineData: { mimeType: 'audio/wav', data: base64Audio } }
        ]
      }
    ]
  });
  return response.text;
}

export async function suggestTactics(goal: string) {
  const ai = getAI();
  // Rules for Search Grounding: Cannot use responseMimeType: "application/json"
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Utilizando a metodologia "12 Week Year" de Brian Moran, sugira 5 táticas semanais concretas, específicas e mensuráveis para a seguinte meta: "${goal}". 
    Pesquise as melhores práticas e tendências atuais do mercado para esta meta.
    Formate sua resposta estritamente como uma lista numerada, uma tática por linha. Não adicione introduções ou conclusões.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  
  const text = response.text || '';
  const tactics = text
    .split('\n')
    .map(line => line.replace(/^\d+[\.\-]\s*/, '').trim())
    .filter(line => line.length > 0)
    .slice(0, 5);

  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = groundingChunks
    .filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({
      title: chunk.web.title || 'Referência',
      uri: chunk.web.uri
    }));

  return { 
    tactics: tactics.length > 0 ? tactics : ["Focar na execução diária", "Revisar progresso semanalmente"], 
    sources 
  };
}

export async function refineVision(visionText: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Refine o seguinte rascunho de visão para torná-lo mais aspiracional, emocional e poderoso, mantendo o sentido original: "${visionText}"`,
    config: {
      thinkingConfig: { thinkingBudget: 2000 }
    }
  });
  return response.text;
}

// Audio Utils - Optimized with TypedArray operations
export function encode(bytes: Uint8Array): string {
  // Use chunked processing to avoid call stack issues and improve performance
  const chunkSize = 0x8000; // 32KB chunks
  let binary = '';
  
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk as unknown as number[]);
  }
  
  return btoa(binary);
}

export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  
  // Process in chunks for better performance
  const chunkSize = 0x8000;
  for (let i = 0; i < len; i += chunkSize) {
    const chunkEnd = Math.min(i + chunkSize, len);
    for (let j = i; j < chunkEnd; j++) {
      bytes[j] = binaryString.charCodeAt(j);
    }
  }
  
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  // Optimized: Process all channels with direct TypedArray access
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    // Use a single loop with direct indexing for better cache locality
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  
  return buffer;
}
