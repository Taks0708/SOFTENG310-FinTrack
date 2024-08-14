import CurrentBalance from '../components/CurrentBalance';
import TransactionLog from '../components/TransactionLog';
import AddTransactionButton from '../components/AddTransactionButton';
import DeleteTransactionButton from '../components/DeleteTransactionButton';
import FintrackLogo from '../assets/images/FintrackLogo.png';

/*
 * When adding your new component:
 * remove the p tags and replace them with your respective react components, and remove the bg-[colour] property in its wrapped <div>
 * 
 * The bg-[colour] properties have been added to help visualise where each component should go.
*/

export default function Dashboard() {
  return (
    <>
      <div className='bg-blue-500 flex items-center h-12 p-4'>
        <h1 className= 'flex items-center'>
          <div className = 'flex items center'>
            <img src={FintrackLogo} alt="Fintrack Logo" className="h-20 w-40" style={{ marginTop: '10px' }}/>
          </div>
        </h1>
      </div>


      <div className=' flex flex-col px-[8%]'>
        <div className='flex flex-row pt-[2%]'>

          <div className=' flex flex-col w-[80%]'>
            <div className=' flex flex-col items-start'>
              <CurrentBalance />
            </div>
            <TransactionLog />
          </div>

          <div className='bg-slate-500 flex flex-col w-[20%] items-center gap-[3%]'>
            <AddTransactionButton />
            <DeleteTransactionButton />
            <p>DROPDOWN</p>
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
