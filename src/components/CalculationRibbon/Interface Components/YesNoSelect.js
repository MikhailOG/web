import React, { useContext } from 'react'
import RowContext from '../../../context/row-context'
const YesNoSelect = (props) => {
    const rowContext = useContext(RowContext);
    const selected = "fas fa-check-circle";
    const unselected = "far fa-circle";
    return(
        <div className={"check-"+props.id}>
            <p>{props.children}</p>
            <div className={props.id}>
                {props.answers.map((answer, index) => <div onClick={(event) => rowContext.yesNoSelectChangedHandler(event, index)} id={answer[0]} key={answer[0]}>
                <i className={answer[0] + " " + ((props.selectedIndex===index)?selected:unselected)}>
                    <p>
                        {answer[1]}
                    </p>
                </i>
                </div>)}   
            </div>
        </div>
    );
} 

export default YesNoSelect;


