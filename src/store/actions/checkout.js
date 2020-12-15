import React from 'react';
import * as actionTypes from './actionTypes';

export const getJobInfo = (payload) => {
    let jobData;
    switch (payload.serviceName){
        case 'newCoring':
            const jobType = payload.preferences.job==='wall'?'в стене':'в перекрытии'
            jobData = (
            <div className='job-description'>
                <p>{payload.title + ' ' + jobType}</p>
                <p>{'Размер проема: ' + payload.data.width + ' x ' + payload.data.height + ' x ' + payload.data.depth + ' мм.  Количество: ' + payload.data.qty + ' шт.'}</p>
            </div>);
    }
    return {
        type: actionTypes.GET_JOB_INFO,
        job: payload,
        jobData: jobData
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