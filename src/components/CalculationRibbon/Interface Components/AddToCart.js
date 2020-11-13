import React, { useContext, useState } from 'react'
import InputContext from '../../../context/input-context'
import RowContext from '../../../context/row-context'
const AddToCart = () => {
    const inputContext = useContext(InputContext);
    const rowContext = useContext(RowContext);
    const [mouseState, setMouseState] = useState({
        intervalId: 1,
        mouseDown: false
    });

    return(
            <div className="add-to-cart">
                <div className="count">
                    <i 
                        onClick= {(event) => {
                                if (mouseState.mouseDown === false) {
                                    inputContext.qtyHandler('addMode', event)
                                }
                            }
                        } 
                        onMouseDown= {
                            (event) => {
                                const target = event.target;
                                let newMouseState = {...mouseState};
                                newMouseState.intervalId = setInterval(() =>{
                                    inputContext.targetedQtyHandler('addMode', target);
                                    newMouseState.mouseDown = true;
                                }, 200, target)
                                setMouseState(newMouseState);
                            }
                        }
                        onMouseUp= {
                            () => {
                                clearInterval(mouseState.intervalId);
                                let newMouseState = {...mouseState};
                                newMouseState.mouseDown = false;
                                setTimeout(() => setMouseState(newMouseState), 1)
                            }
                        }
                        className="fas fa-plus"></i>
                    <input onChange={(event) => inputContext.qtyHandler('onChangeMode', event)} type="text" id="qty" value={rowContext.qty}/>
                    <i 
                        onClick= {(event) => {
                                if (mouseState.mouseDown === false) {
                                    inputContext.qtyHandler('subtractMode', event)
                                }
                            }
                        } 
                        onMouseDown= {
                            (event) => {
                                const target = event.target;
                                let newMouseState = {...mouseState};
                                newMouseState.intervalId = setInterval(() =>{
                                    inputContext.targetedQtyHandler('subtractMode', target);
                                    newMouseState.mouseDown = true;
                                }, 200, target)
                                setMouseState(newMouseState);
                            }
                        }
                        onMouseUp= {
                            () => {
                                clearInterval(mouseState.intervalId);
                                let newMouseState = {...mouseState};
                                newMouseState.mouseDown = false;
                                setTimeout(() => setMouseState(newMouseState), 1)
                            }
                        }
                        className="fas fa-minus"></i>
                </div>
                <div className="cart">
                    <i className="fas fa-cart-arrow-down"></i>
                </div>
            </div>    
    );

}

export default AddToCart;