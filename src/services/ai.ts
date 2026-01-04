import type { IAIService } from '../types';
import { GoogleGenerativeAI } from "@google/generative-ai";

class AIService implements IAIService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }
  }

  async processImage(imageUrl: string): Promise<{ markdown: string; svg?: string }> {
    // If no key or mock mode, return mock data
    if (!this.model) {
      return this.getMockResponse();
    }

    try {
      // Fetch image and convert to base64
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const base64Data = await this.fileToGenerativePart(blob);

      const prompt = `
        Analyze this handwritten note.
        1. Transcribe the text and summarize it nicely in Markdown.
        2. If there are any diagrams, drawings, or figures, generate valid SVG code for them.
        3. Return ONLY a JSON object with keys: "markdown" and "svg" (optional).
        4. Do not wrap the JSON in markdown code blocks.
      `;

      const result = await this.model.generateContent([prompt, base64Data]);
      const text = result.response.text();
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

      return JSON.parse(cleanText);
    } catch (error) {
      console.error("AI Processing Error:", error);
      return this.getMockResponse();
    }
  }

  private async fileToGenerativePart(file: Blob): Promise<{ inlineData: { data: string; mimeType: string } }> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve({
          inlineData: { data: base64String, mimeType: file.type },
        });
      };
      reader.readAsDataURL(file);
    });
  }

  private getMockResponse() {
    return new Promise<{ markdown: string; svg?: string }>((resolve) => {
      setTimeout(() => {
        resolve({
          markdown: `
# Lecture: The Solar System

*   **Sun**: The center of our system. Huge ball of plasma.
*   **Planets**:
    1.  Mercury
    2.  Venus
    3.  Earth (Home!)
    4.  Mars

## Key Concepts
*   Gravity holds it together.
*   Orbits are elliptical.
          `,
          svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="50" fill="yellow" stroke="orange" stroke-width="5" />
  <circle cx="140" cy="100" r="10" fill="blue" />
  <path d="M 60 100 A 40 40 0 0 1 140 100 A 40 40 0 0 1 60 100" fill="none" stroke="gray" stroke-dasharray="5,5" />
</svg>`
        });
      }, 2000);
    });
  }
}

export const aiService = new AIService();
