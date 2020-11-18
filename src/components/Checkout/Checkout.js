import React, { Component } from 'react';
import Button from '../UI/Button';

class Checkout extends Component {
state={
    wrapperStyle: {},
    checkoutStyle: {},
    canvasStyle: {},
    content: null

}


erase = () => {
    this.setState({
        wrapperStyle: {
            background: "radial-gradient(circle at top right, transparent 39.5%, #10387d 39.5%)",
            animation: "gradientBG 0.5s linear 1 0.0007s",
            backgroundSize: "280% 280%",
            backgroundPosition: "0% 100%"
        },
        checkoutStyle: {
            color: "red",
            background: "radial-gradient(circle at top right, transparent 39.5%, #10387d 39.5% 39.65%, #ABA9BF 39.65%)",
            animation: "gradientBG 0.5s linear 1",
            backgroundSize: "280% 280%",
            backgroundPosition: "0% 100%"
        },
        canvasStyle: {
            background: "radial-gradient(circle at top right, transparent 39.5%, #f3fffd 39.5%)",
            animation: "gradientBG 0.5s linear 1 0.1s",
            backgroundSize: "280% 280%",
            backgroundPosition: "0% 100%"
        }
    }, console.log("clicked"))
}
render () {

    this.setState({
        content: 
        <div className="checkout-wrapper" style={this.state.wrapperStyle}>
        <div className="checkout" style={this.state.checkoutStyle}>
            <h3>Congrats!</h3>
            <canvas 
                id="myCanvas" 
                width={this.props.canvasSize} 
                height={this.props.canvasSize}
                style={this.state.canvasStyle}></canvas>
            <Button
            clicked={this.erase}
            classes="escape">Click</Button>
        </div>          
    </div>
    })
    return (
        this.state.content
    );
}
}

export default Checkout;