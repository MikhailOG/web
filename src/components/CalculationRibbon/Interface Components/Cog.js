import React, { useState } from 'react';

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
    return (
        <div className="cog">
            <i className={"fa fa-cog " + spinState.spin} onMouseEnter={addSpinHandler} onMouseLeave={removeSpinHandler}></i>
        </div>
    );
};
export default Cog