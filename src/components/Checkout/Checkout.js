import React, { Component } from 'react';
import Button from '../UI/Button';

class Checkout extends Component {

render () {
    return (
        <div className="checkout-wrapper">
            <div className="checkout-border-left"/>
            <div className="checkout-border-top"/>
            <div className="checkout-border-bottom"/>
            <div className="checkout-border-right"/>
            <div className="checkout">
                    <h3>Congrats!</h3>
                    <canvas id="myCanvas" width={this.props.canvasSize} height={this.props.canvasSize}></canvas>
                    <Button
                    click
                    classes="escape">Click</Button>
                </div>          
        </div>
    );
}
}

export default Checkout;