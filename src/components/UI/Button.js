import React from 'react';

const Button = (props) => {
    return (
        <button
        onClick={props.clicked}
        className={props.classes}>
            {props.children}
        </button>
    );
}
export default Button;