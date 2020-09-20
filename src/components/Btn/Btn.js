import React from 'react';

const btn = (props) => {
    console.log('[btn.js] is rendering...')
    const clickedStyle = {
        background: "#E3D7FF",
        border: '3px solid #f3fffd',
        borderBottom: 'none'
    }
    const style = {
        border: '3px solid #B9D6F2',
    }
    const noOutLine = {
        outline: "none"
    }
    return ( <div type="bed" className={props.serviceClass + " btnBed"} style={((props.hover === props.index) && (props.clicked)) ? clickedStyle:style}>
                <button type="submit"
                style={noOutLine}
                onClick={props.click}
                className={((props.hover === props.index)&&(props.currentClass)) ? (props.clicked ? props.serviceClass + " btn hover clicked":props.serviceClass + " btn hover") : props.serviceClass + " btn"}>
                {props.serviceTitle[0]} <br/> {props.serviceTitle[1]}</button>
            </div>
    );
}
export default btn;
