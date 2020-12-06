import React, { useState, useEffect } from 'react';

const Button = (props) => {
    const [buttonState, setButtonState] = useState({
        styles: {},
    });
      let styles = {...props.style}
      Object.keys(styles).map((key) => styles[key] = styles[key] + "px")
      useEffect(() =>{
        if (props.escaped){
            let newStyles = {...buttonState.styles};
            Object.assign(newStyles, {display: 'none'});
            setTimeout(() => setButtonState({styles: newStyles}), 200)
            
        }
      }, [props.escaped]);

    return (
        <button
        onClick={props.clicked}
        style={{...buttonState.styles, ...styles}}
        className={props.classes}>
            {props.children}
        </button>
    );
}
export default Button;