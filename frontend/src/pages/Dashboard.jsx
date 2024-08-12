import { useContext } from 'react';
import CurrentBalance from '../components/CurrentBalance';
import TransactionLog from '../components/TransactionLog';
import AddTransactionButton from '../components/AddTransactionButton';
import DeleteTransactionButton from '../components/DeleteTransactionButton';
import CurrencyDropdown from '../components/CurrencyDropdown';
import TransactionContext from '../context/TransactionContext';

/*
 * When adding your new component:
 * remove the p tags and replace them with your respective react components, and remove the bg-[colour] property in its wrapped <div>
 * 
 * The bg-[colour] properties have been added to help visualise where each component should go.
*/

export default function Dashboard() {

  return (
    <>
      <div className='bg-blue-200'>
        <p>HEADER</p>
      </div>

      <div className=' flex flex-col px-[8%]'>
        <div className='flex flex-row pt-[2%]'>

          <div className=' flex flex-col w-[80%]'>
            <div className=' flex flex-col items-start'>
              <CurrentBalance />
            </div>
            <TransactionLog />
          </div>

          <div className='flex flex-col w-[20%] items-center gap-[3%]'>
            <AddTransactionButton />
            <DeleteTransactionButton />
            <CurrencyDropdown />
          </div>
        </div>

        <div className='bg-orange-200 flex flex-row justify-center'>
          <p>SAVINGS TRACKER/GOALS</p>
        </div>

        <div className='bg-green-300 flex flex-row justify-center'>
          <p>INCOME STATS</p>
        </div>

      </div>
    </>
  );
}
