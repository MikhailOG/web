import React, { useContext } from 'react'
import InputContext from '../../../context/input-context'
import RowContext from '../../../context/row-context'
const AddToCart = () => {
    const inputContext = useContext(InputContext);
    const rowContext = useContext(RowContext);
    return(
            <div className="add-to-cart">
                <div className="count">
                    <i onClick= {(event) => inputContext.qtyHandler('addMode', event)} className="fas fa-plus"></i>
                    <input onChange={(event) => inputContext.qtyHandler('onChangeMode', event)} type="text" id="qty" value={rowContext.qty}/>
                    <i onClick= {(event) => inputContext.qtyHandler('subtractMode', event)} className="fas fa-minus"></i>
                </div>
                <div className="cart">
                    <i className="fas fa-cart-arrow-down"></i>
                </div>
            </div>    
    );

}

export default AddToCart;