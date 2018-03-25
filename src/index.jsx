import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { Provider } from 'react-redux'

import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'


import rootReducer from './reducers'
import watcherSaga from './sagas'

const sagaMiddleware = createSagaMiddleware()

const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()//eslint-disable-line

const store = createStore(
  rootReducer,
  compose(applyMiddleware(sagaMiddleware), reduxDevTools),
)

sagaMiddleware.run(watcherSaga)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
)

registerServiceWorker()
