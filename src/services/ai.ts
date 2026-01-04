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
        2. Use LaTeX notation for ALL mathematical equations, formulas, and symbols (e.g., $E=mc^2$, $\\frac{1}{2}$).
        3. If there are any diagrams, drawings, or figures, generate valid SVG code for them.
        4. Return ONLY a JSON object with keys: "markdown" and "svg" (optional).
        5. Do not wrap the JSON in markdown code blocks.
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
# Lecture: Quadratic Equations

The general form of a quadratic equation is:
$$ax^2 + bx + c = 0$$

To find the roots, we use the quadratic formula:
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

## Example
If $a=1, b=-3, c=2$:
$$x = \\frac{3 \\pm \\sqrt{(-3)^2 - 4(1)(2)}}{2(1)} = \\frac{3 \\pm 1}{2}$$
Roots are $x=2$ and $x=1$.
          `,
          svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path d="M 20 180 Q 100 20 180 180" fill="none" stroke="blue" stroke-width="2" />
  <line x1="10" y1="180" x2="190" y2="180" stroke="black" />
  <line x1="100" y1="10" x2="100" y2="190" stroke="black" />
</svg>`
        });
      }, 2000);
    });
  }
}

export const aiService = new AIService();
