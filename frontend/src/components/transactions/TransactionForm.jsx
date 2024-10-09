import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

export default function TransactionForm({ onSubmit, onCancel }) {
    const labelStyle = "text-2xl";
    const inputStyle = "mt-2 border p-2 w-full";
    const enableApplyStyle = "hover:bg-primary-dark active:bg-primary-darker";
    const enableCancelStyle =
        "hover:bg-primary-red active:bg-primary-red-darker";
    const disableStyle = "opacity-50";

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [transactionType, setTransactionType] = useState("income");
    const [disableClick, setDisableClick] = useState(false);
    const disableClickSync = useRef(false);

    // Handle sudden change in transaction type
    useEffect(() => {
        // Disable submit button if title or amount is empty/invalid
        if (title === "" || amount === "" || Math.abs(amount) === 0) {
            setDisableClick(true);
            disableClickSync.current = true;
            return;
        } else {
            setDisableClick(false);
            disableClickSync.current = false;
        }

        // Ensure amount is positive for incomes and negative for expenses
        if (transactionType === "expense") {
            setAmount(-Math.abs(amount));
        } else {
            setAmount(Math.abs(amount));
        }
    }, [transactionType, title, amount]);

    const handleAmountChange = (e) => {
        let value = e.target.value;

        if (value === "") {
            setAmount("");
            return;
        }

        // Split into integer and decimal parts
        const [integerPart, decimalPart] = value.split(".");

        // the below comment is required for the BigInt working
        /* global BigInt */
        try {
            // Check if the integer part exceeds the allowed digits (14 digits)
            const integerBigInt = BigInt(integerPart);
            if (
                integerBigInt > BigInt("99999999999999") ||
                integerBigInt < BigInt("-99999999999999")
            ) {
                alert(
                    "Amount must be between -99,999,999,999,999.99 and +99,999,999,999,999.99."
                );
                return;
            }

            // Handle decimal part (ensure it is not more than 2 decimal places)
            if (decimalPart && decimalPart.length > 2) {
                alert("Amount cannot have more than 2 decimal places.");
                return;
            }

            // If valid, set the amount
            setAmount(value);
        } catch (error) {
            alert("Please enter a valid number.");
        }
    };

    // Prevent form submission on enter key press
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
        }
    };

    const handleSubmit = async () => {
        if (disableClickSync.current || disableClick) return;

        setDisableClick(true);
        disableClickSync.current = true;

        //if amount is left empty update it to 0 and submit it.
        let updatedAmount = amount;
        if (amount === "") {
            updatedAmount = 0;
            setAmount(0);
        }

        onSubmit({
            title,
            amount: updatedAmount,
            description,
            transactionType,
        });
    };

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-2xl w-96 relative">
                    <button
                        onClick={onCancel}
                        className="text-2xl absolute top-0 right-2 text-gray-500 hover:text-primary"
                    >
                        &times;
                    </button>
                    <h2 className="text-2xl font-bold mb-4 text-center">
                        Add New Transaction
                    </h2>
                    {/*Transaction Type element*/}
                    <div className="flex flex-col mt-4">
                        <label
                            htmlFor="transactionType"
                            className={`${labelStyle} mb-2`}
                        >
                            Transaction Type
                        </label>
                        <div className="w-full flex gap-2 mb-2">
                            <button
                                type="button"
                                id="transactionType"
                                onClick={() => setTransactionType("income")}
                                className={`w-full px-4 py-2 font-bold rounded ${
                                    transactionType === "income"
                                        ? "bg-primary-green text-white"
                                        : "bg-gray-200 text-black hover:bg-gray-300 active:bg-gray-400"
                                }`}
                            >
                                Income
                            </button>
                            <button
                                type="button"
                                onClick={() => setTransactionType("expense")}
                                className={`w-full px-4 py-2 font-bold rounded ${
                                    transactionType === "expense"
                                        ? "bg-primary-red text-white"
                                        : "bg-gray-200 text-black hover:bg-gray-300 active:bg-gray-400"
                                }`}
                            >
                                Expense
                            </button>
                        </div>
                    </div>
                    {/*Title element*/}
                    <div className="flex flex-col">
                        <label htmlFor="title" className={labelStyle}>
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className={inputStyle}
                        ></input>
                    </div>
                    {/*Amount element*/}
                    <div className="flex flex-col">
                        <label htmlFor="amount" className={labelStyle}>
                            Amount
                        </label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={handleAmountChange}
                            onKeyDown={handleKeyDown}
                            className={inputStyle}
                        ></input>
                    </div>
                    {/*Description element*/}
                    <div className="flex flex-col">
                        <label htmlFor="description" className={labelStyle}>
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={`${inputStyle}  min-h-[250px] max-h-[400px]`}
                            rows="4"
                        />
                    </div>
                    <div className="flex justify-center mt-4 gap-4">
                        <button
                            onClick={handleSubmit}
                            className={`${
                                disableClick ? disableStyle : enableApplyStyle
                            } bg-primary text-white font-bold py-2 px-4 rounded-full w-full`}
                            disabled={disableClick}
                        >
                            Apply
                        </button>
                        <button
                            onClick={onCancel}
                            className={`bg-gray-500 ${enableCancelStyle} text-white font-bold py-2 px-4 rounded-full mr-2 w-full`}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}

TransactionForm.propTypes = {
    onSubmit: PropTypes.func.isRequired, // Expect a function and make it required
    onCancel: PropTypes.func.isRequired, // Expect a function and make it required
};
