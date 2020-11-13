import React, { Component } from 'react';

class Checkout extends Component {

render () {
    return (
        <div className="checkout">
            <ul> 
            <li> THIS IS</li>
            <li>A BRILLIANT</li>
            <li>WEB dEsign</li>
            </ul>
            {this.props.children}
        </div>
    );
}
}

export default Checkout;