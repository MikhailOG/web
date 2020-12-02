import * as actionTypes from './actionTypes';

export const JobInfo = (payload) => {
    return {
        type: actionTypes.GET_JOB_INFO,
        index: payload.index
    };
};
