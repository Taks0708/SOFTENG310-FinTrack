const { expect } = require("chai");
const { cleanResponse } = require("../../src/services/responseCleaner.js");

/**
 * Unit tests for the responseCleaner
 *
 * This file contains unit tests for the responseCleaner.
 * uses Chai to make assertions.
 * @module services
 * @dependencies chai, sinon, responseCleaner.js
 */

describe("cleanResponse", () => {
    it("should return an array of objects with title and content from a formatted response string", () => {
        const response = `**Title 1** content1. **Title 2** content2.`;
        const expected = [
            {
                title: "Title 1",
                content: ["content1."],
            },
            {
                title: "Title 2",
                content: ["content2."],
            },
        ];

        const result = cleanResponse(response);
        expect(result).to.deep.equal(expected);
    });

    it("should handle spaces correctly in the content", () => {
        const response = `**Title 1** Body 1 Body 2  **Title 2** Body 3`;
        const expected = [
            {
                title: "Title 1",
                content: ["Body 1 Body 2"],
            },
            {
                title: "Title 2",
                content: ["Body 3"],
            },
        ];

        const result = cleanResponse(response);
        console.log(result);
        expect(result).to.deep.equal(expected);
    });

    it("should ignore empty sections and return an empty array if no valid content", () => {
        const response = `**Title 1** **Title 2**`;
        const expected = [
            {
                title: "Title 1",
                content: [],
            },
            {
                title: "Title 2",
                content: [],
            },
        ];

        const result = cleanResponse(response);
        expect(result).to.deep.equal(expected);
    });

    it("should trim titles and content from the double asterisks", () => {
        const response = `** Title 1 **  **Title 2**  ** Title 3 **   i am content 3  `;
        const expected = [
            {
                title: "Title 1",
                content: [],
            },
            {
                title: "Title 2",
                content: [],
            },
            {
                title: "Title 3",
                content: ["i am content 3"],
            },
        ];

        const result = cleanResponse(response);
        expect(result).to.deep.equal(expected);
    });

    it("should return an empty array for an empty string", () => {
        const response = "";
        const expected = [];

        const result = cleanResponse(response);
        expect(result).to.deep.equal(expected);
    });
});
