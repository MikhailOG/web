import * as actionTypes from './actionTypes';

export const addRow = (payload) => {
    return {
        type: actionTypes.ADD_ROW,
        serviceName: payload.serviceName, 
        index: payload.index
    };
};