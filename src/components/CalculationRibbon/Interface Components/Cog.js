import React, { useState, useContext } from 'react';
import RowContext from '../../../context/row-context';
const Cog = () => {
    const [spinState, setSpinState] = useState({
        spin: ''
    })
    const addSpinHandler = () => {
        setSpinState({
            spin: 'slow-spin'
        })
    }
    const removeSpinHandler = () => {
        setSpinState({
            spin: ''
        })
    }
    const rowContext = useContext(RowContext);
    return (
        <div className="cog">
            <i className={"fa fa-cog " + spinState.spin} onMouseEnter={addSpinHandler} onMouseLeave={removeSpinHandler} onClick = {rowContext.gearHandler}></i>
        </div>
    );
};
export default Cog