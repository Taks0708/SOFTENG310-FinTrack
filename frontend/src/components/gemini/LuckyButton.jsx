// LuckyAdviceButton.jsx
import React from "react";

function LuckyButton({ onGetAdvice, loading, enableStyles, disableStyles }) {
    console.log("loading", loading);
    const handleClick = () => {
        onGetAdvice();
    };

    return (
        <button
            onClick={handleClick}
            className={`${
                loading ? disableStyles : enableStyles
            } bg-primary text-white font-medium text-sm px-3 py-2 rounded-md`}
            disabled={loading} // Disable button when loading
        >
            I'm Feeling Lucky!
        </button>
    );
}

export default LuckyButton;
