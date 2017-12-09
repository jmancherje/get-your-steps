import { combineReducers } from 'redux-immutable';

import location from './location';
import steps from './steps';
import directions from './directions';
import profile from './profile';

export default combineReducers({
  steps,
  location,
  directions,
  profile,
});
