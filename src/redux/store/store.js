import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../root-reducer/root-reducer';

const middlewares = [thunk];

const store = createStore(
      rootReducer,
      compose(
            applyMiddleware(...middlewares),
            window.devToolsExtension ? window.devToolsExtension() : f => f
      )
)

export default store;