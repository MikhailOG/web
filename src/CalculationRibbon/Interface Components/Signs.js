import React from 'react'

const signs = (props) => {
    return(
        <div className="signs">
            <p>
                <i className="far fa-plus-square" onClick={props.plus}></i>
                <i className="fas fa-caret-right"></i>
            </p>
        </div>
    );

}

export default signs;