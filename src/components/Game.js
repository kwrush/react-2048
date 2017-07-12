import React from 'react';
import Grid from './Grid';

const defaultProps = {
    rows: 4,
    cols: 4,
    max: 2048,
    gridSize: 400
};

export default class Game extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div id="game-container">
                <Grid 
                    gridSize={this.props.gridSize}
                    rows={this.props.rows}
                    cols={this.props.cols}
                />
            </div>
        );
    }
}

Game.defaultProps = defaultProps;