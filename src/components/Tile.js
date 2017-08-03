import React from 'react';

export default function Tile (props) {
    const average = (props.width + props.height) / 2;
    const tileStyles = {
        width: `${props.width}px`,
        height: `${props.height}px`,
        fontSize: `${props.value >= 1024 ? average / 2.8 : average / 2}px`, 
        msTransform: `translate(${props.x}px, ${props.y}px)`,
        WebkitTransform: `translate(${props.x}px, ${props.y}px)`, 
        transform: `translate(${props.x}px, ${props.y}px)`
    };

    const tileClasses = ['tile', props.isNew ? 'tile-new' : '', props.isMerged ? 'tile-merge' : ''];
    const innerClasses = ['tile-inner', 'tile-' + (props.value <= 2048 ? props.value : 'beyond')];

    return (
        <div className={tileClasses.join(' ')} style={tileStyles}>
            <div className={innerClasses.join(' ')}>{props.value}</div>
        </div>
    );
}