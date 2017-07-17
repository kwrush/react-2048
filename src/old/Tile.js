import React from 'react';

export default class Tile extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            classNames: ['tile', this.props.isNew ? 'tile-new' : ''],
            innerClass: ['tile-inner', 'tile-' + this.props.value],
        }
    }

    /*componentDidMount() {
        this.setState({
            classNames: ['tile']
        });
    }*/

    render () {
        const tileStyles = {
            width: `${this.props.width}px`,
            height: `${this.props.height}px`,
            /*top: `${this.props.y}px`,
            left: `${this.props.x}px`*/
            msTransform: `translate(${this.props.x}px, ${this.props.y}px)`,
            WebkitTransform: `translate(${this.props.x}px, ${this.props.y}px)`, 
            transform: `translate(${this.props.x}px, ${this.props.y}px)`
        };

        return (
            <div className={this.state.classNames.join(' ')} style={tileStyles}>
                <div className={this.state.innerClass.join(' ')}>{this.props.value}</div>
            </div>
        );
    }
}