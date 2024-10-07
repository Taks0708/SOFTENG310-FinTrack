import { useContext } from "react";
import Banner from "../components/Banner";
import BalanceGraph from "../components/metrics/BalanceGraph"
import CurrentBalance from "../components/metrics/CurrentBalance";
import CurrencyDropdown from "../components/metrics/CurrencyDropdown";
import SavingsTracker from "../components/metrics/SavingsTracker";
import TransactionLog from "../components/transactions/TransactionLog";
import AddTransactionButton from "../components/transactions/AddTransactionButton";
import DeleteTransactionButton from "../components/transactions/DeleteTransactionButton";
import TransactionContext from "../context/TransactionContext";
import GoalBar from "../components/progress-bar/GoalBar";

import FintrackLogo from "../assets/images/FintrackLogo.png";
import FinancialMetrics from "../components/metrics/FinancialMetrics";

import '../assets/css/dashboard.css';

/*
 * When adding your new component:
 * remove the p tags and replace them with your respective react components, and remove the bg-[colour] property in its wrapped <div>
 *
 * The bg-[colour] properties have been added to help visualise where each component should go.
 */


export default function Dashboard() {
  const { goal, balance } = useContext(TransactionContext); // Access goal and balance from context

  return (
    <>
      <div className="topBar flex items-center p-4">
        <div className="logoContainer">
          <img src={FintrackLogo} alt="logo" />
        </div>
        <SavingsTracker /> 
      </div>
      <div class="scrollableContent">
        <BalanceGraph />
        <TransactionLog />
      </div>
      <div class="sideBar">
        <AddTransactionButton />
        <DeleteTransactionButton />
        <FinancialMetrics />
        <CurrencyDropdown />
      </div>
      

      {/* <div className='flex items-center'>
        <Banner />
      </div>

      <div className=' flex flex-col px-[8%]'>
        <div className='flex flex-row pt-[2%]'>

          <div className=' flex flex-col w-[80%]'>

            <BalanceGraph />

            <div className=' flex flex-col items-start mb-[2%]'>
              <CurrentBalance />
            </div>

            <TransactionLog />
          </div>

          <div className="flex flex-col w-[20%] items-center gap-[3%] mt-[121px] pl-12">
            <AddTransactionButton />
            <DeleteTransactionButton />
            <FinancialMetrics />
            <CurrencyDropdown />
          </div>
        </div>

        <div className="flex flex-row justify-center mt-[4%] mb-[2%]">
          <SavingsTracker />
        </div>

        
      </div> */}
    </>
  );
}
