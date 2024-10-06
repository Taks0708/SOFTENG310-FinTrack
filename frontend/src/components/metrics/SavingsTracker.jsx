import { useState, useEffect, useContext } from "react";
import axios from "axios";
import SetGoal from "./SetGoal";
import TransactionContext from "../../context/TransactionContext";
import { refreshDisplayBalance } from "../../utility/CurrencyUtil";

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
    <div className="flex flex-col items-center gap-2 mb-2 mt-2 w-[40%]">
      <p className="text-body my-0 mb-3">
        ${displayBalance}/${goal}
      </p>
      <div className="w-full h-11 bg-white outline-primary outline outline-3 rounded-full">
        <div
          className="h-11 rounded-full bg-primary"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
