import React from 'react';
import { AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import { Asset, AppLoading } from 'expo';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';
import { get } from 'lodash';

import Reducer from './src/reducers';
import TabNav from './src/components/TabNav';
import actionTypes from './src/actions/actionTypes';

// Store configuration
const store = createStore(Reducer, composeWithDevTools(
  applyMiddleware(thunk),
));

// Get saved routes from AsyncStorage:
AsyncStorage.multiGet(['savedRoutes', 'stepGoal', 'height'], (errors, results) => {
  if (errors) {
    throw errors[0];
  }
  const directions = get(results, [0, 1]);
  const stepGoal = get(results, [1, 1]);
  const height = get(results, [2, 1]);
  if (directions) {
    store.dispatch({
      type: actionTypes.directions.INITIALIZE,
      payload: directions,
    });
  }
  if (stepGoal) {
    store.dispatch({
      type: actionTypes.profile.stepGoal.INITIALIZE,
      payload: stepGoal,
    });
  }
  if (height) {
    store.dispatch({
      type: actionTypes.profile.height.INITIALIZE,
      payload: height,
    });
  }
});

// eslint-disable-next-line react/no-multi-comp
export default class App extends React.Component {
  state = { isReady: false };
  setIsReady = () => { this.setState({ isReady: true }); }

  // TODO: move AsyncStorage getter in here
  async _cacheResourcesAsync() {
    const images = [
      require('./assets/airysplash.png'), // eslint-disable-line
    ];

    const cacheImages = images.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });
    return Promise.all(cacheImages);
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={ this._cacheResourcesAsync }
          onFinish={ this.setIsReady }
          onError={ console.warn }
        />
      );
    }

    return (
      <Provider store={ store }>
        <TabNav />
      </Provider>
    );
  }
}
