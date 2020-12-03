import * as actionTypes from './actionTypes';

export const getJobInfo = (payload) => {
    return {
        type: actionTypes.GET_JOB_INFO,
        job: payload
    };
};
export const clearJobInfoSync = () => {
    return {
        type: actionTypes.CLEAR_JOB_INFO
    };
};
export const clearJobInfo = () => {
    return dispatch => {
        setTimeout(() => {
            dispatch(clearJobInfoSync());
        }, 500); 
    }
};