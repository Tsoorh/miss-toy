import {compose,combineReducers, legacy_createStore as createStore} from 'redux';

import {toyReducer} from "./reducers/toys.reducers"

const rootReducer= combineReducers({
    toyModule:toyReducer,
})

const composeEnhacers = window.__REDUX_DEVTOOLS_EXTENTION_COMPOSE__ || compose;
export const store = createStore(rootReducer,composeEnhacers())

window.gStore = store
store.subscribe(()=>{
    
})
