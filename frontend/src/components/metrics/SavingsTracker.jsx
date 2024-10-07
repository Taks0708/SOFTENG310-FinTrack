import { useState, useEffect, useContext } from "react";
import axios from "axios";
import SetGoal from "./SetGoal";
import TransactionContext from "../../context/TransactionContext";
import { refreshDisplayBalance } from "../../utility/CurrencyUtil";
import '../../assets/css/savingsTracker.css';
import GoalBar from '../progress-bar/GoalBar';
import CompletionMsg from "../progress-bar/CompletionMsg";

export default function SavingsTracker() {
  const { currency, balance, goal, setGoal } = useContext(TransactionContext);
  const [progress, setProgress] = useState(0);
  const [displayBalance, setDisplayBalance] = useState(0);
  const [showSetGoal, setShowSetGoal] = useState(false);
  const [newGoal, setNewGoal] = useState(0);

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

  // Updates the user's savings goal via the Set New Goal button
  const updateGoal = () => {
    //checks if newGoal is null if it is replace it with 0
    //new val updated goal is used because setNewGoal is Aync and might not update in time for sending data to the db
    let updatedGoal = newGoal;
    if (newGoal === '') {
      updatedGoal = 0;
      setNewGoal(0)
    }

    //saves newGoal to the DB
    const token = localStorage.getItem("token");
    const axiosInstance = axios.create({
      baseURL: "http://localhost:4000",
      headers: { Authorization: `Bearer ${token}` },
    });

    axiosInstance
      .patch("/user/goal", {
        goal: updatedGoal,
      })
      .then((response) => {
        setGoal(updatedGoal);
        setShowSetGoal(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex flex-col items-center mb-2 mt-2 w-[80%]">
      {/* <h2 className="text-sub-heading font-bold m-0">Current Savings Goal:</h2>
      <p className="text-body my-0 mb-3">
        ${balance}/${goal}
      </p> */}

      {/* Use flexbox to align GoalBar and button */}
      <div className="flex items-center w-full pt-4">
        <GoalBar
          progress={progress}
          balance={balance}
          goal={goal}
          subgoals={[0, 0.25 * goal, 0.5 * goal, 0.75 * goal, goal]}
        />

        <CompletionMsg />


        {progress >= 0 && (
          <div className="ml-4"> {/* Margin left to separate the button from GoalBar */}
            <button
              className="updateGoalButton"
              onClick={() => {
                setShowSetGoal(true);
              }}
            >
              Update
            </button>
          </div>
        )}
      </div>

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
