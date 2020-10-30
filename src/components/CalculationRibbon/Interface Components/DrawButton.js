import React, {useContext} from 'react'
import RowContext from '../../../context/row-context'
import InputContext from '../../../context/input-context'
const DrawButton = () => {
    const rowContext = useContext(RowContext);
    const inputContext = useContext(InputContext);
    const style = {flexGrow: "1", alignSelf: "center", display: "flex", justifyContent: "flex-end", fontSize: "2rem", marginRight: "3rem"};
    const marginRight = {marginRight: "2rem"};
    const buttonType = rowContext.mode?rowContext.deleteButton?(        
        <div className="buttons">
            <button onClick={inputContext.deleteRowHandler} className="button" type="button">Удалить строку</button>
        </div>):(        
        <div className="buttons">
            <button className="button" type="button">Нарисовать схему</button>
        </div>):(
        <p style={style}>
            {(inputContext.rowsQty > 1)?<i onClick={inputContext.deleteRowHandler} style={marginRight} className="fas fa-trash-alt"></i>:null}
            <i className="button fas fa-pencil-ruler"></i>
        </p>);
    return(
        buttonType
    );

}

export default DrawButton;

