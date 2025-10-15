import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
        }

        const fileBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(fileBuffer);

        const contents: Part[] = [
            { text: "Extract the texts and display it in structured way also create a summery within six sentence and seperate it by ||" },
            {
                inlineData: {
                    mimeType: file.type,
                    data: buffer.toString("base64")
                }
            }
        ];

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(contents);
        const response = result.response;
        const text = response.text();

        return NextResponse.json({ summary: text });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
