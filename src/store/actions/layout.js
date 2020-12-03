import * as actionTypes from './actionTypes';

export const toggleBackdrop = () => {
    return {
        type: actionTypes.TOGGLE_BACKDROP
    };
};
export const toggleBackdropAsync = () => {
    return dispatch => {
        setTimeout(() => {
            dispatch(toggleBackdrop());
        }, 500); 
    }
};

export const windowResize = () => {
    return {
        type: actionTypes.WINDOW_RESIZE,
        innerWidth: window.innerWidth, 
        innerHeight: window.innerHeight
    };
};