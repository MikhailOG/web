import React, { Component } from 'react';


class ImageCard extends Component {
    constructor(props) {
        super(props);
        this.state = { spans: 0};
        this.imageRef = React.createRef();
        //console.log(this.props)
    }
    componentDidMount() {
        this.imageRef.current.addEventListener('load', this.setSpans); 
    }
    setSpans = () => {
        if (this.imageRef.current) {
            this.imageRef.current.removeEventListener('load', this.setSpans); 
            const height = this.imageRef.current.clientHeight;
            const spans = Math.ceil( height / 10+1);
            this.setState({ spans });
        }
    }
    render() {
        return(
            <div style={{ gridRowEnd: `span ${this.state.spans}`}}>

                <img 
                    onClick={() => this.props.imageClickedHandler(this.props.img, this.props.imgKey)}
                    ref={this.imageRef}
                    src={this.props.img} 
                    alt={`image #${this.props.imgIndex}`}
                />
            </div>
        );
    }
}
export default ImageCard