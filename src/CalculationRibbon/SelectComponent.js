import React from 'react'

const selectComponent = (props) => {
    return(
        <div className={"input-"+props.id}>
        <p>{props.children}</p>
        <div className={props.id}>
            <select name={props.id} id={props.id} defaultValue={props.default}>
                {props.values.map(value => <option key={value} value={value}>{value+" мм"}</option>)}
            </select>
        </div>
    </div>
    );
} 

export default selectComponent;