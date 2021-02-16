import React, { Component } from 'react';

class ImageCard extends Component {
    constructor(props) {
        super(props);
        this.state = { spans: 0};
        this.imageRef = React.createRef();
        this.img = require(`../../images/${this.props.index}.jpeg`)
    }
    componentDidMount() {
        this.imageRef.current.addEventListener('load', this.setSpans); 
    }
    setSpans = () => {
        const height = this.imageRef.current.clientHeight;
        const spans = Math.ceil( height / 10+1);
        this.setState({ spans });
    }
    render() {
        return(
            <div style={{ gridRowEnd: `span ${this.state.spans}`}}>
                <img 
                    ref={this.imageRef}
                    src={this.img.default} 
                    alt={`image #${this.props.index}`}
                />
            </div>
        );
    }
}
export default ImageCard