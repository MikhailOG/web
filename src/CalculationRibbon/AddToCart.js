import React from 'react'

const addToCart = () => {
    return(
        <div className="add-to-cart">
            <div className="count">
                <i className="fas fa-plus"></i>
                <input type="number" id="qty" defaultValue="1"/>
                <i className="fas fa-minus"></i>
            </div>
            <div className="cart">
                <i className="fas fa-cart-arrow-down"></i>
            </div>
        </div>
    );

}

export default addToCart;