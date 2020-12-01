import * as actionTypes from './actionTypes';

export const inputChanged = (payload) => {
    return {
        type: actionTypes.INPUT_CHANGED,
        index: payload.index,
        id: payload.id,
        value: payload.value 
    };
};

export const preferencesChanged = (payload) => {
    return {
        type: actionTypes.PREFERENCES_CHANGED,
        index: payload.index,
        id: payload.id,
        value: payload.value 
    };
};