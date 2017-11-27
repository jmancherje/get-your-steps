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
AsyncStorage.getItem('savedRoutes')
  .then((results, err) => {
    if (err) {
      console.log('error', err); // eslint-disable-line
      throw err;
    }
    console.log('results', results);
    if (results) {
      store.dispatch({
        type: actionTypes.directions.INITIALIZE,
        payload: results,
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
