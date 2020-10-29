import React, { useContext } from 'react'
import InputContext from '../../../context/input-context'

const Signs = () => {
    const inputContext = useContext(InputContext);
    return(
        <div className="signs">
            <p>
                <i className="far fa-plus-square" onClick={inputContext.addRowHandler}></i>
                <i className="fas fa-caret-right" onClick={inputContext.hideRowHandler}></i>
            </p>
        </div>
    );

}

export default Signs;