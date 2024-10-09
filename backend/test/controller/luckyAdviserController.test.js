const { expect } = require("chai");
const sinon = require("sinon");
const {
    getLuckyAdvice,
} = require("../../src/controllers/luckyAdviserController");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { cleanResponse } = require("../../src/services/responseCleaner.js");

/**
 * Unit tests for the luckyAdviserController
 *
 * This file contains unit tests for the luckyAdviserController.
 * It uses the Sinon library to stub the functions of the GoogleGenerativeAI,
 * and uses Chai to make assertions.
 * @module controllers
 * @dependencies chai, sinon, responseCleaner.js, luckyAdviserController, GoogleGenerativeAI
 */

describe("luckyAdviserController", () => {
    let req, res, genAIStub, modelStub;

    beforeEach(() => {
        req = {
            body: {},
        };
        res = {
            send: sinon.spy(),
            status: sinon.stub().returnsThis(),
        };

        // Stub the GoogleGenerativeAI and its methods
        genAIStub = sinon.stub(
            GoogleGenerativeAI.prototype,
            "getGenerativeModel"
        );
        modelStub = { generateContent: sinon.stub() };
        genAIStub.returns(modelStub);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("getLuckyAdvice", () => {
        it("should return a successful response with cleaned advice", async () => {
            const mockResponse = {
                response: {
                    text: () => "**Financial Tip** Save money!",
                },
            };

            modelStub.generateContent.resolves(mockResponse);
            const expectedCleanedResponse = cleanResponse(
                mockResponse.response.text()
            );

            await getLuckyAdvice(req, res);

            expect(res.send.calledOnce).to.be.true;
            expect(res.send.firstCall.args[0]).to.deep.equal({
                success: true,
                response: expectedCleanedResponse,
            });
        });

        it("should return an error response when an exception is thrown", async () => {
            modelStub.generateContent.rejects(new Error("API error"));

            await getLuckyAdvice(req, res);

            expect(res.status.calledOnceWith(500)).to.be.true;
            expect(res.send.calledOnce).to.be.true;
            expect(res.send.firstCall.args[0]).to.deep.equal({
                success: false,
                error: "Something went wrong",
            });
        });

        it("should call the generative model", async () => {
            modelStub.generateContent.resolves({
                response: { text: () => "**Tip** Some content." },
            });

            await getLuckyAdvice(req, res);

            // Check if the model was instantiated and the generateContent was called
            expect(genAIStub.calledOnce).to.be.true;
            expect(modelStub.generateContent.calledOnce).to.be.true;
        });
    });
});
