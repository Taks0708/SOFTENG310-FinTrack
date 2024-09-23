import { useState, useEffect, useContext } from "react";
import axios from "axios";
import SetGoal from "./SetGoal";
import TransactionContext from "../context/TransactionContext";

export default function SavingsTracker() {
  const { currency, convertCurrency, balance, setBalance } = useContext(TransactionContext);
  const [goal, setGoal] = useState(0);
  const [newGoal, setNewGoal] = useState(0);
  const [showSetGoal, setShowSetGoal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [displayGoal, setDisplayGoal] = useState(0);
  const [displayBalance, setDisplayBalance] = useState(0);

  //Variables for axios instance
  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: "http://localhost:4000",
    headers: { Authorization: `Bearer ${token}` },
  });

  // Fetch the user's current balance and convert to specified currency when the component mounts
  useEffect(() => {
    axiosInstance
      .get("/user/balance")
      .then((response) => {
        const convert = async () => {
          const convertedAmount = await convertCurrency(currency, "NZD", response.data.result.balance); // using context to convert amount
          setDisplayBalance(convertedAmount);
        };
        convert();
      })
      .catch((error) => {
        console.log(error);
      });
  }, [balance, currency]);

  // Fetch the user's current savings goal and convert to specified currency when the component mounts
  useEffect(() => {

    axiosInstance
    .get("/user/goal")
    .then((response) => {
      const convert = async () => {
        const convertedAmount = await convertCurrency(currency, "NZD", response.data.result.saving_goal); // using context to convert amount
        setDisplayGoal(convertedAmount);
      };
      convert();
    })
    .catch((error) => {
      console.log(error);
    });
  }, [goal, currency]);

  //Dynamic progress bar whenver the balance or goal changes
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
    const token = localStorage.getItem("token");
    const axiosInstance = axios.create({
      baseURL: "http://localhost:4000",
      headers: { Authorization: `Bearer ${token}` },
    });

    axiosInstance
      .patch("/user/goal", {
        goal: newGoal,
      })
      .then((response) => {
        setGoal(newGoal);
        setShowSetGoal(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="flex flex-col items-center gap-2 mb-2 mt-2 w-[40%]">
      <h2 className="text-sub-heading font-bold m-0"> Current Savings Goal:</h2>
      <p className="text-body my-0 mb-3">
        ${displayBalance}/${displayGoal}
      </p>
      <div className="w-full h-11 bg-white outline-primary outline outline-3 rounded-full">
        <div
          className="h-11 rounded-full bg-primary"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {progress >= 0 && (
        <button
          className="bg-primary hover:bg-primary-dark text-white text-button font-bold py-2 px-7 rounded-full my-4"
          onClick={() => {
            setShowSetGoal(true);
            console.log("goal:" + displayGoal);
            console.log("progress:" + progress);
          }}
        >
          Update Savings Goal
        </button>
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
