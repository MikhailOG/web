import React from 'react';

const Backdrop = (props) => {
    return (
        props.showBackdrop?<div 
        className='backdrop'
        >{props.children}</div>:null
    );
}
export default Backdrop;