import React from 'react';

const btn = (props) => {
    const style = {
        background: '#4A4063'
    }
    return ( <div type="bed" className={props.serviceClass + " btnBed"} style={(props.hover === props.index) ? style:null}>
                <button type="submit"
                onClick={props.click}
                className={((props.hover === props.index)&&(props.currentClass)) ? props.serviceClass + " btn hover" : props.serviceClass + " btn"}>
                {props.serviceTitle}</button>
            </div>
    );
}
export default btn;
