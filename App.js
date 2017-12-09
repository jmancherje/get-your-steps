import React from 'react';
import { AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';

import Reducer from './src/reducers';
import TabNav from './src/components/TabNav';
import actionTypes from './src/actions/actionTypes';

// Store configuration
const store = createStore(Reducer, composeWithDevTools(
  applyMiddleware(thunk),
));

// Get saved routes from AsyncStorage:
AsyncStorage.multiGet(['savedRoutes', 'stepGoal'], (errors, results) => {
  if (errors) {
    throw errors[0];
  }
  if (results[0][1]) {
    store.dispatch({
      type: actionTypes.directions.INITIALIZE,
      payload: results[0][1],
    });
  }
  if (results[1][1]) {
    store.dispatch({
      type: actionTypes.profile.stepGoal.INITIALIZE,
      payload: results[1][1],
    });
  }
});

// eslint-disable-next-line react/no-multi-comp
export default class App extends React.Component {
  render() {
    return (
      <Provider store={ store }>
        <TabNav />
      </Provider>
    );
  }
}
