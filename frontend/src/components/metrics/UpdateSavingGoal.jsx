import { useState, useEffect, useContext } from "react";
import axios from "axios";
import SetGoal from "./SetGoal";
import TransactionContext from "../../context/TransactionContext";
import { refreshDisplayGoal } from "../../utility/CurrencyUtil";

export default function UpdateSavingGoal() {
  const { currency, goal, setGoal } = useContext(TransactionContext);

  // Updates the user's savings goal via the Set New Goal button
  const updateGoal = () => {
    //checks if newGoal is null if it is replace it with 0
    //new val updated goal is used because setNewGoal is Aync and might not update in time for sending data to the db
    let updatedGoal = newGoal;
    if(newGoal === ''){
      updatedGoal = 0;
      refreshDisplayGoal(setGoal, currency);
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
}