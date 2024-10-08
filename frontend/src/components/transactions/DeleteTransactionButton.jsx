import { useContext, useState, useRef } from "react";
import getAxiosInstance from "../../utility/AxiosUtil.jsx";
import TransactionContext from "../../context/TransactionContext";
import '../../assets/css/default.css';
import DefaultButton from '../default/DefaultButton.jsx';
import { refreshDisplayBalance } from "../../utility/CurrencyUtil.jsx";

export default function DeleteTransactionButton() {

  const { selectedTransactions, setSelectedTransactions, requestUiUpdate, setBalance, currency } =
    useContext(TransactionContext);

  const [disableClick, setDisableClick] = useState(false);
  const disableClickSync = useRef(false); 
  
  const handleDeleteSelected = async () => {
    if (disableClickSync.current || disableClick) return;
    disableClickSync.current = true;
    setDisableClick(true);

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("User is not authenticated.");
      return;
    }

    const axiosInstance = getAxiosInstance();

    try {
      // Assuming you have an API function to delete a transaction by ID
      await Promise.all(
        selectedTransactions.map((transactionId) =>
          axiosInstance.delete(`/transaction/${transactionId}`)
            .then(requestUiUpdate())
        )
      );
      setSelectedTransactions([]); // Clear the selected transactions
      refreshDisplayBalance(setBalance, currency);
    } catch (error) {
      console.error("Failed to delete transactions", error);
    } finally {
      disableClickSync.current = false;
      setDisableClick(false);
    }
  };
  return (
    <DefaultButton onClick={handleDeleteSelected} disabled={disableClick}>
      Delete Transaction
    </DefaultButton>
  );
}
