import { combineReducers } from 'redux-immutable';

import location from './location';
import steps from './steps';

export default combineReducers({
  steps,
  location,
});
