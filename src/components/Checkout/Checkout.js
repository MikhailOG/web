import React, { Component } from 'react';
import Button from '../UI/Button';

class Checkout extends Component {

render () {
    return (
        <div className="checkout">
            <h3>Congrats!</h3>
            <canvas id="myCanvas" width={this.props.canvasSize} height={this.props.canvasSize}></canvas>
            <Button
            click
            classes="escape">Click</Button>
        </div>
    );
}
}

export default Checkout;