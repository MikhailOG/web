import React from 'react';
import Header from '../components/Header/Header';
import Nav from '../components/Nav/Nav';
const layout = (props) => {
    return(
        <div className="web">
        <div className="grid-container">
            <Header title="Тепловые Линии Мск" titleText="Алмазная резка и алмазное бурение" telefone="+7 (926) 932 68 40"/>
            <Nav/>
        </div>
        <div className="main-container">
            {props.children}
        </div>
      </div>
    );
}
export default layout;