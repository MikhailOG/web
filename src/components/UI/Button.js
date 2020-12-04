import React from 'react';

const Button = (props) => {
    const styles = {...props.style}
    Object.keys(styles).map((key, index) => styles[key] = styles[key] + "px")
    props.escaped?Object.assign(styles, {display: 'none'}):null;
    return (
        <button
        onClick={props.clicked}
        style={styles}
        className={props.classes}>
            {props.children}
        </button>
    );
}
export default Button;