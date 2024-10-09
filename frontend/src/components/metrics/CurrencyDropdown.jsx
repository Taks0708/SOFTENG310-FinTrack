import { FaSortDown } from "react-icons/fa";
import { useState, useContext } from "react";
import TransactionContext from "../../context/TransactionContext";
import "../../assets/css/currencyDropdown.css";

export default function CurrencyDropdown(props) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState("NZD");
    const { setCurrency } = useContext(TransactionContext);

    const handleOpen = () => {
        setIsOpen(!isOpen);
    };

    function currencyOption(currencyId) {
        return (
            <button
                onClick={() => {
                    selectOption(currencyId);
                }}
                className={
                    currencyId == selectedCurrency
                        ? "currencyOptionSelected"
                        : "currencyOption"
                }
            >
                {currencyId}
            </button>
        );
    }

    function selectOption(currencyId) {
        setIsOpen(false);
        setCurrency(currencyId);
        setSelectedCurrency(currencyId);
    }

    return (
        <>
            <div className="defaultDropdownContainer">
                <button className="defaultButton" onClick={handleOpen}>
                    <div>
                        <p>
                            {selectedCurrency} {isOpen ? "▾" : "▸"}
                        </p>
                    </div>
                </button>
            </div>
            <div
                className={
                    isOpen
                        ? "currencyOptionList_open"
                        : "currencyOptionList_closed"
                }
            >
                {currencyOption("NZD")}
                {currencyOption("AUD")}
                {currencyOption("USD")}
                {currencyOption("GBP")}
                {currencyOption("HKD")}
            </div>
        </>
    );
}
