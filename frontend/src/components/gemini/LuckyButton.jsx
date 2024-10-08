// LuckyAdviceButton.jsx
import React from 'react';

function LuckyButton({ onGetAdvice }) {
  const handleClick = () => {
    onGetAdvice();
  };

  return (
    <button onClick={handleClick} className="bg-primary-green text-white rounded-md px-4 py-2 hover:bg-primary-green-dark transition">
      I'm Feeling Lucky!
    </button>
  );
}

export default LuckyButton;
