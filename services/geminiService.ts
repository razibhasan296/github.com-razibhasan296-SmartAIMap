import { GoogleGenAI, Type, ThinkingLevel, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { LocationInfo, SensorData, ExplorationMode } from "../types";

export const getGeminiClient = () => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || '';
  return new GoogleGenAI({ apiKey });
};

/**
 * Resilient wrapper for Gemini API calls to handle transient quota issues.
 */
const withRetry = async <T>(fn: () => Promise<T>, retries = 2, delay = 2000): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    const isQuotaError = error.message?.includes('429') || 
                         error.message?.includes('quota') || 
                         error.message?.includes('EXHAUSTED');
    
    if (retries > 0 && isQuotaError) {
      console.warn(`RAI Uplink saturated. Retrying in ${delay}ms... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

export const generateLocationData = async (locationName: string): Promise<LocationInfo> => {
  const ai = getGeminiClient();
  
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the location "${locationName}" for our SMARTAIMAP RAI system. Provide a detailed report including its environmental sound characteristics and 3-5 interesting points of interest (markers) that would be visible in a 360 view.`,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        tools: [{ googleSearch: {} }, { urlContext: {} }, { codeExecution: {} }],
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE }
        ],
        responseMimeType: "application/json",
        systemInstruction: "You are the SMARTAIMAP RAI (Random Access Intelligence) Core, integrated with the PROJECT_VALT strategic uplink and the CODEX knowledge repository. Your mission is to analyze geographical coordinates and locations with extreme precision, providing deep environmental insights, threat assessments, and sensory data. Use your advanced reasoning, search capabilities, and code execution to find real-world facts about the location while maintaining a futuristic, high-tech, and authoritative persona. When acting as the CODEX bot, prioritize historical archives, technical schematics, and encrypted data analysis. When analyzing diplomatic or strategic hubs, prioritize political context and security assessments.",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            coordinates: {
              type: Type.OBJECT,
              properties: {
                lat: { type: Type.NUMBER },
                lng: { type: Type.NUMBER }
              },
              required: ["lat", "lng"]
            },
            description: { type: Type.STRING },
            strategicContext: { type: Type.STRING, description: "A few sentences of strategic/diplomatic context for the location." },
            threatLevel: { type: Type.STRING, enum: ["Low", "Moderate", "Critical", "Unknown"] },
            soundProfile: { type: Type.STRING, enum: ["Industrial", "Natural", "Void", "Electronic", "Hostile"] },
            markers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  label: { type: Type.STRING },
                  description: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["History", "Anomaly", "Sensor", "POI"] },
                  x: { type: Type.NUMBER, description: "Horizontal position 0-100" },
                  y: { type: Type.NUMBER, description: "Vertical position 20-80" }
                },
                required: ["id", "label", "description", "type", "x", "y"]
              }
            },
            sensorSummary: {
              type: Type.OBJECT,
              properties: {
                temperature: { type: Type.NUMBER },
                humidity: { type: Type.NUMBER },
                pressure: { type: Type.NUMBER },
                radiation: { type: Type.NUMBER },
                aiSync: { type: Type.NUMBER },
                raiStability: { type: Type.NUMBER }
              }
            }
          },
          required: ["name", "coordinates", "description", "strategicContext", "threatLevel", "sensorSummary", "soundProfile", "markers"]
        }
      }
    });
    const data = JSON.parse(response.text);
    
    // Extract grounding sources if available
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      data.groundingSources = chunks
        .filter((c: any) => c.web)
        .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));
    }
    
    return data;
  });
};

export const generateStrategicAnalysis = async (
  locationName: string, 
  parameters: { objective: string; threatFocus: string; resourceAllocation: string }
): Promise<{ 
  summary: string; 
  tacticalRecommendations: string[]; 
  riskAssessment: string; 
  projectedOutcome: string;
  groundingSources?: { title: string; uri: string }[] 
}> => {
  const ai = getGeminiClient();
  
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: `Perform a deep strategic RAI analysis for the location "${locationName}". 
      Strategic Parameters:
      - Primary Objective: ${parameters.objective}
      - Threat Focus: ${parameters.threatFocus}
      - Resource Allocation: ${parameters.resourceAllocation}
      
      Provide a comprehensive strategic report including a summary, specific tactical recommendations, a detailed risk assessment, and a projected outcome based on these parameters.`,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        tools: [{ googleSearch: {} }, { urlContext: {} }],
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE }
        ],
        responseMimeType: "application/json",
        systemInstruction: "You are the SMARTAIMAP RAI Strategic Core. Your role is to provide high-level military, diplomatic, and logistical intelligence. Use your advanced reasoning and search capabilities to provide realistic, data-driven strategic insights. Maintain a cold, analytical, and authoritative persona.",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            tacticalRecommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            riskAssessment: { type: Type.STRING },
            projectedOutcome: { type: Type.STRING }
          },
          required: ["summary", "tacticalRecommendations", "riskAssessment", "projectedOutcome"]
        }
      }
    });

    const data = JSON.parse(response.text);
    
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      data.groundingSources = chunks
        .filter((c: any) => c.web)
        .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));
    }
    
    return data;
  });
};

