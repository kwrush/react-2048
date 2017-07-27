import React from 'react';

export default function Score (props) {
    return (
        <div className="score-board">
            <div className="score">{props.score}</div>
            <div className="record">Record</div> 
        </div>
    );
} 