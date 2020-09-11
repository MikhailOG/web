import React from 'react'

const inputComponent = (props) => {
    return(
        <div className={"input-"+props.id}>
        <p>{props.children}</p>
        <div className={props.id}>
            <input type="text" id={props.id} defaultValue={props.default}/>
        </div>
    </div>
    );
} 

export default inputComponent;