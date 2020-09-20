import React, { useContext} from 'react'
import RowContext from '../../../context/row-context'
const SelectComponent = (props) => {
    const rowContext = useContext(RowContext);
    return(
        <div className={"input-"+props.id}>
        <p>{props.children}</p>
        <div className={props.id}>
            <select name={props.id} id={props.id} value={rowContext.diameter} onChange={rowContext.inputChangedHandler}>
                {rowContext.diameters.map(value => <option key={value} value={value}>{value+" мм"}</option>)}
            </select>
        </div>
    </div>
    );
} 

export default SelectComponent;