// app/api/generate/route.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Google AI with Gemini Flash
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

// The prompt template for generating questions
const PROMPT = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?|| What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;

export async function GET() {
  try {
    // Get the Gemini Flash model
    // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

    // Generate content
    const result = await model.generateContent(PROMPT);
    const response = await result.response;
    const text = response.text();

    // Format the questions into an array
    const questions = text.split('|l').map(q => q.trim());

    return NextResponse.json({ 
      success: true, 
      questions,
      raw: text 
    });

  } catch (error: any) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to generate questions' 
      },
      { status: 500 }
    );
  }
}