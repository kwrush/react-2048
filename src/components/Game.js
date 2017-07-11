import React from 'react';
import Grid from './Grid';

const defaultProps = {
    row: 4,
    col: 4,
    max: 2048
};

export default class Game extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div id="game-container">
                <Grid 
                    row={this.props.row}
                    col={this.props.col}
                    max={this.props.max}
                />
            </div>
        );
    }
}

Game.defaultProps = defaultProps;