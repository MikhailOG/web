import React, { useContext } from 'react'
import RowContext from '../../../context/row-context'

const InputComponent = (props) => {
    const rowContext = useContext(RowContext);
    return(
        <div className={"input-"+props.id}>
        <p>{props.children}</p>
        <div className={props.id}>
            <input type="text" onChange={rowContext.inputChangedHandler} id={props.id} value={rowContext[props.id]}/>
        </div>
    </div>
    );
} 

export default InputComponent;