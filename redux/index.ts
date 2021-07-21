import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';




const middlewares = [thunk];

const applyMiddlewareUtil = applyMiddleware(...middlewares);

const initialState = {};

const store = createStore(
  rootReducer,
  initialState,
  applyMiddlewareUtil,
);


export default store;
