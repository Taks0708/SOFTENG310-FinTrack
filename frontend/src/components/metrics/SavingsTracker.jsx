import { useState, useEffect, useContext } from "react";
import axios from "axios";
import SetGoal from "./SetGoal";
import TransactionContext from "../../context/TransactionContext";
import GoalBar from '../GoalBar';
import '../../assets/css/savingsTracker.css'

export default function SavingsTracker() {
  const { balance, goal, setGoal, setBalance } = useContext(TransactionContext);
  const [progress, setProgress] = useState(0);

  // Variables for axios instance
  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: "http://localhost:4000",
    headers: { Authorization: `Bearer ${token}` },
  });

  // Fetch the user's current balance and goal when the component mounts
  useEffect(() => {
    axiosInstance
      .get("/user/balance")
      .then((response) => {
        setBalance(response.data.result.balance);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [balance]);

  // Fetch the user's current savings goal when the component mounts
  useEffect(() => {
    axiosInstance
      .get("/user/goal")
      .then((response) => {
        setGoal(response.data.result.saving_goal);
      })
      .catch((error) => {
        console.log("Error fetching goal:", error);
      });
  }, []);

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
      {/* <p className="text-body my-0 mb-3">
        ${balance}/${goal}
      </p> */}

      <GoalBar 
        progress={progress}
        balance={balance} 
        goal={goal}
        subgoals={[0, 0.25*goal, 0.5*goal ,0.75*goal, goal]}/>

      {progress >= 0 && (
        <div className={balance>=goal ? "mt-20" : "mt-4"}>
        {/* <button
          className="bg-primary hover:bg-primary-dark text-white text-button font-bold py-2 px-7 rounded-full"
          onClick={() => {
            setShowSetGoal(true);
          }}
        >
          Update Savings Goal
        </button> */}
      </div>
      )}
    </div>
  );
}