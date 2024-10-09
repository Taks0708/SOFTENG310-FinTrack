export function cleanResponse(response) {
    // Split the response into sections based on double asterisks
    const sections = response.split(/\*\*(.*?)\*\*/g).filter(Boolean);

    // Create an array to hold formatted tips
    const formattedResponse = [];

    for (let i = 0; i < sections.length; i += 2) {
        if (sections[i]) {
            const title = sections[i].trim(); // The title of the tip
            const content = sections[i + 1]
                ? sections[i + 1].trim().split(/\*\s*/)
                : []; // Split bullet points

            formattedResponse.push({
                title,
                content: content.filter(Boolean).map((item) => item.trim()), // Clean up the content
            });
        }
    }

    return formattedResponse;
}
