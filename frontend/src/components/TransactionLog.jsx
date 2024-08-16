import Transaction from "./Transaction";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

import TransactionContext from "../context/TransactionContext";
import { useContext, useState, useEffect } from "react";

export default function TransactionList() {
  const {
    transactions,
    filter,
    currentPage,
    setCurrentPage,
    filterYear,
    filterMonth,
    filterWeek,
  } = useContext(TransactionContext);
  const [maxPage, setMaxPage] = useState(10);
  const [isPageJustLoaded, setIsPageJustLoaded] = useState(true);

  // at page load, transactions is empty, so set maxPage to currentPage (1). So using isPageJustLoaded to avoid this behavior at page load
  // only set the max page after the transactions have been loaded
  useEffect(() => {
    if (!isPageJustLoaded) {
      if (transactions.length === 0) {
        setMaxPage(currentPage);
      }
    } else {
      setIsPageJustLoaded(false);
    }
  }, [transactions]);

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
            onClick={filterWeek}
          >
            Last week
          </button>
          <button
            className={
              filter === "month"
                ? "bg-primary-dark text-white text-xl font-bold rounded-full py-1 px-3 w-[150px] active:bg-primary-darker"
                : "bg-primary text-white text-xl font-bold rounded-full py-1 px-3 w-[150px] hover:bg-primary-dark active:bg-primary-darker"
            }
            onClick={filterMonth}
          >
            Last month
          </button>
          <button
            className={
              filter === "year"
                ? "bg-primary-dark text-white text-xl font-bold rounded-full py-1 px-3 w-[150px] active:bg-primary-darker"
                : "bg-primary text-white text-xl font-bold rounded-full py-1 px-3 w-[150px] hover:bg-primary-dark active:bg-primary-darker"
            }
            onClick={filterYear}
          >
            Last year
          </button>
        </div>
        <div className=" flex justify-between flex-col items-center min-h-[450px] outline outline-4 outline-primary rounded-3xl mt-4 pb-3">
          <div className="w-[90%] mt-[30px]">
            {transactions.length !== 0 ? (
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
              <div className="flex flex-col items-center gap-6">
                <h1 className="text-body">No More Transactions To Load...</h1>
                <button
                  className="text-button-small text-white bg-primary rounded-full px-5 py-1 hover:bg-primary-dark active:bg-primary-darker"
                  onClick={() => setCurrentPage(1)}
                >
                  Go back
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-row min-w-[105px] justify-between">
            <button
              className={
                currentPage === 1
                  ? "text-gray-400"
                  : "text-black hover:text-primary active:text-primary-dark"
              }
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <IoIosArrowBack size={35} />
            </button>
            <h2 className="text-sub-heading">{currentPage}</h2>
            <button
              className={
                currentPage === maxPage
                  ? "text-gray-400"
                  : "text-black hover:text-primary active:text-primary-dark"
              }
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === maxPage}
            >
              <IoIosArrowForward size={35} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
