import React from 'react'
import NewCoring from './Input Components/NewCoring'
import EnhancementCoring from './Input Components/EnhancementCoring'
const Input = (props) => {
    let inputData = {};
    const input = (id) => {
        switch (id){
            case 'newCoring':
                inputData=<NewCoring/>;
            break;
            case 'enhancementCoring':
                inputData=<EnhancementCoring/>;
            break;
        }
        return(inputData);
    }
    return(
        <div className="input">
            {input(props.id)}

        </div>
    );

}

export default React.memo(Input);