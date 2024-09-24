async function main() {
    const payload = {
        'model': "llama3",
        'prompt': 'tell me about ghana'
    }
    const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }  // check if the response is ok

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullText = ''; // Variable to accumulate the full text response

    while (true) {
        const { done, value } = await reader.read();
        if (done) break; // Exit loop if done

        // Decode the chunk and split into lines
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(Boolean);

        // Process each line to extract the response text
        lines.forEach(line => {
            try {
                const json = JSON.parse(line);
                if (!json.done) {  // Only accumulate if done is false
                    fullText += json.response; // Accumulate the response text
                }
            } catch (error) {
                console.error('Failed to parse JSON:', error);
            }
        });
    }

    console.log(fullText);
    console.log("finished")

    // // Return the full accumulated text as a JSON response
    // return NextResponse.json({ text: fullText });


    // console.log(response.text())
    // console.log("Starting")
}

main()