import { useState, useEffect, useContext } from "react";
import axios from "axios";
import SetGoal from "./SetGoal";
import TransactionContext from "../../context/TransactionContext";
import { refreshDisplayGoal } from "../../utility/CurrencyUtil";
import getAxiosInstance from "../../utility/AxiosUtil";
import DefaultButton from "../default/DefaultButton";

export default function UpdateSavingGoalButton() {
    const { currency, setGoal } = useContext(TransactionContext);
    const [newGoal, setNewGoal] = useState("");
    const [showSetGoal, setShowSetGoal] = useState(false);
    const [progress, setProgress] = useState(0);

    // Updates the user's savings goal via the Set New Goal button
    const updateGoal = () => {
        //checks if newGoal is null if it is replace it with 0
        //new val updated goal is used because setNewGoal is Aync and might not update in time for sending data to the db
        let updatedGoal = newGoal;
        if (newGoal === "") {
            updatedGoal = 0;
            refreshDisplayGoal(setGoal, currency);
        }

        //saves newGoal to the DB
        const axiosInstance = getAxiosInstance();

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

    useEffect(() => {
        if (showSetGoal) {
            setNewGoal(""); // Reset the new goal when the modal is opened
        }
    }, [showSetGoal]);

    return (
        <div>
            <DefaultButton
                className="bg-primary hover:bg-primary-dark text-white text-button font-bold py-2 px-7 rounded-full"
                onClick={() => {
                    setShowSetGoal(true);
                }}
            >
                Update Savings Goal
            </DefaultButton>
            {showSetGoal && (
                <SetGoal
                    newGoal={newGoal}
                    setNewGoal={setNewGoal}
                    updateGoal={updateGoal}
                    closeModal={() => setShowSetGoal(false)}
                />

                //resets newGoal to null
            )}
        </div>
    );
}
