import { useState, useEffect, useContext } from "react";
import TransactionContext from "../../context/TransactionContext";
import GoalBar from "../progress-bar/GoalBar";
import "../../assets/css/savingsTracker.css";

export default function SavingsTracker() {
    const { balance, goal, currencySymbol } = useContext(TransactionContext);
    const [progress, setProgress] = useState(0);

    /* Dynamic progress bar whenver the balance or goal changes */
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
        console.log("AKA: ", balance, " / ", goal);
    }, [balance, goal]);

    return (
        <div className="trackerContainer">
            <GoalBar
                progress={progress}
                balance={balance}
                goal={goal}
                subgoals={[0, 0.25 * goal, 0.5 * goal, 0.75 * goal, goal]}
            />
            <div className="balanceCounterContainer">
                <p className="balanceCounter">
                    {Number.parseFloat(balance).toFixed(2)} /{" "}
                    {Number.parseFloat(goal).toFixed(2)} ({currencySymbol})
                </p>
            </div>
        </div>
    );
}
