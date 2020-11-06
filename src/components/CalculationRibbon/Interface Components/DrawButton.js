import React, {useContext, useState} from 'react'
import RowContext from '../../../context/row-context'
import InputContext from '../../../context/input-context'
import LayoutContext from '../../../context/layout-context'
const DrawButton = () => {
    const rowContext = useContext(RowContext);
    const inputContext = useContext(InputContext);
    const layoutContext = useContext(LayoutContext);
    const style = {flexGrow: "1", alignSelf: "center", display: "flex", justifyContent: "flex-end", fontSize: "2rem", marginRight: "3rem"};
    const marginRight = {marginRight: "2rem"};
    let buttonType;
    switch (rowContext.mode) {
        case true: 
            switch (rowContext.deleteButton) {
                case true:
                    if (layoutContext.windowWidth > 1000) 
                    buttonType = (        
                        <div className="buttons">
                            <button onClick={inputContext.deleteRowHandler} className="button" type="button">Удалить строку</button>
                        </div>)
                    else 
                        buttonType = (
                            <p style={style}>
                                {(inputContext.rowsQty > 1)?<i onClick={inputContext.deleteRowHandler} style={marginRight} className="fas fa-trash-alt"></i>:null}
                            </p>)
                break;
                case false: 
                    if (layoutContext.windowWidth > 1000) 
                        buttonType = (        
                        <div className="buttons">
                            <button className="button" type="button">Нарисовать схему</button>
                        </div>);
                    else 
                        buttonType = (
                            <p style={style}>
                                <i className="button fas fa-pencil-ruler"></i>
                            </p>)
                break;
                default: break;
            }
        break;
        case false: 
            buttonType = (
                <p style={style}>
                    {(inputContext.rowsQty > 1)?<i onClick={inputContext.deleteRowHandler} style={marginRight} className="fas fa-trash-alt"></i>:null}
                    <i className="button fas fa-pencil-ruler"></i>
                </p>)
        
    }
    return(
        buttonType
    );

}

export default DrawButton;

