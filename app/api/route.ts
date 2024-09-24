const url = process.env.NEXT_OLLAMA_URL + "/api/generate";

import { NextResponse } from "next/server";
const model = process.env.NEXT_OLLAMA_MODEL;

function getOllamaPayload(prompt: string) {
	return {
		model: model,
		prompt: prompt,
	};
}

export async function POST(request: Request) {

}

export async function GET(request: Request) {
    const payload = getOllamaPayload("why is the sky blue")

    // Make an API request to Ollama's API
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    
    const reader = response.body?.getReader();
    if (!reader) {
        throw new Error("Failed to get response reader");
    }
    const stream = new ReadableStream({
        async pull(controller) {
            const { done, value } = await reader.read();

            if (done) {
                controller.close();
                return;
            }

            // Assuming the response is a stream of text chunks
            const chunk = new TextDecoder("utf-8").decode(value);
            const lines = chunk.split("\n").filter(Boolean);

            lines.forEach((line) => {
                const token = JSON.parse(line) as OllamaChunk
                controller.enqueue(token.response);
            });
        },
    });

    return new Response(stream, {
        headers: { 
            'Content-Type': 'text/event-stream', // Use event-stream for SSE
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        },
    });
}
