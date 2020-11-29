import * as actionTypes from '../actions/actions';
import deepFreeze from 'deep-freeze';
import expect from 'expect';

// reducer
const initialState = {
    inputRows: [],
}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_ROW: 
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
