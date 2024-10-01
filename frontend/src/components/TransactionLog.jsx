import Transaction from "./Transaction";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import TransactionContext from "../context/TransactionContext";
import { useContext, useState, useEffect } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import axios from "axios";

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

  const [maxPage, setMaxPage] = useState(100);
  const [loading, setLoading] = useState(true); // Start with loading state true on initial render
  const [isFiltering, setIsFiltering] = useState(false);

  // Handle maxPage updates when transactions are empty and no more to load
  useEffect(() => {
    
    // show loading spinner
    setLoading(true);

    if (!isFiltering && transactions.length === 0) {
      setMaxPage(currentPage); // When no transactions, set maxPage to currentPage
      setLoading(false); // Loading finished, even if no transactions
    } else {
      setLoading(false); // Stop loading after fetch, regardless of content
    }
  }, [transactions, currentPage, isFiltering]);

  // Watch for filter changes and adjust the state
  useEffect(() => {

    setLoading(true);

    if (filter.length > 0) {
      setIsFiltering(true);
      setLoading(false);
    } else {
      setIsFiltering(false);
      setMaxPage(100); // Reset max page when filter is removed
      setLoading(false);
    }
  }, [filter]);

  // Fetch transactions when currentPage or filter changes
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true); // Start loading when fetching new transactions

      try {
        // Fetch transactions using axios
        await TransactionContext.transactions(currentPage);
        // Assume transactions are set in the context elsewhere
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false); // Stop loading after the fetch completes
      }
    };

    fetchTransactions();
  }, [currentPage, filter]);

  return (
    <div className="flex flex-col items-center">
      <div className="w-[100%]">
        <div className="flex flex-row gap-4 items-center">
          <h1 className="text-body">Filter by:</h1>
          <button
            className={
              filter === "week"
                ? "bg-primary-dark text-white text-xl font-bold rounded-full py-1 px-3 w-[150px] active:bg-primary-darker"
                : "bg-primary text-white text-xl font-bold rounded-full py-1 px-3 w-[150px] hover:bg-primary-dark active:bg-primary-darker"
            }
            onClick={() => {
              setCurrentPage(1);
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
        <div className="flex justify-between flex-col items-center min-h-[450px] outline outline-4 outline-primary rounded-3xl mt-4 pb-3">
          
          <div className="w-[90%] mt-[30px]">
            {loading ? ( // Display loading spinner while fetching data
              <LoadingSpinner />
            ) : transactions.length !== 0 ? (
              <ul>
                {transactions.map((transaction) => (
                  <Transaction key={transaction.id} transaction={transaction} />
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
