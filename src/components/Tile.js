import React from 'react';

export default class Tile extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            classNames: ['tile', this.props.newTile ? 'tile-new' : ''],
            innerClass: ['tile-inner', 'tile-' + this.props.value],
            x: this.props.x,
            y: this.props.y,
            value: this.props.value
        }
    }

    componentDidUpdate () {
        this.setState({
            classNames: ['tile']
        });
    }

    move (cell) {
        this.setState({
            x: cell.x,
            y: cell.y
        });
    }

    render () {
        const w = this.props.width;
        const h = this.props.height;
        const x = this.state.x;
        const y = this.state.y;
        const tileStyles = {
            width: w + 'px',
            height: h + 'px',
            top:'0px',
            left: '0px',
            transform: 'translate(' + x + 'px,' + y + 'px)'
        };

        return (
            <div className={this.state.classNames.join(' ')} style={tileStyles}>
                <div className={this.state.innerClass.join(' ')}>{this.props.value}</div>
            </div>
        );
    }
}