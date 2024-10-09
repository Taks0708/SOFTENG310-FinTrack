import { useContext, useState } from "react";
import TransactionContext from "../../context/TransactionContext";
function CompletionMsg() {
    const { goal, balance } = useContext(TransactionContext);
    const hasReachedGoal = Number(balance) >= Number(goal);
    return (
        <div>
            {hasReachedGoal && (
                <div className="mt-2 w-full bg-green-100 border border-green-300 rounded-lg m-4">
                    <p className="text-green-700 font-semibold text-center whitespace-nowrap">
                        🎉Reached ${goal}🎉
                    </p>
                </div>
            )}
        </div>
    );
}

export default CompletionMsg;
