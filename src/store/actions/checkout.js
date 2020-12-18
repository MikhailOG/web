import React from 'react';
import * as actionTypes from './actionTypes';

export const getJobInfo = (payload) => {
    let jobData;
    const jobType = payload.preferences.job==='wall'?'в стене':'в перекрытии';
    let showCanvas = true;
    switch (payload.serviceName){
        case 'newCoring':
            jobData = (
            <div className='job-description'>
                <p>{payload.title + ' ' + jobType}</p>
                <p>{'Размер проема: ' + payload.data.width + ' x ' + payload.data.height + ' x ' + payload.data.depth + ' мм.  Количество: ' + payload.data.qty + ' шт.'}</p>
            </div>);
            break;
        case 'enhancementCoring':
            let enhancementSides = [];
            let sidesCounter = 0;
            if (payload.data.enhancementTop != 0) {
                enhancementSides.push('сверху на ', payload.data.enhancementTop, ' мм');
                sidesCounter ++;
            }
            if (payload.data.enhancementBottom != 0) {
                if (sidesCounter > 0)
                    enhancementSides.push(', ');
                enhancementSides.push('снизу на ', payload.data.enhancementBottom, ' мм');
                sidesCounter ++;
            }
            if (payload.data.enhancementLeft != 0) {
                if (sidesCounter > 0)
                    enhancementSides.push(', ');
                enhancementSides.push('слева на ', payload.data.enhancementLeft, ' мм');
                sidesCounter ++;
            }
            if (payload.data.enhancementRight != 0) {
                if (sidesCounter > 0)
                    enhancementSides.push(', ');
                enhancementSides.push('справа на ', payload.data.enhancementRight, ' мм');
                sidesCounter ++;
            }
            if (sidesCounter > 0)
            enhancementSides.push('.');
            if (enhancementSides.length > 0) {
                const enhancements = enhancementSides.join('');
                jobData = (
                    <div className='job-description'>
                        <p>{payload.title + ' ' + jobType}</p>
                        <p>{'Расширение проема: ' + payload.data.width + ' x ' + payload.data.height + ' x ' + payload.data.depth + ' мм ' + enhancements + ' Количество: ' + payload.data.qty + ' шт.'}</p>
                    </div>);
            }
            else {
                jobData = (
                    <div className='job-description'>
                        <p>Нужно указать на сколько расширить проем...</p>
                        <p>Вернитесь в меню расчета и введите данные хотя бы для одной из сторон</p>
                    </div>);
                showCanvas = false;
            }                
            break;
    }
    return {
        type: actionTypes.GET_JOB_INFO,
        job: payload,
        jobData: jobData,
        showCanvas: showCanvas
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