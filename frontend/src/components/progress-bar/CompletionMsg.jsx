import { useContext, useState } from "react"
import TransactionContext from "../../context/TransactionContext"
function CompletionMsg() {
    const {goal, balance} = useContext(TransactionContext);
    const hasReachedGoal = Number(balance) >= Number(goal);
    return (
    <div>
      {hasReachedGoal && (
        <div className="mt-2 w-full bg-green-100 border border-green-300 rounded-lg p-2">
          <p className="text-green-700 font-semibold">Congratulations! Reached ${goal}🎉</p>
        </div>
      )}
    </div>
    )
}

export default CompletionMsg