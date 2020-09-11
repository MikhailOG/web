import React from 'react';

const btn = (props) => {
    const style = {
        background: "#E3D7FF",
        border: '3px solid #f3fffd',
        borderBottom: 'none'
    }
    return ( <div type="bed" className={props.serviceClass + " btnBed"} style={(props.hover === props.index) ? style:null}>
                <button type="submit"
                onClick={props.click}
                className={((props.hover === props.index)&&(props.currentClass)) ? (props.clicked ? props.serviceClass + " btn hover clicked":props.serviceClass + " btn hover") : props.serviceClass + " btn"}>
                {props.serviceTitle}</button>
            </div>
    );
}
export default btn;
