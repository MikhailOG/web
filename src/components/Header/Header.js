import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../../images/logo.png";
import gear from "../../images/gear.svg";

const header = (props) => {
    return ( 
        <header>
        <div className= "header-cont">
          <Link to='/'>
            <figure>
                <img id="logo" src={logo} alt="logo"/>
                <img id="gear" src={gear} alt="logo"/>
              </figure>
          </Link>
          <div className="first-name">
            <h1>{props.title}</h1>
            <p>{props.titleText}</p>
          </div>
          <div className="contacts">
            <p><i className="fas fa-phone"></i> {props.telefone}</p>
            <p><a href="mailto:info@diamondcoring.ru"><i className="far fa-envelope"></i></a> {props.email}</p>
          </div>
        </div>
      </header>
    );
}

export default header;