import Transaction from "./Transaction";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

import TransactionContext from "../../context/TransactionContext";
import { useContext, useState, useEffect } from "react";

import { LoadingSpinner } from "../LoadingSpinner";

export default function TransactionList() {
  const {
    transactions,
    allTransactions,
    filter,
    currentPage,
    setCurrentPage,
    filterYear,
    filterMonth,
    filterWeek,
    balance,
    loading,
    setLoading,
  } = useContext(TransactionContext);
  const [maxPage, setMaxPage] = useState(100);
  const [isPageJustLoaded, setIsPageJustLoaded] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
 



  // at page load, transactions is empty, so set maxPage to currentPage (1). So using isPageJustLoaded to avoid this behavior at page load
  // only set the max page after the transactions have been loaded
  useEffect(() => {
    setMaxPage(Math.ceil(allTransactions.length / 10));
    if (!isPageJustLoaded && !isFiltering) {
      if (transactions.length < 10) {
        setMaxPage(currentPage);
        
      }
    } else {
      setIsPageJustLoaded(false);
      setIsFiltering(false);
    }

  }, [transactions, allTransactions, currentPage, isPageJustLoaded, isFiltering]);

  useEffect(() => {
    if (filter.length > 0) {
      setIsFiltering(true);
    } else {
      setIsFiltering(false);
    }
  }, [filter]);




  return (
    <div className="flex flex-col items-center">
      <div className=" w-[100%]">
        <div className="flex flex-row gap-4 items-center">
          <h1 className="text-body ">Filter by: </h1>
          <button
            className={
              filter === "week"
                ? "bg-primary-dark text-white text-xl font-bold rounded-full py-1 px-3 w-[150px] active:bg-primary-darker"
                : "bg-primary text-white text-xl font-bold rounded-full py-1 px-3 w-[150px] hover:bg-primary-dark active:bg-primary-darker"
            }
            onClick={() => {
              setCurrentPage(1)
              filterWeek();
            }}
          >
            Last week
          </button>
          <button
            className={
              filter === "month"
                ? "bg-primary-dark text-white text-xl font-bold rounded-full py-1 px-3 w-[150px] active:bg-primary-darker"
                : "bg-primary text-white text-xl font-bold rounded-full py-1 px-3 w-[150px] hover:bg-primary-dark active:bg-primary-darker"
            }
            onClick={() => {
              setCurrentPage(1);
              filterMonth();
            }}
          >
            Last month
          </button>
          <button
            className={
              filter === "year"
                ? "bg-primary-dark text-white text-xl font-bold rounded-full py-1 px-3 w-[150px] active:bg-primary-darker"
                : "bg-primary text-white text-xl font-bold rounded-full py-1 px-3 w-[150px] hover:bg-primary-dark active:bg-primary-darker"
            }
            onClick={() => {
              setCurrentPage(1);
              filterYear();
            }}
          >
            Last year
          </button>
        </div>
        <div className=" flex justify-between flex-col items-center min-h-[450px] outline outline-4 outline-primary rounded-3xl mt-4 pb-3">
          <div className="w-[90%] mt-[30px]">
            {loading ? (
              <LoadingSpinner />
            ) : transactions.length == 0 ? (
              <p>No transactions found.</p>
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

          <div className="flex flex-row min-w-[105px] justify-between">
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
            <h2 className="text-sub-heading">{currentPage}</h2>
            <h3 className="text-sub-heading">&#47;{maxPage}</h3>
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
  );
}