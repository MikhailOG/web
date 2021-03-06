import React from 'react';

const Grip = (props) => {
    let arrowClass = [props.direction, 'arrow'].join('-');
    return (
        <div
        className = {arrowClass}>
            <i 
                style={props.style} 
                class={`fas fa-angle-${props.direction}`}
                onClick={props.clicked}></i>
        </div>
    );
}

export default Grip