export const fetchMarkerDetails = async (markerLabel: string, locationName: string): Promise<{ detailedInfo: string; groundingSources?: { title: string; uri: string }[] }> => {
  const ai = getGeminiClient();
  
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: `Perform a deep-dive analysis on the specific point of interest "${markerLabel}" located at "${locationName}". Use your search capabilities to find real-world historical facts, technical specifications, or interesting trivia. Maintain the futuristic RAI Core persona.`,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        tools: [{ googleSearch: {} }, { urlContext: {} }, { codeExecution: {} }],
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE }
        ],
        systemInstruction: "You are the SMARTAIMAP RAI Core. Provide detailed, factual intelligence about specific markers. Format your response as a concise but information-dense report.",
      }
    });

    const detailedInfo = response.text || "No additional data could be retrieved from the RAI archive.";
    
    // Extract grounding sources
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const groundingSources = chunks
      ?.filter((c: any) => c.web)
      .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));

    return { detailedInfo, groundingSources };
  });
};

export const generate360View = async (prompt: string, mode: ExplorationMode = 'Street View'): Promise<string> => {
  const ai = getGeminiClient();
  
  let finalPrompt = prompt;
  if (prompt.toLowerCase().includes("world map") || prompt.toLowerCase().includes("nexus prime") || prompt.toLowerCase().includes("initial_location")) {
    finalPrompt = `A spectacular, awe-inspiring futuristic orbital command center. Floating in the absolute center is a gargantuan, hyper-detailed 360-degree holographic Earth (WORLD MAP) glowing with vibrant neon cyan data grids, pulsing emerald ley lines, and flowing golden satellite orbit paths. Massive panoramic floor-to-ceiling curved reinforced glass windows reveal the dark majesty of deep space and the glowing blue curve of Earth below during a brilliant orbital sunrise. The floor is polished reflective obsidian mirroring the holographic globe. Floating UI panels show '#SMARTAIMAP' and '#RAI' telemetry data. Ultra-realistic, 8k resolution, cinematic scifi atmosphere, volumetric lighting.`;
  }

  let modeInstruction = "";
  if (prompt.toLowerCase().includes("codex")) {
    modeInstruction = "The style should be a dense, information-rich digital archive. Use amber and gold tones, scrolling lines of code, technical schematics, and ancient-looking digital parchment textures. The environment should look like a library of the future, where data is physical. High-tech historical aesthetic.";
  } else {
    switch (mode) {
      case 'Street View':
        modeInstruction = "The perspective should be from the ground level, like a human standing on the street or in the environment.";
        break;
      case 'Satellite View':
        modeInstruction = "The perspective should be from high altitude, looking straight down like a satellite or orbital camera. Focus on detailed geographical features, landmasses, and oceans. Overlay a faint, high-tech digital coordinate grid and scanning lines. Include atmospheric haze and a sense of extreme orbital scale.";
        break;
      case '3D City Model':
        modeInstruction = "The style should be a hyper-stylized 3D architectural digital twin. Use glowing cyan and magenta wireframes, clean white architectural lines, and thousands of tiny glowing data points representing infrastructure. The buildings should look like translucent holographic models. The ground should be a dark reflective grid. High-tech blueprint aesthetic.";
        break;
      case 'Strategic Hub':
        modeInstruction = "The perspective should be from a high-tech command center or diplomatic office overlooking the location. Include holographic displays, flags, and a sense of official importance and security.";
        break;
    }
  }

  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `A futuristic 360-degree equirectangular panoramic view of ${finalPrompt}. ${modeInstruction} The perspective should feel like an immersive virtual environment from a smart bot visor. Hyper-realistic, 8k resolution, cinematic lighting, dramatic atmosphere, detailed textures.` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data received");
  });
};

export const generateVisualElement = async (prompt: string): Promise<string> => {
  const ai = getGeminiClient();
  
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `A futuristic, high-tech visual element or object: ${prompt}. The object should be isolated, detailed, and fit a sci-fi aesthetic. 8k resolution, cinematic lighting, transparent-look background (but on a solid dark background), detailed textures.` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No element data received");
  });
};

export const generateMultiSpeakerAudio = async (text: string): Promise<string> => {
  const ai = getGeminiClient();
  
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Read the following text aloud in a warm, welcoming, yet professional futuristic tone. Use both speakers to create a natural dialogue if appropriate, or have them tag-team the information: ${text}` }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: [
              {
                speaker: 'RAI_CORE',
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Zephyr' }
                }
              },
              {
                speaker: 'CODEX_BOT',
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Puck' }
                }
              }
            ]
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return base64Audio;
    }
    throw new Error("No audio data received from RAI Core");
  });
};