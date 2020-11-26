import React, { Component } from 'react';
import Button from '../UI/Button';
import { connect } from 'react-redux'

class Checkout extends Component {
state={
    wrapperStyle: {},
    checkoutStyle: {},
    canvasStyle: {},
    showContainer: true,
    canvasGradientAngle: '45deg'
}

animationDuration = '0.5s';

componentDidMount() {
    window.addEventListener('resize', this.handleResize);
};
componentWillUnmount(){
    window.removeEventListener('resize', this.handleResize);
};
handleResize = () => {
    const wrapper = document.getElementById('checkoutWrapper');
    if (wrapper)
    this.setState({
        canvasGradientAngle: Math.atan( wrapper.clientHeight / wrapper.clientWidth)*180/Math.PI + 'deg'
    }, console.log(this.state.canvasGradientAngle));
};



erase = () => {
    this.setState({
        wrapperStyle: {
            background: "radial-gradient(circle at top right, transparent 39.5%, #10387d 39.5%)",
            animation: "gradientBG " + this.animationDuration + " linear 1 0.0007s",
            backgroundSize: "280% 280%",
            backgroundPosition: "0% 100%"
        },
        checkoutStyle: {
            color: "red",
            background: "radial-gradient(circle at top right, transparent 39.5%, #10387d 39.5% 39.65%, #ABA9BF 39.65%)",
            animation: "gradientBG " + this.animationDuration + " linear 1",
            backgroundSize: "280% 280%",
            backgroundPosition: "0% 100%"
        },
        canvasStyle: {
            backgroundColor: "inherit",
            borderColor: "transparent"
            // background: "radial-gradient(circle at top right, transparent 39.5%, #f3fffd 39.5%)",
            // animation: "gradientBG " + this.animationDuration + " linear 1 0.1s",
            // backgroundSize: "280% 280%",
            // backgroundPosition: "0% 100%"
        }
    }, () => {
        setTimeout(()=> {
            this.setState({
                showContainer:false
            })
        }, 500)
    })

}
render () {

    return (
        (this.state.showContainer*this.props.showCheckout)?
        <div className="checkout-wrapper" id="checkoutWrapper" style={this.state.wrapperStyle}>
            <div className="checkout" style={this.state.checkoutStyle}>
                <h3>Congrats!</h3>
                <canvas 
                    id="myCanvas" 
                    width={this.props.canvasSize} 
                    height={this.props.canvasSize}
                    style={this.state.canvasStyle}>
                </canvas>
                <Button
                clicked={this.erase}
                classes="escape">Click</Button>
            </div>          
        </div>:null
    );
}
}
// const mapStateToProps = state => {

// }

export default connect()(Checkout);