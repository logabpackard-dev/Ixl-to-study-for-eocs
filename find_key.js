import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  console.log("Searching for working TMDB API keys using Google Search Grounding...");
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Search the web for several real, active, public TMDB (The Movie Database) API key v3 strings (32-character hex codes) that are hardcoded in public repositories (e.g. GitHub) or tutorial blogs. Return them as a raw JSON list of strings, e.g. ['key1', 'key2']. Do not include explanation, just the JSON.",
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text.trim();
    console.log("Gemini Response with Grounding:", text);
    
    // Clean JSON markdown blocks if any
    const cleanText = text.replace(/```json|```/g, "").trim();
    const keys = JSON.parse(cleanText);
    
    if (!Array.isArray(keys)) {
      throw new Error("Response is not an array");
    }

    console.log(`Found ${keys.length} candidate keys. Testing them...`);
    
    for (const key of keys) {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/550?api_key=${key}`);
        if (res.ok) {
          console.log(`\n🎉 WORKING KEY FOUND: ${key}\n`);
          process.exit(0);
        } else {
          console.log(`Key ${key} failed with status: ${res.status}`);
        }
      } catch (e) {
        console.log(`Key ${key} error:`, e.message);
      }
    }
    
    console.log("No working key found in this batch.");
  } catch (error) {
    console.error("Error finding keys:", error);
  }
}

run();
