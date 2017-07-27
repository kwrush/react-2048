import React from 'react';

export default function Resize (props) {
    return (
        <div className="resize-ctrl">
            <span>{props.label}</span>
            <button className="button minus" onClick={() => {props.resize(-1)}}>-</button>
            <span className="resize-num">{props.number}</span>
            <button className="button add" onClick={() => {props.resize(1)}}>+</button>
        </div>
    );
} 