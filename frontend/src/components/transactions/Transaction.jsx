import React, { useEffect, useState, useContext } from "react";
import TransactionContext from "../../context/TransactionContext";
import TransactionDetailsPopup from "./TransactionDetailPopup";
import PropTypes from "prop-types";
import { convertCurrency } from "../../utility/CurrencyUtil";
import "../../assets/css/variables.css";

const Transaction = ({ transaction }) => {
    const [isAmountNegative, setIsAmountNegative] = useState(false);
    const [convertedAmount, setConvertedAmount] = useState(transaction.amount);
    const [showDetails, setShowDetails] = useState(false);
    const { currency, handleSelect, currencySymbol } =
        useContext(TransactionContext);

    const transactionDate = new Date(transaction.created_at.substring(0, 10));
    const dateString =
        (transactionDate.getDate() < 10 ? "0" : "") +
        transactionDate.getDate() +
        "-" +
        (transactionDate.getMonth() + 1 < 10 ? "0" : "") +
        (transactionDate.getMonth() + 1) +
        "-" +
        transactionDate.getFullYear();

    // useEffect to check if each transaction is negative and then convert the currency
    useEffect(() => {
        const convert = async () => {
            const converted = await convertCurrency(
                currency,
                "NZD",
                transaction.amount
            ); // using context to convert amount
            setConvertedAmount(converted);
            setIsAmountNegative(converted < 0);
        };
        convert();
    }, [currency, transaction.amount]);

    const handleCheckboxChange = (e) => {
        handleSelect(transaction.id, e.target.checked);
    };

    return (
        <>
            <div className="flex flex-row justify-start text-body pl-[8x] ">
                <input
                    className="cursor-pointer"
                    type="checkbox"
                    onChange={handleCheckboxChange}
                />

                <button
                    className={` w-full flex flex-row justify-between text-body ml-[8px] pl-2 pr-2 rounded-2xl ${
                        isAmountNegative
                            ? "text-primary-red"
                            : "text-primary-green"
                    } hover:bg-gray-300 cursor-pointer`}
                    onClick={() => setShowDetails(true)}
                >
                    <p style={{ fontSize: "var(--standaloneFontSize)" }}>
                        {isAmountNegative
                            ? `-${currencySymbol}${convertedAmount.slice(1)}`
                            : `+${currencySymbol}${convertedAmount}`}
                        : {transaction.title}
                    </p>

                    <p
                        style={{ fontSize: "var(--standaloneFontSize)" }}
                        className="self-end"
                    >
                        {dateString}
                    </p>
                </button>
            </div>

            {
                /*displays the currently hovered transaction in a popup*/

                showDetails && (
                    <div className="absolute">
                        <TransactionDetailsPopup
                            transaction={transaction}
                            setShowDetails={setShowDetails}
                        />
                    </div>
                )
            }
        </>
    );
};
Transaction.propTypes = {
    transaction: PropTypes.shape({
        amount: PropTypes.string,
        created_at: PropTypes.string,
        description: PropTypes.string,
        id: PropTypes.number,
        title: PropTypes.string,
        user_id: PropTypes.number,
    }),
};

export default Transaction;
