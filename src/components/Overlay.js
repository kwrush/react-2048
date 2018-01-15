import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  win: PropTypes.bool,
  lose: PropTypes.bool,
  continue: PropTypes.func.isRequired
};

const defaultProps = {
  win: false,
  lose: false
};

function Overlay (props) {

    let text = null;
    let continueButton = null;
    if (props.win) {
        text = (<p>You win! Continue?</p>);
        continueButton = (<button className="button continue" onClick={props.continue}></button>);
    } else if (props.lose) {
        text = (<p>Oops...Game Over</p>);
    }
    
    const overlay = (
        <div className="overlay">
            {text}
            <div className="button-container">
                {continueButton}
                <button className="button replay" onClick={props.reset}></button>
            </div>
        </div>
    );

    return props.win || props.lose ? overlay : null;
};

Overlay.propTypes = propTypes;
Overlay.defaultProps = defaultProps;

export default Overlay;