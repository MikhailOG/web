import * as actionTypes from './actionTypes';

export const getJobInfo = (payload) => {
    return {
        type: actionTypes.GET_JOB_INFO,
        job: payload
    };
};
export const clearJobInfo = () => {
    return {
        type: actionTypes.CLEAR_JOB_INFO,
    };
};