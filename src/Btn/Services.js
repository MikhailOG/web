import React from 'react';

const services = (props) => {
    return ( 
                props.serviceClass ?
                    <div type="list"
                    className={props.serviceClass + " services"} >
                        {props.serviceList}
                    </div> : null
    );
}

export default services;