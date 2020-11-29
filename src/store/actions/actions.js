export const ADD_ROW = 'ADD_ROW';
export const TOGGLE_BACKDROP = 'TOGGLE_BACKDROP';
export const WINDOW_RESIZE = 'WINDOW_RESIZE';

export const addRow = (payload) => {
    return {
        type: ADD_ROW,
        serviceName: payload.serviceName, 
        index: payload.index
    };
};

export const toggleBackdrop = () => {
    return {
        type: TOGGLE_BACKDROP
    };
};

export const windowResize = () => {
    return {
        type: WINDOW_RESIZE,
        innerWidth: window.innerWidth, 
        innerHeight: window.innerHeight
    };
};

