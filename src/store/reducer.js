

// reducer
const initialState = {
    input: [
        {

        }
    ],
    layout: {
        innerWidth: 0,
        innerHeight: 0,
        showBackdrop: false
    }
}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'TOGGLE_BACKDROP':
            return {
                ...state,
                layout: {
                    ...state.layout,
                    showBackdrop: !state.layout.showBackdrop 
                }
            };
        case 'WINDOW_RESIZE' :
            return {
                ...state,
                layout: {
                    ...state.layout,
                    innerWidth: action.innerWidth,
                    innerHeight: action.innerHeight
                }
            };
            // fake
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
}

export default reducer;

const toggleBackdrop = (state = [], action) => {
    switch (action.type) {
        case 'WINDOW_RESIZE':
            return {
                ...state,
                layout: {
                    ...state.layout,
                    innerWidth: action.innerWidth,
                    innerHeight: action.innerHeight
                }
            };
        default:
            return state;
    };
};
const testToggleBackdrop = ( ) => {
    const stateBefore = {
        input: [
            {
    
            }
        ],
        layout: {
            innerWidth: 0,
            innerHeight: 0,
            showBackdrop: false
        }
    };
    const action = {
        type: 'WINDOW_RESIZE',
        innerWidth: 500,
        innerHeight: 900
    };
    const stateAfter = {
        input: [
            {
    
            }
        ],
        layout: {
            innerWidth: 500,
            innerHeight: 900,
            showBackdrop: false
        }
        };
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(toggleBackdrop(stateBefore, action)).toEqual(stateAfter);
};
testToggleBackdrop();
console.log("Test has passed")