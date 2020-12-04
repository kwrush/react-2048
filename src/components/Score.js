import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  score: PropTypes.number.isRequired,
  scoreAdded: PropTypes.number.isRequired,
  bestScore: PropTypes.number.isRequired,
  resetScoreAdded: PropTypes.func.isRequired,
};

function Score(props) {
  //Assign a key to force React to update adding score animation
  return (
    <div className="score-board" onAnimationEnd={props.resetScoreAdded}>
      <div className="score">
        <span>{props.score}</span>
        {!!props.scoreAdded && (
          <div key={props.score + ''} className="scoreAdded">
            +{props.scoreAdded}
          </div>
        )}
      </div>
      <div className="record">{props.bestScore}</div>
    </div>
  );
}

Score.propTypes = propTypes;

export default Score;
