import React, { useState } from 'react'
import NewCoring from './Input Components/NewCoring'
import EnhancementCoring from './Input Components/EnhancementCoring'
import RowContext from '../../context/row-context'
const Input = (props) => {
    let title = '';
    switch (props.idvalue) {
        case 'newCoring':
            title = "Алмазное бурение: новый проем";
            break;
        case 'enhancementCoring':
            title = "Алмазное бурение: расширение проема";
            break;
        case 'singleCoring':
            title = "Алмазное бурение: одиночные отверстия";
            break;
        case 'newSaw':
            title = "Алмазная резка: новый проем";
            break;
        case 'enhancementSaw':
            title = "Алмазная резка: расширение проема";
            break;
        case 'definedValueSaw':
            title = "Алмазная резка: по заданному объему";
            break;
        case 'newWire':
            title = "Канатная резка: новый проем";
            break;
        case 'definedWire':
            title = "Канатная резка: по заданному объему";
            break;
        case 'fullEnforcement':
            title = "Устройство металлоконструкций: усиление проема";
            break;
        case 'lightEnforcement':
            title = "Устройство металлоконструкций: обрамление проема";
            break;
    }
    console.log(title)
    const [rowState, setRowstate] = useState({
        title: title,
        width: 500,
        height: 500,
        depth: 250,
        diameter: 152
    });
    let inputData = {};
    const input = (id) => {
        switch (id){
            case 'newCoring':
                inputData=<NewCoring/>;
            break;
            case 'enhancementCoring':
                inputData=<EnhancementCoring/>;
            break;
            default: ;
        }
        return(inputData);
    }
    const mainClass = props.mode?"input":"input-mod";
    return(
        <div keyvalue={props.keyvalue} idvalue={props.idvalue} indexvalue={props.indexvalue} className={mainClass + " " + props.lastrow}>
            <RowContext.Provider value={{
                diameters:[42, 52, 62, 72, 82, 92, 102, 112, 122, 132, 142, 152, 162, 172, 182, 192, 200, 250, 300, 350],
                width: rowState.width,
                height: rowState.height,
                depth: rowState.depth,
                diameter: rowState.diameter,
                qty: props.qty,
                mode: props.mode,
                deleteButton: props.deleteButton,
                inputChangedHandler: (event) => {
                    const id = event.target.getAttribute('id');
                    let newRowState = {...rowState};
                    newRowState[id] = parseFloat(event.target.value);
                    setRowstate(newRowState);
                }
            }}>
                {input(props.idvalue)}
            </RowContext.Provider>
        </div>
    );

}

export default Input;