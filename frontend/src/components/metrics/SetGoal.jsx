import React from "react";
import { useEffect } from "react";
import "../../App.css";
import "../../assets/css/default.css";

export default function SetGoal({
    newGoal,
    setNewGoal,
    updateGoal,
    closeModal,
}) {
    const handleInputChange = (e) => {
        //removes and save all non number chars in newGoal
        let value = e.target.value.replace(/[^0-9.]/g, "");

        //removes all dots after the first one
        let valueSplit = value.split(".");
        if (valueSplit.length > 1) {
            value = valueSplit[0] + ".";
            for (let i = 1; i < valueSplit.length; i++) {
                value += valueSplit[i];
            }
        }

        setNewGoal(value);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl w-96 relative">
                <button
                    className="text-2xl absolute top-0 right-2 text-gray-500 hover:text-primary"
                    onClick={closeModal}
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4 text-center">
                    Set New Savings Goal
                </h2>
                <h2 className="text-body-small text-left">Goal</h2>
                <input
                    type="text"
                    value={newGoal}
                    placeholder="100000"
                    onInput={handleInputChange}
                    className="mt-2 border p-2 text-center w-full text-black "
                ></input>
                <div className="flex justify-center mt-4 gap-4">
                    <button
                        className=" bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-full w-full active:bg-primary-darker"
                        onClick={updateGoal}
                    >
                        Apply
                    </button>
                    <button
                        className="bg-gray-400 hover:bg-primary-red active:bg-primary-red-darker text-white font-bold py-2 px-4 rounded-full mr-2 w-full"
                        onClick={closeModal}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
