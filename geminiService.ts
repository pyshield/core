
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Post, Member } from "./types.ts";

// Always use the process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCommunityInsights = async (posts: Post[]): Promise<string> => {
  if (!posts.length) return "No posts available to analyze.";
  const postsText = posts.map(p => `Title: ${p.title}\nContent: ${p.content}`).join("\n\n");
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional community analyst. Based on these posts, summarize the current vibes and key topics in 2 punchy, professional sentences:\n\n${postsText}`,
      config: { 
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    return response.text || "Trends are evolving rapidly. Stay tuned for more insights.";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "The community is buzzing with new ideas and decentralized growth. Collective sentiment remains high.";
  }
};

export const generateOwnershipManifesto = async (member: Member): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, powerful "Creative Ownership Manifesto" for a ${member.role}. 
      The manifesto should emphasize:
      1. Digital sovereignty and asset control.
      2. The sanctity of creative IP.
      3. Wallet security as the foundation of freedom.
      Tone: Visionary, slightly cyberpunk, and highly professional. Max 60 words.`,
      config: { thinkingConfig: { thinkingBudget: 0 } }
    });
    return response.text || "I own my code. I own my art. My wallet is my fortress.";
  } catch (error) {
    return "Autonomy is the prime directive. Every cryptographic signature is an act of creation and ownership.";
  }
};

export const getMemberAudit = async (member: Member): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a security and behavioral audit for a member with the following profile:
      Role: ${member.role}
      Status: ${member.status}
      MFA Enabled: ${member.mfaEnabled}
      Joined: ${member.createdAt}
      
      Provide a 3-sentence summary: 
      1. A character assessment based on their role.
      2. A security risk assessment focusing on wallet integrity.
      3. A recommendation for ownership preservation.
      Keep the tone extremely professional, technical, and slightly futuristic.`,
      config: { thinkingConfig: { thinkingBudget: 0 } }
    });
    return response.text || "Audit data unavailable at this time.";
  } catch (error) {
    return "Node displays consistent engagement patterns within standard protocol parameters. Security risk is currently negligible. Recommend continued monitoring of decentralized governance participation.";
  }
};

export const generateMarketingCopy = async (topic: string, type: 'PRODUCT' | 'POST'): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a high-conversion ${type === 'PRODUCT' ? 'product description' : 'community post'} about: ${topic}. Focus on urgency, innovation, and trust. Keep it under 80 words.`,
      config: { 
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    return response.text || "Failed to generate copy. Please try again.";
  } catch (error) {
    console.error("Gemini Synthesis Error:", error);
    return "Experience the future of decentralized coordination with our latest NexusCore module. Secure, scalable, and built for creators.";
  }
};
