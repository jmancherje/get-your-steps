import { List, fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';

import actionTypes from '../actions/actionTypes';

const initialState = fromJS({
  hoursBack: 1,
  stepsSinceHour: 0,
  currentStepCount: 0,
  realtimeSteps: List(),
});

const steps = (state = initialState, { type, payload }) => {
  switch (type) {
  case actionTypes.steps.hoursBack.UPDATE:
    return state.set('hoursBack', payload);
  case actionTypes.steps.stepsSinceHour.UPDATE:
    return state.set('stepsSinceHour', payload);
  case actionTypes.steps.realtimeSteps.UPDATE:
    return state.set('realtimeSteps', List.isList(payload) ? payload : List(payload));
  case actionTypes.steps.isPedometerAvailable.UPDATE:
    return state.set('isPedometerAvailable', payload);
  default:
    return state;
  }
};

export default combineReducers({
  steps,
});
