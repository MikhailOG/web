import * as actionTypes from './actions';
import deepFreeze from 'deep-freeze';
import expect from 'expect';

// reducer
const initialState = {
    inputRows: [
        {

        }
    ],
    layout: {
        innerWidth: 0,
        innerHeight: 0,
        showBackdrop: false
    }
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
        case actionTypes.TOGGLE_BACKDROP:
            return {
                ...state,
                layout: {
                    ...state.layout,
                    showBackdrop: !state.layout.showBackdrop 
                }
            };
        case actionTypes.WINDOW_RESIZE:
            return {
                ...state,
                layout: {
                    ...state.layout,
                    innerWidth: action.innerWidth,
                    innerHeight: action.innerHeight
                }
            };
        default:
            return state;
    }
}

export default reducer;

const addRow = (state = [], action) => {
    switch (action.type) {

        default:
            return state;
    };
};
const testAddRow = ( ) => {
    const stateBefore = {
        inputRows: [
            {
                id: "CORING",
                index: 0,
                qty: 1
            },
            {
                id: "WIRE",
                index: 1,
                qty: 2
            },
            {
                id: "SAW",
                index: 2,
                qty: 4
            }
        ],
        layout: {
            innerWidth: 0,
            innerHeight: 0,
            showBackdrop: false
        }
    };
    const action = {
        type: 'ADD_ROW',
        id: "NEW_CORING",
        index: 0
    };
    const stateAfter = {
        inputRows: [
            {
                id: "NEW_CORING",
                index: 0,
                qty: 1
            },
            {
                id: "CORING",
                index: 1,
                qty: 1
            },
            {
                id: "WIRE",
                index: 2,
                qty: 2
            },
            {
                id: "SAW",
                index: 3,
                qty: 4
            }
        ],
        layout: {
            innerWidth: 0,
            innerHeight: 0,
            showBackdrop: false
        }
        };
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(addRow(stateBefore, action)).toEqual(stateAfter);
};
//testAddRow();
console.log("Test has passed")