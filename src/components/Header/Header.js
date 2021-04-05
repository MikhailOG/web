import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import logo from "../../images/logo.png";
import gear from "../../images/gear.svg";

const Header = (props) => {
  const [gearConf, setGearConf] = useState({
    style: {
      animationPlayState: 'running',
      animationTimingFunction: 'ease-out',
      animationFillMode: 'forwards'
    }
  });
  useEffect(() => {
    // console.log('header rendered...')
    // console.log(props)
    if (gearConf.style.animationPlayState == 'running') {
      setTimeout(() => {
        setGearConf({...gearConf, style: {...gearConf.style, animationPlayState: 'paused'}});
        if (props.spin)
          props.onSpined();
      }, 1500);
    }
  },[]);
  useEffect(() => {
    if (props.spin & gearConf.style.animationPlayState == 'paused') {
      setGearConf({...gearConf, style: {...gearConf.style, animationPlayState: 'running', animationTimingFunction: 'linear'}});
      setTimeout(() => {
        props.onSpined();
        setGearConf({style: {...gearConf.style, animationPlayState: 'paused'}});
      }, 500);
    }
  },[props.spin]);
    return ( 
        <header>
        <div className= "header-cont">
          <Link onClick = {() => {if (!props.spin) props.onSpined();}} to='/'>
            <figure>
                <img id="logo" src={logo} alt="logo"/>
                <img id="gear" style={gearConf.style} src={gear} alt="logo"/>
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
const mapStateToProps = state => {
  return {
      spin: state.layout.gearSpin
  };
};

const mapDispatchToProps = dispatch => {
  return {
      onSpined: () => dispatch(actionCreators.gearSpin())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);