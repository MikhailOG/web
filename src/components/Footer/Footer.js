import React from 'react';

const Footer = () => {

    return (
        <footer>
            <div className='footer'>
                <div className='footer-greeting'>
                    {/* <a href="mailto:info@diamondcoring.ru"><i className="far fa-envelope" area-hidden="true"></i>
                    <span className="sr-only">info@diamondcoring.ru</span>
                    </a> */}
                    <p>Всегда на связи, ждем Ваших звонков!</p>
                    <p>Надеемся Вам понравилось у нас на сайте...</p>
                </div>
                <p>Copyright 2021 <i className="far fa-gem" style={{fontSize: "1.25rem"}}></i> by Diamond Coring</p>
            </div>
        </footer>
    );
}

export default Footer