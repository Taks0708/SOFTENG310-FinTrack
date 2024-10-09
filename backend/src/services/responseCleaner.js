/**
 * Used for cleaning results from Gemini api responses.
 * Cleans the response by splitting it into sections based on double asterisks
 * and formats it into an array of objects containing title and content.
 *
 * @param {string} response - The response string to be cleaned.
 * @returns {Array} - An array of formatted response objects.
 */
function cleanResponse(response) {
    // Split the response into sections based on double asterisks
    const sections = response.split(/\*\*(.*?)\*\*/g).filter(Boolean);

    // Create an array to store formatted responses
    const formattedResponse = [];

    for (let i = 0; i < sections.length; i += 2) {
        if (sections[i]) {
            const title = sections[i].trim(); // The title of the resonse
            const content = sections[i + 1]
                ? sections[i + 1].trim().split(/\*\s*/)
                : []; // Split bullet points
            console.log("title: ", title);
            console.log("content: ", content);
            formattedResponse.push({
                title,
                content: content.filter(Boolean).map((item) => item.trim()), // Clean up the content
            });
        }
    }

    return formattedResponse;
}

module.exports = {
    cleanResponse,
};
