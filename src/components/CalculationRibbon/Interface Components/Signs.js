import React, { useContext } from 'react'
import InputContext from '../../../context/input-context'
import RowContext from '../../../context/row-context'

const Signs = () => {
    const inputContext = useContext(InputContext);
    const rowContext = useContext(RowContext);
    const caretType = rowContext.mode?"fa-caret-right":"fa-caret-down"

    return(
        <div className="signs">
            <p>
                <i className="far fa-plus-square" onClick={inputContext.addRowHandler}></i>
                <i className={"fas " + caretType} onClick={inputContext.hideRowHandler}></i>
            </p>
        </div>
    );

}

export default Signs;