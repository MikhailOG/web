import React, { useContext} from 'react'
import RowContext from '../../../context/row-context'
const SelectComponent = (props) => {
    const rowContext = useContext(RowContext);
    return(
        <div className={"input-"+props.id}>
            <p>{props.children}</p>
            <div className={props.id}>
                <select id={props.id} value={rowContext[props.id]} onChange={rowContext.inputChangedHandler}>
                    {props.values.map(value => <option key={value[0]} value={value[0]}>{value[1]}</option>)}
                </select>
            </div>
        </div>
    );
} 

export default SelectComponent;