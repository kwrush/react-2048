import React from 'react';

export default function Score (props) {
    return (
        <div className="score-board" onAnimationEnd={props.resetScoreAdded}>
            <div className="score">
                <span>{props.score}</span>
                {!!props.scoreAdded && <div className="scoreAdded">+{props.scoreAdded}</div>}    
            </div>
            <div className="record">Record</div> 
        </div>
    );
} 