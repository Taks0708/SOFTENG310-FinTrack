import { useState, useEffect, useContext } from "react";
import axios from "axios";
import SetGoal from "./SetGoal";
import TransactionContext from "../../context/TransactionContext";
import { refreshDisplayBalance } from "../../utility/CurrencyUtil";
import '../../assets/css/savingsTracker.css';

export default function SavingsTracker() {
  const { currency, balance, goal } = useContext(TransactionContext);
  const [progress, setProgress] = useState(0);
  const [displayBalance, setDisplayBalance] = useState(0);

  // Variables for axios instance
  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: "http://localhost:4000",
    headers: { Authorization: `Bearer ${token}` },
  });

  // Fetch the user's current balance and convert to specified currency when the component mounts
  useEffect(() => { refreshDisplayBalance(setDisplayBalance, currency); }, [balance, currency]);

  // Dynamic progress bar whenver the balance or goal changes
  useEffect(() => {
    if (Number(balance) > Number(goal)) {
      setProgress(100);
      return;
    }

    if (Number(goal) === 0 || Number(balance) <= 0) {
      setProgress(0);
      return;
    }

    const update = (Number(balance) / Number(goal)) * 100;
    setProgress(update);
    console.log("Progress: ", update);
  }, [balance, goal]);
  
  return (
    <div class="trackerContainer">
      <div class="trackerTextContainer">
        <p class="trackerText">
          Savings Progress:
          <br />
          ${displayBalance}/${goal}
        </p>
      </div>
      <div class="progressBarContainer">
        <div
          class="progressBar"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
