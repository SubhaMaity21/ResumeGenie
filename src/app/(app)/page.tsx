"use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { usePdfStore } from "@/lib/store";
import {useRouter} from "next/navigation";
import PathDrawing from "@/components/PathDrawing";
import {formSchema} from "@/schema/formSchema";






export function PdfUploaderForm() {
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState("");
    const setPdfData = usePdfStore((state) => state.setPdfData);

    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { title: "", file: undefined },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const file = values.file?.[0];
        if (!file) return;

        // You can use title locally (not sent to API)
        console.log("Title:", values.title);

        setIsUploading(true);
        setMessage("");
        setProgress(20);


        const formData = new FormData();
        formData.append("file", file);


        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            setProgress(70);
            const data = await res.json();
            const response = data.summary; // e.g., "part1||part2"
            const [part1, part2] = response.split("||");

            if (res.ok) {
                localStorage.clear()
                setPdfData(values.title, part1,part2);
                localStorage.setItem("title", values.title);
                localStorage.setItem("paragraph",part1);
                localStorage.setItem("summary", part2);

                router.push("/result");
                // will comment out
                // console.log(part2)
                // setMessage(data.summery);
                // setMessage(`✅ Uploaded "${values.title}" successfully! PDF has ${data.summary} pages.`);
            } else {
                setMessage(`❌ Error: ${data.error}`);
            }

            setProgress(100);
        } catch (err) {
            console.error(err);
            setMessage("❌ Upload failed");
        } finally {
            setIsUploading(false);
        }




    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">

                <div className="text-center mb-12">
                    <div className="flex justify-center items-center mb-6">

                        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
                            ResumeGenie
                        </h1>

                    </div>

                    <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed">
                        Transform your resume with AI-powered analysis and insights
                    </p>

                    <p className="text-gray-500 max-w-3xl mx-auto">
                        Upload your PDF resume and let our intelligent AI analyze it to provide comprehensive
                        summaries, answer questions, and help you optimize your career documents with personalized recommendations.
                    </p>


                    <div className="flex flex-wrap justify-center gap-3 mt-8">
                        <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                             AI Analysis
                        </span>
                        <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                             Smart Chat
                        </span>
                        <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                             Instant Insights
                        </span>
                        <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                             Career Tips
                        </span>
                    </div>
                </div>


                <div className="max-w-lg mx-auto">
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                        {/* Form header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                            <div className="flex items-center">
                                <div className="text-3xl mr-3">📄</div>
                                <div>
                                    <h2 className="text-2xl font-bold">Upload Your Resume</h2>
                                    <p className="text-blue-100 text-sm mt-1">
                                        Get started with your AI-powered analysis
                                    </p>
                                </div>
                            </div>
                        </div>


                        <div className="p-8">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-semibold flex items-center">

                                                    Title
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Rohit Sharma"
                                                        className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />


                                    <FormField
                                        control={form.control}
                                        name="file"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-semibold flex items-center">

                                                    Choose PDF File
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type="file"
                                                            accept="application/pdf"
                                                            className="h-12 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium hover:file:bg-blue-100"
                                                            onChange={(e) => field.onChange(e.target.files)}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Maximum file size: 10MB. Only PDF files are supported.
                                                </p>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Progress bar */}
                                    {isUploading && (
                                        <div className="fixed inset-0 bg-gray-950 backdrop-blur-sm z-50 flex items-center justify-center">
                                            <div className="bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center">
                                                <PathDrawing />
                                                <p className="mt-6 text-xl font-semibold text-gray-800">Analyzing Your Resume...</p>
                                                <p className="mt-2 text-sm text-gray-500">This won't take long</p>
                                            </div>
                                        </div>
                                    )}



                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                                        disabled={isUploading}
                                    >
                                        {isUploading ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                                Processing...
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                <span className="mr-2">🚀</span>
                                                Analyze Resume
                                            </div>
                                        )}
                                    </Button>
                                </form>
                            </Form>


                            {message && (
                                <div className={`mt-6 p-4 rounded-xl ${
                                    message.includes('❌') 
                                        ? 'bg-red-50 border border-red-200 text-red-700' 
                                        : 'bg-green-50 border border-green-200 text-green-700'
                                }`}>
                                    <p className="text-center font-medium">{message}</p>
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            Your documents are processed securely and never stored permanently
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PdfUploaderForm;