import React from 'react';

export default class Tile extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            classNames: ['tile', 'tile-new'],
            innerClass: ['tile-inner', 'tile-' + this.props.value]
        }
    }

    componentDidUpdate () {
        this.setState({
            classNames: ['tile']
        });
    }

    render () {
        const w = this.props.width;
        const h = this.props.height;
        const x = this.props.x;
        const y = this.props.y;
        const tileStyles = {
            width: w + 'px',
            height: h + 'px',
            transform: 'translate(' + x + 'px,' + y + 'px)'
        };

        return (
            <div className={this.state.classNames.join(' ')} style={tileStyles}>
                <div className={this.state.innerClass.join(' ')}>{this.props.value}</div>
            </div>);
    }
}