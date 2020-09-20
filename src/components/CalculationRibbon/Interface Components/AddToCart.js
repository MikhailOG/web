import React, { useContext } from 'react'
import InputContext from '../../../context/input-context'

const AddToCart = () => {
    const inputContext = useContext(InputContext);
    return(
            <div className="add-to-cart">
                <div className="count">
                    <i onClick= {(event) => inputContext.qtyHandler('addMode', event)} className="fas fa-plus"></i>
                    <input type="text" id="qty" defaultValue="1"/>
                    <i onClick= {(event) => inputContext.qtyHandler('subtractMode', event)} className="fas fa-minus"></i>
                </div>
                <div className="cart">
                    <i className="fas fa-cart-arrow-down"></i>
                </div>
            </div>    
    );

}

export default AddToCart;