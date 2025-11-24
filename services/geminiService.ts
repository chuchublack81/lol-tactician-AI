import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ChampionGuide } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const guideSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    championName: { type: Type.STRING },
    championId: { type: Type.STRING, description: "ID exacto de DataDragon (PascalCase, sin espacios ni caracteres especiales, ej: 'LeeSin', 'MissFortune', 'Wukong' -> 'MonkeyKing', 'Kai'Sa' -> 'Kaisa')" },
    title: { type: Type.STRING, description: "Título del campeón, e.g., 'La Espada de los Darkin'" },
    role: { type: Type.STRING, description: "Rol principal (Top, Jungle, Mid, ADC, Support)" },
    playstyle: { type: Type.STRING, description: "Breve descripción del estilo de juego" },
    combos: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          difficulty: { type: Type.STRING, enum: ["Fácil", "Medio", "Difícil", "Insano"] },
          sequence: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Teclas exactas en orden (Q, W, E, R, AA, Flash, Ignite)"
          },
          description: { type: Type.STRING },
          damageType: { type: Type.STRING, enum: ["Burst", "Sustain", "Poke", "All-in"] }
        },
        required: ["name", "difficulty", "sequence", "description", "damageType"]
      }
    },
    runes: {
      type: Type.OBJECT,
      properties: {
        primary: {
          type: Type.OBJECT,
          properties: {
            treeName: { type: Type.STRING },
            treeIcon: { type: Type.STRING, description: "Ruta de archivo DataDragon para el icono del árbol (ej: 'perk-images/Styles/7201_Precision.png')" },
            keystone: { type: Type.STRING },
            keystoneIcon: { type: Type.STRING, description: "Ruta de archivo DataDragon para la runa clave (ej: 'perk-images/Styles/Precision/Conqueror/Conqueror.png')" },
            slots: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["treeName", "keystone", "slots", "treeIcon", "keystoneIcon"]
        },
        secondary: {
          type: Type.OBJECT,
          properties: {
            treeName: { type: Type.STRING },
            treeIcon: { type: Type.STRING },
            keystone: { type: Type.STRING }, 
            keystoneIcon: { type: Type.STRING },
            slots: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["treeName", "slots", "treeIcon"]
        },
        shards: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["primary", "secondary", "shards"]
    },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, enum: ["Core", "Botas", "Situacional"] },
          items: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                id: { type: Type.STRING, description: "ID numérico de DataDragon actual (ej: '3031' para Filo Infinito)" }
              },
              required: ["name", "id"]
            } 
          },
          reason: { type: Type.STRING }
        },
        required: ["category", "items", "reason"]
      }
    },
    tips: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["championName", "championId", "role", "combos", "runes", "items", "tips", "title", "playstyle"]
};

export const fetchChampionGuide = async (championName: string): Promise<ChampionGuide> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Genera una guía competitiva y avanzada para League of Legends del campeón: ${championName}. 
      Incluye combos detallados (usando Q, W, E, R, AA), la mejor configuración de runas actual y los mejores objetos (items).
      
      IMPORTANTE:
      1. Proporciona el ID exacto de DataDragon para el campeón (PascalCase, sin espacios, ej: "TwistedFate").
      2. Para los ITEMS, proporciona el ID numérico de DataDragon más reciente que conozcas.
      3. Para las RUNAS, proporciona la ruta de la imagen ('perk-images/...') si es posible, o al menos el nombre exacto en inglés para facilitar la búsqueda.
      4. Asegúrate de que los items sean actuales de la última temporada (Season 14+).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: guideSchema,
        systemInstruction: "Eres un entrenador Challenger de League of Legends. Eres preciso, técnico y estratégico. Responde en Español, pero usa IDs y rutas de imagen técnicas correctas."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as ChampionGuide;
  } catch (error) {
    console.error("Error fetching guide:", error);
    throw error;
  }
};