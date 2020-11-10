import React, { useContext } from 'react'
import InputContext from '../../../context/input-context'
import RowContext from '../../../context/row-context'
import UtilityContext from '../../../context/utility-context'
const Signs = () => {
    const inputContext = useContext(InputContext);
    const rowContext = useContext(RowContext);
    const utilityContext = useContext(UtilityContext);
    const caretType = rowContext.mode?"fa-caret-right":"fa-caret-down"

    return(
        <div className="signs">
            <p>
                <i className="far fa-plus-square" onClick={inputContext.addRowHandler}></i>
                <i className={"fas " + caretType} onClick={(event) => {
                    inputContext.hideRowHandler(event);
                    utilityContext.switchContentHandler();
                    rowContext.togglePreferencesHandle();
                }}></i>
            </p>
        </div>
    );

}

export default Signs;