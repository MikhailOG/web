import React from 'react';

const nav = () => {
    return ( 
        <nav className="nav">
            <a href="calculator"><i className="fas fa-calculator"></i> Расчет онлайн</a>
            <a href="price"><i className="fas fa-dollar-sign"></i> Прайс-лист</a>
            <a href="gallery"><i className="far fa-images"></i> Фото работ</a>
            <a href="contacts"><i className="far fa-address-card"></i> Контакты</a>
        </nav>
    );
}

export default nav;