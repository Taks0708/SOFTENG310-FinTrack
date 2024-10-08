import { FaSortDown } from "react-icons/fa";
import { useState, useContext } from "react";
import TransactionContext from "../../context/TransactionContext";
import '../../assets/css/currencyDropdown.css';

export default function CurrencyDropdown(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('NZD');
  const { setCurrency } = useContext(TransactionContext);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  }

  function currencyOption (currencyId) {
    return (
      <button onClick={() => {selectOption(currencyId)}} className="currencyOption">
        {currencyId}
      </button>
    );
  }

  function selectOption(currencyId) {
    setCurrency(currencyId);
    setSelectedCurrency(currencyId);
    setIsOpen(false);
  }

  return (
    <>
      <div className="defaultDropdownContainer">
        <button className="defaultButton" onClick={handleOpen}>
          <div>
            {selectedCurrency}
            {isOpen ? <FaSortDown /> : <FaSortDown className='origin-[90%][50%] -rotate-90 translate-y-[2px] -translate-x-[2px]' />}
          </div>
        </button>
      </div>
      <div className="defaultContainer">
        <div className={isOpen ? "currencyOptionList_open" : "currencyOptionList_closed"}>
          {currencyOption("NZD")}
          {currencyOption("AUD")}
          {currencyOption("USD")}
          {currencyOption("GBP")}
          {currencyOption("HKD")}
        </div>
      </div>
    </>
  );
}