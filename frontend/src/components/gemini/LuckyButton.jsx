// LuckyAdviceButton.jsx
import React from 'react';

function LuckyButton({ onGetAdvice }) {
  const handleClick = () => {
    onGetAdvice();
  };

  return (
    <button onClick={handleClick} className="bg-violet-600 text-white rounded-md px-4 py-2 hover:bg-violet-800 transition">
      I'm Feeling Lucky!
    </button>
  );
}

export default LuckyButton;
