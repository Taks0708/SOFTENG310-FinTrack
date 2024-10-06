import { useState, useEffect, useContext } from "react";
import axios from "axios";
import SetGoal from "./SetGoal";
import TransactionContext from "../../context/TransactionContext";
import { refreshDisplayBalance } from "../../utility/CurrencyUtil";
import '../../assets/css/savingsTracker.css';
import GoalBar from '../GoalBar';

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
      <h2 className="text-sub-heading font-bold m-0"> Current Savings Goal:</h2>
      <p className="text-body my-0 mb-3">
        ${balance}/${goal}
      </p>

      <GoalBar 
        progress={progress}
        balance={balance} 
        goal={goal}
        subgoals={[0, 0.25*goal, 0.5*goal ,0.75*goal, goal]}/>

      {progress >= 0 && (
        <div className={balance>=goal ? "mt-20" : "mt-4"}>
        <button
          className="bg-primary hover:bg-primary-dark text-white text-button font-bold py-2 px-7 rounded-full"
          onClick={() => {
            setShowSetGoal(true);
          }}
        >
          Update Savings Goal
        </button>
      </div>
      )}

      {showSetGoal && (
        <SetGoal
          newGoal={newGoal}
          setNewGoal={setNewGoal}
          updateGoal={updateGoal}
          closeModal={() => setShowSetGoal(false)}
        />
      )}
    </div>
  );
}
