import { createStore } from 'redux';
import reducer from './reducer';
// const createStore = (reducer) => {
//     let state;
//     let listeners = [];
//     const getState = () => state;
//     const dispatch = (action) => {
//         state = reducer(state, action);
//         listeners.forEach(listener => listener())
//     };
//     const subscribe = (listener) => {
//         listeners.push(listener);
//         return () => {
//             listeners = listeners.filter(l => l !== listener);
//         }
//     };
//     dispatch({});
//     return { getState, dispatch, subscribe };
// }
const store = createStore(reducer);
// console.log(store.getState());
store.dispatch({ type: 'INCREMENT' });
// console.log(store.getState());
// console.log('LOGGED')
const addCounter = (list) => {
    return [...list, 0];
};
const removeCounter = (list, index) => {
    return [
        ...list.slice(0, index),
        ...list.slice(index + 1)
    ];
};
const incrementCounter = (list, index) => {

    return [
        ...list.slice(0, index),
        list[index] + 1,
        ...list.slice(index + 1)
    ];
};
const toggleTodo = (todo) => {
    return Object.assign({}, todo, {
        completed: !todo.completed
    })
};
const testToggleTodo = () => {
    const todoBefore = {
        id: 0,
        text: 'Redux sux',
        completed: false
    };
    const todoAfter = {
        id: 0,
        text: 'Redux sux',
        completed: true
    };
    deepFreeze(todoBefore);
    expect(
        toggleTodo(todoBefore)).toEqual(todoAfter);
};

testToggleTodo();
console.log('All test passed.')
// const render = () => {
//     document.body.innerText=store.getState();
// }
// store.subscribe(render);
// render();

// import { createSlice, configureStore } from '@reduxjs/toolkit'

// const counterSlice = createSlice({
//   name: 'counter',
//   initialState: {
//     value: 0
//   },
//   reducers: {
//     incremented: state => {
//       state.value += 1
//     },
//     decremented: state => {
//       state.value -= 1
//     }
//   }
// })

// export const { incremented, decremented } = counterSlice.actions

// const store = configureStore({
//   reducer: counterSlice.reducer
// })

// store.subscribe(() => console.log(store.getState()))

// store.dispatch({ type: 'counter/incremented' })
// // {value: 1}
// store.dispatch({ type: 'counter/incremented' })
// // {value: 2}
// store.dispatch({ type: 'counter/decremented' })
// // {value: 1}

export default store