import Transaction from "./Transaction";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

import TransactionContext from "../../context/TransactionContext";
import { useContext, useState, useEffect } from "react";

import { LoadingSpinner } from "../LoadingSpinner";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../../assets/css/transactions.css'

export default function TransactionList() {
  const {
    transactions,
    allTransactions,
    currentPage,
    setCurrentPage,
    fromDate,
    toDate,
    setDateRange,
    loading,
    setLoading
  } = useContext(TransactionContext);
  const [maxPage, setMaxPage] = useState(100);
  const [isPageJustLoaded, setIsPageJustLoaded] = useState(true);


  // at page load, transactions is empty, so set maxPage to currentPage (1). So using isPageJustLoaded to avoid this behavior at page load
  // only set the max page after the transactions have been loaded
  useEffect(() => {
    setMaxPage(Math.ceil(allTransactions.length / 10));
    if (!isPageJustLoaded) {
      if (transactions.length < 10) {
        setMaxPage(currentPage);
        
      }
    } else {
      setIsPageJustLoaded(false);
    }

  }, [transactions, allTransactions, currentPage, isPageJustLoaded]);


  return (
    <div className="transactionLogContainer">
      <div className="dateOptions">
        <p className="datePickerLabel">From: </p>
        <DatePicker className="datePicker" selected={fromDate} endDate={toDate} dateFormat={"dd-MM-yyyy"} onChange={(date) => setDateRange(date, toDate)} />
        <div style={{height: "100%", width: "40px"}}/>
        <p className="datePickerLabel">To: </p>
        <DatePicker className="datePicker" startDate={fromDate} selected={toDate} dateFormat={"dd-MM-yyyy"} onChange={(date) => setDateRange(fromDate, date)} />
      </div>
      <div className="flex flex-col items-center">
        <div className=" w-[100%]">
          <div className="transactionLog">
            <div className="w-[90%] mt-[30px]">
              {loading ? (
                <LoadingSpinner />
              ) : transactions.length == 0 ? (
                <p style={{fontSize: "var(--standaloneFontSize)"}}>No transactions found.</p>
              ) : transactions.length > 0 ? (
                <ul>
                  {transactions.map((transaction) => (
                    <Transaction
                      key={transaction.id}
                      transaction={transaction}
                      className=""
                    />
                  ))}
                </ul>
              ) : (
                <LoadingSpinner />
              )}
            </div>

            <div className="pageSelect">
              <button
                className={currentPage === 1
                    ? "text-gray-400"
                    : "text-black hover:text-primary active:text-primary-dark"
                }
                onClick={() => {setCurrentPage(currentPage - 1)
                  setLoading(true);
                }}
                disabled={currentPage === 1}

              >
                {( <IoIosArrowBack size={35} /> // Normal content when not loading
                )}
              </button>
              <h2 className="text-sub-heading" style={{fontSize: "var(--headerFontSize)"}}>{currentPage}</h2>
              <h3 className="text-sub-heading" style={{fontSize: "var(--headerFontSize)"}}>&#47;{maxPage}</h3>
              <button
                className={currentPage === maxPage
                    ? "text-gray-400"
                    : "text-black hover:text-primary active:text-primary-dark"
                }
                onClick={() => {setCurrentPage(currentPage + 1)
                  setLoading(true);
                }}
                disabled={currentPage === maxPage}
              >
                {( <IoIosArrowForward size={35} /> // Normal content when not loading
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}