import { configureStore } from "@reduxjs/toolkit";
import reducer from './reducers/rootReducer'
import thunk from 'redux-thunk';

const store = configureStore({
    reducer: reducer,
    middleware: [thunk]
});

export default store;
