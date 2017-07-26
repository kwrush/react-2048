import React from 'react';

export default function Tile (props) {
    const tileStyles = {
        width: `${props.width}px`,
        height: `${props.height}px`,
        msTransform: `translate(${props.x}px, ${props.y}px)`,
        WebkitTransform: `translate(${props.x}px, ${props.y}px)`, 
        transform: `translate(${props.x}px, ${props.y}px)`
    };

    const tileClasses = ['tile', props.isNew ? 'tile-new' : '', props.isMerged ? 'tile-merge' : ''];
    const innerClasses = ['tile-inner', 'tile-' + props.value];

    return (
        <div className={tileClasses.join(' ').trim()} style={tileStyles}>
            <div className={innerClasses.join(' ')}>{props.value}</div>
        </div>
    );
}