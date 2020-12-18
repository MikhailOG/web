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
        const globalPreferences = {
            material: "reinforced-concrete",
            job: "wall",
            waste: ["waste-off", 0],
            elevation: ["elevation-under-limit", 1],
            water: ["water-off", 1],
            wasteWeight: 100,
            concreteWeight: 2400
        };
        let title = '';
        let data = {};
        switch (action.serviceName) {
            case 'newCoring':
                title = "Алмазное бурение: новый проем";
                data = {
                    qty: 1,
                    width: 500,
                    height: 500,
                    depth: 250,
                    diameter: 152
                };
                break;
            case 'enhancementCoring':
                title = "Алмазное бурение: расширение проема";
                data = {
                    qty: 1,
                    width: 500,
                    height: 500,
                    depth: 250,
                    diameter: 152,
                    enhancementTop: 250,
                    enhancementBottom: 0,
                    enhancementLeft: 0,
                    enhancementRight: 0
                };
                break;
            // case 'singleCoring':
            //     title = "Алмазное бурение: одиночные отверстия";
            //     break;
            // case 'newSaw':
            //     title = "Алмазная резка: новый проем";
            //     break;
            // case 'enhancementSaw':
            //     title = "Алмазная резка: расширение проема";
            //     break;
            // case 'definedValueSaw':
            //     title = "Алмазная резка: по заданному объему";
            //     break;
            // case 'newWire':
            //     title = "Канатная резка: новый проем";
            //     break;
            // case 'definedWire':
            //     title = "Канатная резка: по заданному объему";
            //     break;
            // case 'fullEnforcement':
            //     title = "Устройство металлоконструкций: усиление проема";
            //     break;
            // case 'lightEnforcement':
            //     title = "Устройство металлоконструкций: обрамление проема";
            //     break;
            default: 
                data = {
                    qty: 1,
                    width: 500,
                    height: 300,
                    depth: 250,
                    diameter: 152
                };
        }
            return {
                ...state,
                inputRows: 
                    [   ...state.inputRows.slice(0, action.index),
                        {
                            key: Math.floor(1000000000000*Math.random()*Math.floor(Math.sqrt(Math.random()/Math.random()*100000000))),
                            serviceName: action.serviceName,
                            index: action.index,
                            title: title,
                            data: {...data},
                            preferences: {...globalPreferences}
                        },
                        ...state.inputRows.slice(action.index)
                        .map(row =>  Object.assign({}, row, {index: row.index + 1}))
                    ]
            };
            case actionTypes.DELETE_ROW: 
                return {
                    ...state,
                    inputRows: 
                        [   ...state.inputRows.slice(0, action.index),
                            ...state.inputRows.slice(action.index + 1)
                            .map(row =>  Object.assign({}, row, {index: row.index - 1}))
                        ]
                };
        case actionTypes.INPUT_CHANGED:
            return {
                ...state,
                inputRows: 
                    [   ...state.inputRows.slice(0, action.index),
                        {   
                            ...state.inputRows[action.index],
                            data: {
                                ...state.inputRows[action.index].data,
                                [action.id]: action.value
                            },
                        },
                        ...state.inputRows.slice(action.index+1)
                    ]
            };
        case actionTypes.PREFERENCES_CHANGED:
            return {
                ...state,
                inputRows: 
                    [   ...state.inputRows.slice(0, action.index),
                        {   
                            ...state.inputRows[action.index],
                            preferences: {
                                ...state.inputRows[action.index].preferences,
                                [action.id]: action.value
                            },
                        },
                        ...state.inputRows.slice(action.index+1)
                    ]
            };
        default:
            return state;
    }
}

export default reducer;
