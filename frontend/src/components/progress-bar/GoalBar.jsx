import React from 'react';
import PropTypes from 'prop-types';

function GoalBar({ progress, balance, goal, subgoals }) {
  const hasReachedGoal = Number(balance) >= Number(goal);
  const filteredSubgoals = subgoals.slice(1, -1);
  const subgoalPositions = filteredSubgoals.map(subgoal => (Number(subgoal) / Number(goal)) * 100);

  return (
    <div className="w-full bg-gray-200 rounded-lg h-6 relative">
      {/* Progress Bar */}
      <div className="bg-gray-200 rounded-lg h-6 relative">
        <div
          className="bg-gradient-to-r from-blue-400 bg-primary h-full rounded-lg"
          style={{ width: `${progress}%` }}>        
          <div className="absolute inset-0 flex items-center justify-center text-black">
            {/* need to update the dollar sign with currency change */}
            {/* need to updaate balance with currency change */}
            ${balance}/${goal} 
          </div>
        </div>

      </div>

      {/* Grey Lines for Subgoals */}
      <div className="absolute w-full h-full top-0 left-0 flex">
        {subgoalPositions.map((position, index) => (
          <div
            key={index}
            className="absolute border-l border-gray-400"
            style={{
              left: `${position}%`,
              height: '24px', // Make it the same height as the progress bar
              width: '2px',  // Width of the line
              top: '0',      // Align to the top of the progress bar
            }}
          ></div>
        ))}
      </div>

      {/* Labels for Subgoals */}
      <div className="absolute w-full flex justify-between -top-6">
        {subgoals.map((subgoal, index) => (
          <div key={index} className="text-center w-0 relative">
            <span
              className={`absolute left-1/2 transform -translate-x-1/2 text-xs 
                ${Number(balance) >= Number(subgoal) ? "text-green-700 border-green-500" : "text-red-500 border-red-500"} 
                border rounded px-1`}
            >
              ${subgoal}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
GoalBar.propTypes = {
  progress: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  balance: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  goal: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  subgoals: PropTypes.arrayOf(
    PropTypes.any
  ).isRequired,
};

export default GoalBar;
