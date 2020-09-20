import React from 'react';
import logo from "../../images/logo.png"
import gear from "../../images/gear.svg"
const header = (props) => {
    return ( 
        <header>
        <div className= "header-cont">
          <figure>
            <img id="logo" src={logo} alt="logo"/>
            <img id="gear" src={gear} alt="logo"/>
          </figure>
          <div className="first-name">
            <h1>{props.title}</h1>
            <p>{props.titleText}</p>
          </div>
          <div className="telefone">
            <p><i className="fas fa-phone"></i> {props.telefone}<br/>Михаил</p>
          </div>
        </div>
      </header>
    );
}

export default header;