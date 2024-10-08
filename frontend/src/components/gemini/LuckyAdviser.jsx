import React, { useState } from 'react';
import LuckyButton from './LuckyButton';
import axios from 'axios';
import { LoadingSpinner } from '../LoadingSpinner';

function LuckyAdviser() {
    const [inputValue, setInputValue] = useState('');
    const [promptResponses, setPromptResponses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResponses, setShowResponses] = useState(true);

    // Create axios instance with base URL and authorization token
    const axiosInstance = axios.create({
        baseURL: "http://localhost:4000",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    const getResponseForGivenPrompt = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) {
            console.error("Input value is required.");
            return;
        }

        try {
            setLoading(true);
            const response = await axiosInstance.post('/api/generate-response', {
                prompt: inputValue,
            });

            if (response.data.success) {
                setPromptResponses(response.data.response);
                setShowResponses(true);
            } else {
                console.error(response.data.error);
            }
        } catch (error) {
            console.error(error);
            console.log("Something Went Wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleLuckyAdvice = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.post('/api/lucky-advice');

            if (response.data.success) {
                setPromptResponses(response.data.response);
                setShowResponses(true);
            } else {
                console.error(response.data.error);
            }
        } catch (error) {
            console.error(error);
            console.log("Something Went Wrong");
        } finally {
            setLoading(false);
        }
    };

  const handleCloseResponses = () => {
    setShowResponses(false); // Close the response box
};

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col mb-4">
                <div className="relative flex items-end space-x-2">
                    <input
                        id="prompt"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask for financial advice or education..."
                        className="block w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green resize-none"
                        required
                    />
                    <button onClick={getResponseForGivenPrompt} type="submit" className="bg-white text-primary-green rounded-md border border-primary-green hover:bg-gray-200 transition font-medium text-sm px-3 py-2">
                        Send
                    </button>
                    <div className="absolute right-0 -bottom-12 flex space-x-2">
                        <LuckyButton onGetAdvice={handleLuckyAdvice} />
                    </div>
                </div>
            </div>
            {loading ? (
                <div className="text-center mt-3">
                    <div className="spinner-border text-primary">
                        <span className="visually-hidden">
                        <LoadingSpinner />
                        </span>
                    </div>
                </div>
            ) : (
                showResponses && promptResponses.length > 0 && (
                    <div className="flex flex-col mb-4 p-4 border border-gray-300 rounded-md shadow-md">
                        {promptResponses.map((promptResponse, index) => (
                            <div key={index}>
                                <div className="font-bold text-lg mb-2">{promptResponse.title}</div>
                                <ul>
                                    {promptResponse.content.map((item, idx) => (
                                        <li key={idx} className="mb-1">{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        <button
                            onClick={handleCloseResponses}
                            className="self-end bg-white text-primary-green rounded-md px-4 py-2 border border-primary-green hover:bg-gray-200 transition"
                        >
                            Close
                        </button>
                    </div>
                )
            )}
        </div>
    );
}

export default LuckyAdviser;
