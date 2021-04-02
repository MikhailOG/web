import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';

const Nav = (props) => {
    return ( 
        <nav className="nav">
            <NavLink onClick = {() => {if (!props.spin) props.onSpined()}} to='calculator'>
                <i className="fas fa-calculator"></i> Расчет онлайн
            </NavLink>
            <NavLink onClick = {() => {if (!props.spin) props.onSpined()}} to='price'>
                <i className="fas fa-dollar-sign"></i> Прайс-лист
            </NavLink>
            <NavLink onClick = {() => {if (!props.spin) props.onSpined()}} to='gallery'>
                <i className="far fa-images"></i> Фото работ
            </NavLink>
            <NavLink onClick = {() => {if (!props.spin) props.onSpined()}} to='contacts'>
                <i className="far fa-address-card"></i> Контакты
            </NavLink>
        </nav>
    );
}

const mapStateToProps = state => {
    return {
        spin: state.layout.gearSpin,
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
        onSpined: () => dispatch(actionCreators.gearSpin())
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(Nav);