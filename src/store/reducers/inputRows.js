import * as actionTypes from '../actions/actionTypes';
import deepFreeze from 'deep-freeze';
import expect from 'expect';

// reducer
const initialState = {
    inputRows: [],
}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_ROW: 
        let title = '';
        switch (action.serviceName) {
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
            return {
                ...state,
                inputRows: 
                    [   ...state.inputRows.slice(0, action.index),
                        {
                            key: Math.floor(1000000000000*Math.random()*Math.floor(Math.sqrt(Math.random()/Math.random()*100000000))),
                            serviceName: action.serviceName,
                            index: action.index,
                            mode: true,
                            deleteButton: false,
                            title: title,
                            qty: 1
                        },
                        ...state.inputRows.slice(action.index)
                        .map(row =>  Object.assign({}, row, {index: row.index + 1}))
                    ]
            };
        default:
            return state;
    }
}

export default reducer;
