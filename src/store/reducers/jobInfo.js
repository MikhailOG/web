
import * as actionTypes from '../actions/actionTypes';
import deepFreeze from 'deep-freeze';
import expect from 'expect';

// reducer
const initialState = {
    jobInfo: {showJobInfo: false}
}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_JOB_INFO: 
            return {
                ...state,
                jobInfo: {
                    ...action.job,
                    jobData: action.jobData,
                    showJobInfo: true,
                    showCanvas: action.showCanvas
                }
            };
        case actionTypes.CLEAR_JOB_INFO: 
            return {
                ...state,
                jobInfo: {
                    showJobInfo: false
                }
            };
        //     case actionTypes.DELETE_ROW: 
        //         return {
        //             ...state,
        //             inputRows: 
        //                 [   ...state.inputRows.slice(0, action.index),
        //                     ...state.inputRows.slice(action.index + 1)
        //                     .map(row =>  Object.assign({}, row, {index: row.index - 1}))
        //                 ]
        //         };
        // case actionTypes.INPUT_CHANGED:
        //     return {
        //         ...state,
        //         inputRows: 
        //             [   ...state.inputRows.slice(0, action.index),
        //                 {   
        //                     ...state.inputRows[action.index],
        //                     data: {
        //                         ...state.inputRows[action.index].data,
        //                         [action.id]: action.value
        //                     },
        //                 },
        //                 ...state.inputRows.slice(action.index+1)
        //             ]
        //     };
        // case actionTypes.PREFERENCES_CHANGED:
        //     return {
        //         ...state,
        //         inputRows: 
        //             [   ...state.inputRows.slice(0, action.index),
        //                 {   
        //                     ...state.inputRows[action.index],
        //                     preferences: {
        //                         ...state.inputRows[action.index].preferences,
        //                         [action.id]: action.value
        //                     },
        //                 },
        //                 ...state.inputRows.slice(action.index+1)
        //             ]
        //     };
        default:
            return state;
    }
}

export default reducer;
