'use client';
import { usePdfStore } from "@/lib/store";
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import * as React from "react";
interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function ChatbotPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [localTitle, setLocalTitle] = useState<string | null>(null);
    const [localContext, setLocalContext] = useState<string | null>(null);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [context, setContext] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { paragraph, summary ,title} = usePdfStore();
    const router = useRouter();

    const goToHome = () => {
        router.push('/');
    };

    const DEFAULT_CONTEXT = paragraph + " this is the context. Answer resume related questions in short within three sentences do not include any special character";



    useEffect(() => {
        const localParagraph = localStorage.getItem("paragraph");
        setLocalTitle(localStorage.getItem("title"));
        setLocalContext(localParagraph);

        // Use localStorage value if available, otherwise use store value
        setContext(localParagraph || paragraph || "");
    }, []);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();

    }, [messages]);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/ask-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    history: messages,
                    context: context ,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const assistantMessage: Message = {
                    role: 'assistant',
                    content: data.response,
                };
                setMessages((prev) => [...prev, assistantMessage]);
            } else {
                const errorMessage: Message = {
                    role: 'assistant',
                    content: data.error || 'Failed to get response',
                };
                setMessages((prev) => [...prev, errorMessage]);
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearChat = () => {
        setMessages([]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-7 gap-4 h-[calc(100vh-2rem)]">
                    <div className='lg:col-span-2 lg:row-span-1'>
                        <div className="flex justify-center items-center mb-6 mt-2">

                            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
                                ResumeGenie
                            </h1>

                        </div>
                        <p className='text-2xl font-medium'>Welcome {localTitle}</p>
                    </div>
                    {/* Resume Summary Panel */}
                    <div className="lg:col-span-1 lg:row-span-5 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">Resume</h2>
                                    <p className="text-green-100 text-sm mt-1">
                                        AI-generated analysis
                                    </p>
                                </div>
                                <div className="text-2xl">📄</div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {paragraph || localContext ? (
                                <div className="space-y-4">
                                    <div className="prose prose-sm max-w-none p-2">
                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-l-4 border-green-500">
                                            <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                                                <span className="mr-2">✨</span>

                                            </h3>
                                            {/*<p className="text-gray-700 leading-relaxed whitespace-pre-wrap">*/}
                                            {/*    {paragraph}*/}
                                            {/*</p>*/}
                                            <div className="prose prose-sm max-w-none [&>*]:m-0 [&>p]:leading-relaxed">
                                                <ReactMarkdown
                                                    components={{
                                                        strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                                                        em: ({node, ...props}) => <em className="italic" {...props} />,
                                                        p: ({node, ...props}) => <p className="whitespace-pre-wrap break-words" {...props} />
                                                    }}
                                                >
                                                    {paragraph || localContext}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                        <div className="flex items-center text-blue-700 mb-2">
                                            <span className="mr-2">💡</span>
                                            <span className="font-medium">Tips</span>
                                        </div>
                                        <p className="text-sm text-blue-600">
                                            Ask questions about this resume in the chat to get personalized insights and recommendations.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                                    <div className="text-6xl mb-4">📄</div>
                                    <h3 className="text-lg font-medium mb-2">No Resume Data</h3>
                                    <p className="text-sm">
                                        Upload a resume to see the AI-generated summary here.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chat Interface */}
                    <div className="lg:col-span-1 lg:row-span-5 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-xl font-bold">AI Chatbot</h1>
                                    <p className="text-blue-100 text-xs mt-1">
                                        Powered by Gemini
                                    </p>
                                </div>
                                {messages.length > 0 && (
                                    <button
                                        onClick={handleClearChat}
                                        className="px-3 py-1 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-all"
                                    >
                                        Clear Chat
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-500 mt-12">
                                    <div className="text-5xl mb-4">💬</div>
                                    <p className="text-lg font-medium">Start a conversation</p>
                                    <p className="text-sm mt-2">
                                        Ask questions about the resume summary
                                    </p>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${
                                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                                            msg.role === 'user'
                                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        {/*<p className="whitespace-pre-wrap break-words">*/}
                                        {/*    {msg.content}*/}
                                        {/*</p>*/}
                                        <div className="prose prose-sm max-w-none [&>*]:m-0 [&>p]:leading-relaxed">
                                            <ReactMarkdown
                                                components={{
                                                    strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                                                    em: ({node, ...props}) => <em className="italic" {...props} />,
                                                    p: ({node, ...props}) => <p className="whitespace-pre-wrap break-words" {...props} />
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>

                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 rounded-2xl px-5 py-3">
                                        <div className="flex space-x-2">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form
                            onSubmit={handleSubmit}
                            className="border-t border-gray-200 p-4 bg-gray-50"
                        >
                            <div className="flex space-x-3">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message..."
                                    disabled={loading}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !input.trim()}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="mt-4 lg:col-span-2 lg:row-span1 flex justify-center">
                        <button
                            onClick={goToHome}
                            className="px-6 py-3 bg-transparent text-black rounded-xl font-medium  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all flex items-center space-x-2"
                        >
                            <span>←</span>
                            <span>Back to Previous Page</span>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ChatbotPage;