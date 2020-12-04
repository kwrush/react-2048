import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  label: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  resize: PropTypes.func.isRequired,
};

function Resize(props) {
  return (
    <div className="resize-ctrl">
      <span>{props.label}</span>
      <button
        className="button minus"
        onClick={() => {
          props.resize(-1);
        }}
      >
        -
      </button>
      <span className="resize-num">{props.number}</span>
      <button
        className="button add"
        onClick={() => {
          props.resize(1);
        }}
      >
        +
      </button>
    </div>
  );
}

Resize.propTypes = propTypes;

export default Resize;
