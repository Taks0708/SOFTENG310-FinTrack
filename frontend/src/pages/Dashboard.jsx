import CurrentBalance from "../components/CurrentBalance";
import TransactionLog from "../components/TransactionLog";
import AddTransactionButton from "../components/AddTransactionButton";
import DeleteTransactionButton from "../components/DeleteTransactionButton";
import CurrencyDropdown from "../components/CurrencyDropdown";
import SavingsTracker from "../components/SavingsTracker";
import Banner from "../components/Banner";



export default function Dashboard() {
  return (
    <>
      <div className='flex items-center'>
        <Banner />
      </div>

      <div className=' flex flex-col px-[8%]'>
        <div className='flex flex-row pt-[2%]'>

          <div className=' flex flex-col w-[80%]'>
            <div className=' flex flex-col items-start mb-[2%]'>
              <CurrentBalance />
            </div>
            <TransactionLog />
          </div>

          <div className="flex flex-col w-[20%] items-center gap-[3%] mt-[122px] pl-12">
            <AddTransactionButton />
            <DeleteTransactionButton />
            <CurrencyDropdown />
          </div>
        </div>

        <div className="flex flex-row justify-center mt-[4%] mb-[2%]">
          <SavingsTracker />
        </div>

        <div className="bg-green-300 flex flex-row justify-center">
          <p>INCOME STATS</p>
        </div>
      </div>
    </>
  );
}
