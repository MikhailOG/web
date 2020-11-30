import * as actionTypes from './actionTypes';

export const toggleBackdrop = () => {
    return {
        type: actionTypes.TOGGLE_BACKDROP
    };
};

export const windowResize = () => {
    return {
        type: actionTypes.WINDOW_RESIZE,
        innerWidth: window.innerWidth, 
        innerHeight: window.innerHeight
    };
};