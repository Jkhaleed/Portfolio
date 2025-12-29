// app/api/azure-chat/route.tsx
import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1️⃣ Environment variables
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT!;
    const apiKey = process.env.AZURE_OPENAI_API_KEY!;
    const deployment = process.env.AZURE_OPENAI_MODEL!; // Deployment name exactly as in Azure portal

    if (!endpoint || !apiKey || !deployment) {
      return NextResponse.json(
        { error: "Missing Azure OpenAI environment variables." },
        { status: 500 }
      );
    }

    // 2️⃣ Initialize OpenAI client
    const client = new OpenAI({
      apiKey,
      baseURL: endpoint, // Just the resource URL
    });

    // 3️⃣ Chat completion request
    const response = await client.chat.completions.create({
      model: deployment, // Must be the deployment name
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Why is JavaScript better than Python?" },
      ],
      max_tokens: 128,
    });

    // 4️⃣ Return the response
    return NextResponse.json({
      message: response.choices[0].message?.content ?? "",
    });
  } catch (err: any) {
    console.error("Azure OpenAI error:", err);
    return NextResponse.json(
      { error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
