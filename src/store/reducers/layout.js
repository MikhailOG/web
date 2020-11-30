import * as actionTypes from '../actions/actionTypes';
import deepFreeze from 'deep-freeze';
import expect from 'expect';

// reducer
const initialState = {
// 
        innerWidth: 0,
        innerHeight: 0,
        showBackdrop: false

}
const reducer = (state = initialState, action) => {
    switch (action.type) {
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
                    innerWidth: action.innerWidth,
                    innerHeight: action.innerHeight
            };
        default:
            return state;
    }
}

export default reducer;

