import React, { useState } from 'react';

export default function FinancialMetrics() {
  const [showMetrics, setShowMetrics] = useState(false);

  const handleClick = () => {
    setShowMetrics(!showMetrics);
  };

  return (
    <div className="text-center">
      <button 
        onClick={handleClick} 
        className="bg-green-500 text-white text-button px-3 py-3 min-w-[280px] rounded-full hover:bg-green-600 active:bg-green-700">
        Financial Metrics
      </button>

      {/* Conditionally render the modal */}
      {showMetrics && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-[90%] max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Financial Metrics</h2>
            <p>Your financial metrics content goes here.</p>
            <button 
              onClick={handleClick}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
