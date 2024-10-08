
import { useContext } from "react";
import Banner from "../components/Banner";
import BalanceGraph from "../components/metrics/BalanceGraph"
import CurrentBalance from "../components/metrics/CurrentBalance";
import CurrencyDropdown from "../components/metrics/CurrencyDropdown";
import SavingsTracker from "../components/metrics/SavingsTracker";
import TransactionLog from "../components/transactions/TransactionLog";
import AddTransactionButton from "../components/transactions/AddTransactionButton";
import DeleteTransactionButton from "../components/transactions/DeleteTransactionButton";
import UpdateSavingGoalButton from "../components/metrics/UpdateSavingGoalButton";

import FintrackLogo from "../assets/images/FintrackLogo.png";
import FinancialMetrics from "../components/metrics/FinancialMetrics";

import '../assets/css/dashboard.css';
import LuckyAdviser from "../components/gemini/LuckyAdviser";

/*
 * When adding your new component:
 * remove the p tags and replace them with your respective react components, and remove the bg-[colour] property in its wrapped <div>
 *
 * The bg-[colour] properties have been added to help visualise where each component should go.
 */


export default function Dashboard() {
  return (
    <>
      <div className="topBar">
        <div className="logoContainer">
          <img src={FintrackLogo} alt="logo"></img>
        </div>
        <SavingsTracker />
      </div>
      <div className="scrollableContent">
        <BalanceGraph />
        <TransactionLog />
        <LuckyAdviser/> 
      </div>
      <div className="sideBar">
        <AddTransactionButton />
        <DeleteTransactionButton />
        <UpdateSavingGoalButton />
        <div style={{height: '40px', width: '100%', float: 'left'}}/> {/* Space between groups of buttons */}
        <FinancialMetrics />
        <CurrencyDropdown />
      </div>
    </>
  );
}
