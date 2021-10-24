import React from 'react';

const Backdrop = (props) => {
    return (
        props.showBackdrop?<div 
        className='backdrop'
        onClick={!props.showJobInfo?props.onBackdropClicked:null}
        >{props.children}</div>:null
    );
}
export default Backdrop;