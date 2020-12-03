import React, {useContext} from 'react';
import RowContext from '../../../context/row-context';
import LayoutContext from '../../../context/layout-context';

const DrawButton = () => {
    const rowContext = useContext(RowContext);
    const layoutContext = useContext(LayoutContext);
    const style = {flexGrow: "1", alignSelf: "center", display: "flex", justifyContent: "flex-end", fontSize: "2rem", marginRight: "3rem"};
    const marginRight = {marginRight: "2rem"};
    const marginLeft = {marginLeft: "2rem"};
    let buttonType;
    switch (rowContext.mode) {
        case true: 
            switch (rowContext.deleteButton) {
                case true:
                    if (layoutContext.windowWidth > 1070) 
                        buttonType = (        
                            <div className="buttons">
                                <button onClick={rowContext.deleteRowHandler} className="button" type="button">Удалить строку</button>
                            </div>);
                    else 
                        buttonType = (
                            <p style={style}>
                                <i onClick={rowContext.deleteRowHandler} style={marginLeft} className="classic-hover fas fa-trash-alt"></i>
                            </p>);
                break;
                case false: 
                    if (layoutContext.windowWidth > 1070) 
                        buttonType = (        
                        <div className="buttons">
                            <button onClick={rowContext.drawButtonClickedHandler} className="button" type="button">Нарисовать схему</button>
                        </div>);
                    else 
                        buttonType = (
                            <p style={style}>
                                <i onClick={rowContext.drawButtonClickedHandler} style={marginLeft} className="classic-hover fas fa-pencil-ruler"></i>
                            </p>)
                break;
                default: break;
            }
        break;
        case false: 
            buttonType = (
                <p style={style}>
                    {rowContext.deleteButton?<i onClick={rowContext.deleteRowHandler} style={marginRight} className="fas fa-trash-alt"></i>:null}
                    <i onClick={rowContext.drawButtonClickedHandler} className="button fas fa-pencil-ruler"></i>
                </p>)
    }
    console.log("inner width: " + layoutContext.windowWidth)
    return(
        buttonType
    );

}

export default DrawButton;

