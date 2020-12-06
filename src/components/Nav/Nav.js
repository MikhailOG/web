import React from 'react';
import { NavLink } from 'react-router-dom';

const nav = () => {
    return ( 
        <nav className="nav">
            <NavLink to='calculator'>
                <i className="fas fa-calculator"></i> Расчет онлайн
            </NavLink>
            <NavLink to='price'>
                <i className="fas fa-dollar-sign"></i> Прайс-лист
            </NavLink>
            <NavLink to='gallery'>
                <i className="far fa-images"></i> Фото работ
            </NavLink>
            <NavLink to='contacts'>
                <i className="far fa-address-card"></i> Контакты
            </NavLink>
        </nav>
    );
}

export default nav;