import Transaction from './Transaction';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import TransactionContext from '../context/TransactionContext';
import { useContext } from 'react';

export default function TransactionList() {
  const { transactions, filter, currentPage, setCurrentPage, filterYear, filterMonth, filterWeek, } = useContext(TransactionContext);


  return (
    <div className='flex flex-col items-center'>

      <div className=' w-[100%]'>
        <div className='flex flex-row gap-4 items-center'>
          <h1 className='text-body '>Transaction Log</h1>
          <button className={filter === 'week' ? 'bg-primary-dark text-white text-xl font-bold rounded-full py-0 px-3 w-[130px]' : 'bg-primary text-white text-xl font-bold rounded-full py-0 px-3 w-[130px]'} onClick={filterWeek}>Last week</button>
          <button className={filter === 'month' ? 'bg-primary-dark text-white text-xl font-bold rounded-full py-0 px-3 w-[130px]' : 'bg-primary text-white text-xl font-bold rounded-full py-0 px-3 w-[130px]'} onClick={filterMonth}>Last month</button>
          <button className={filter === 'year' ? 'bg-primary-dark text-white text-xl font-bold rounded-full py-0 px-3 w-[130px]' : 'bg-primary text-white text-xl font-bold rounded-full py-0 px-3 w-[130px]'} onClick={filterYear}>Last year</button>
        </div>
        <div className=' flex justify-between flex-col items-center min-h-[450px]'>

          <div className='w-[90%] mt-[40px]'>
            <ul>
              {transactions.map((transaction) => (
                <Transaction key={transaction.id} transaction={transaction} className='' />
              ))}
            </ul>
          </div>

          <div className='flex flex-row'>
            <button className={currentPage === 1 ? 'text-gray-400' : ''} onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              <IoIosArrowBack size={35} />
            </button>
            <h2 className='text-sub-heading w-4'>{currentPage}</h2>
            <button onClick={() => setCurrentPage(currentPage + 1)}>
              <IoIosArrowForward size={35} />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
