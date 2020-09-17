import React from 'react'
import NewCoring from './Input Components/NewCoring'
import EnhancementCoring from './Input Components/EnhancementCoring'
const Input = (props) => {
    let inputData = {};
    const input = (id) => {
        switch (id){
            case 'newCoring':
                inputData=<NewCoring plus={props.plus}/>;
            break;
            case 'enhancementCoring':
                inputData=<EnhancementCoring plus={props.plus}/>;
            break;
            default: ;
        }
        return(inputData);
    }
    return(
        <div idvalue={props.idvalue} indexvalue={props.indexvalue} className="input">
            {input(props.idvalue)}
        </div>
    );

}

export default Input;