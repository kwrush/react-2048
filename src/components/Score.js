import React from 'react';

// Needed to recreated DOM element in order to 
// abort the current animation and render the new result
let _resultKey = 0;

export default function Score (props) {
    return (
        <div className="score-board" onAnimationEnd={props.resetScoreAdded}>
            <div className="score">
                <span>{props.score}</span>
                {!!props.scoreAdded && <div key={_resultKey++} className="scoreAdded" >+{props.scoreAdded}</div>}    
            </div>
            <div className="record">{props.bestScore}</div> 
        </div>
    );
} 