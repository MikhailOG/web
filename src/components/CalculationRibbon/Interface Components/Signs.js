import React, { useContext } from 'react'
import RowContext from '../../../context/row-context'
import UtilityContext from '../../../context/utility-context'
const Signs = () => {
    const rowContext = useContext(RowContext);
    const utilityContext = useContext(UtilityContext);
    const caretType = rowContext.mode?"fa-caret-right":"fa-caret-down"

    return(
        <div className="signs">
            <p>
                <i className="far fa-plus-square" onClick={rowContext.addRowHandler}></i>
                <i className={"fas " + caretType} onClick={() => {
                    rowContext.hideRowHandler();
                    utilityContext.switchContentHandler();
                }}></i>
            </p>
        </div>
    );

}

export default Signs;