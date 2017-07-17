import React from 'react';
import Container from './Container';

const defaultProps = {
    rows: 4,
    cols: 4,
    max: 2048,
    startTiles: 2,
    gridSize: 360
};

export default class Game extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div id="game">
                <Container
                    startTiles={this.props.startTiles}
                    gridSize={this.props.gridSize}
                    rows={this.props.rows}
                    cols={this.props.cols}
                />
            </div>
        );
    }
}

Game.defaultProps = defaultProps;