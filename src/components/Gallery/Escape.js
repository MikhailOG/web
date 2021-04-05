import React from 'react';

const Escape = (props) => {
    return (
        <div
        className = 'escape'>
            <i 
                className={`fas fa-times`}
                onClick={props.clicked}></i>
        </div>
    );
}

export default Escape