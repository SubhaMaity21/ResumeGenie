

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const { message, history, context } = await req.json();

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }


        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });


        const chatHistory = [];


        if (context) {
            chatHistory.push(
                {
                    role: 'user',
                    parts: [{ text: context }],
                },
                {
                    role: 'model',
                    parts: [{ text: 'I understand. I will use this context to answer questions accurately and helpfully.' }],
                }
            );
        }


        if (history && Array.isArray(history)) {
            history.forEach((msg: { role: string; content: string }) => {
                chatHistory.push({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }],
                });
            });
        }


        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.6,
            },
        });


        const result = await chat.sendMessage(message);
        const response = result.response;
        const text = response.text();

        return NextResponse.json({ response: text });
    } catch (error) {
        console.error('Gemini API Error:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}

