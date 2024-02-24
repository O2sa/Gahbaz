import { useDispatch, useSelector } from 'react-redux'
import { getCollagesReducer } from './CollageManagementSlice.mjs'
import store from './store.mjs'



// Create a store with middleware (if applicable)
// const store = createStore(rootReducer, applyMiddleware(thunk));

// Dispatch an action
store.dispatch(getCollagesReducer());

// Use useSelector to access the state
const state = store.getState();
console.log(state);

// // Use useDispatch to dispatch actions
// const dispatch = useDispatch();
// dispatch({ type: 'ANOTHER_ACTION_TYPE', payload: 'another payload' });

// // Access state again to see the changes
// const updatedState = store.getState();
// console.log(updatedState);