import React, { useContext, useState } from 'react';
import RowContext from '../../../context/row-context';
const AddToCart = () => {

    const rowContext = useContext(RowContext);
    const [mouseState, setMouseState] = useState({
        intervalId: 1,
        mouseDown: false
    });
    const stopHandler = () => {
        clearInterval(mouseState.intervalId);
        let newMouseState = {...mouseState};
        newMouseState.mouseDown = false;
        setTimeout(() => setMouseState(newMouseState), 1)
    }
    return(
            <div className="add-to-cart">
                <div className="count">
                    <i 
                        onClick= {(event) => {
                                if (mouseState.mouseDown === false) {
                                    rowContext.qtyHandler('addMode', event)
                                }
                            }
                        } 
                        onMouseDown= {
                            (event) => {
                                if (!mouseState.mouseDown) {
                                    const target = event.target;
                                let newMouseState = {...mouseState};
                                newMouseState.intervalId = setInterval(() =>{
                                    rowContext.targetedQtyHandler('addMode', target);
                                    newMouseState.mouseDown = true;
                                }, 200, target)
                                setMouseState(newMouseState);
                                }
                            }
                        }
                        onMouseUp= {stopHandler}
                        onMouseLeave= {stopHandler}
                        className="fas fa-plus"></i>
                    <input onChange={(event) => rowContext.qtyHandler('onChangeMode', event)} type="text" id="qty" value={rowContext.qty}/>
                    <i 
                        onClick= {(event) => {
                                if (mouseState.mouseDown === false) {
                                    rowContext.qtyHandler('subtractMode', event)
                                }
                            }
                        } 
                        onMouseDown= {
                            (event) => {
                                if (!mouseState.mouseDown) {
                                    const target = event.target;
                                    let newMouseState = {...mouseState};
                                    newMouseState.intervalId = setInterval(() =>{
                                        rowContext.targetedQtyHandler('subtractMode', target);
                                        newMouseState.mouseDown = true;
                                    }, 200, target)
                                    setMouseState(newMouseState);
                                }
                            }
                        }
                        onMouseUp= {stopHandler}
                        onMouseLeave= {stopHandler}
                        className="fas fa-minus"></i>
                </div>
                <div className="cart">
                    <i className="fas fa-cart-arrow-down"></i>
                </div>
            </div>    
    );

}

export default AddToCart;