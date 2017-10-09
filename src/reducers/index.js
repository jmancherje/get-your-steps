import { List, Map, fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import moment from 'moment';

import actionTypes from '../actions/actionTypes';

const updateHistoricData = (state, { startDate, endDate, steps }) => {
  const formattedPayload = Map({ startDate, endDate, steps });
  return state.updateIn(
    ['historicData', moment(startDate).format('L')], List(),
    (list) => list.set(startDate.getHours(), formattedPayload)
  );
};

const initialStepsState = fromJS({
  hoursBack: 1,
  stepsSinceHour: 0,
  currentStepCount: 0,
  realtimeSteps: List(),
  historicData: Map(),
});

const steps = (state = initialStepsState, { type, payload }) => {
  switch (type) {
  case actionTypes.steps.hoursBack.UPDATE:
    return state.set('hoursBack', payload);
  case actionTypes.steps.stepsSinceHour.UPDATE:
    return state.set('stepsSinceHour', payload);
  case actionTypes.steps.realtimeSteps.UPDATE:
    return state.set('realtimeSteps', List.isList(payload) ? payload : List(payload));
  case actionTypes.steps.isPedometerAvailable.UPDATE:
    return state.set('isPedometerAvailable', payload);
  case actionTypes.steps.historicData.SET:
    return updateHistoricData(state, payload);
  default:
    return state;
  }
};

const initialLocationState = Map({
  locationData: Map(),
  errorMessage: '',
});

const location = (state = initialLocationState, { type, payload }) => {
  switch (type) {
  case actionTypes.location.locationData.UPDATE:
    return state.set('locationData', fromJS(payload));
  case actionTypes.location.errorMessage.UPDATE:
    return state.set('errorMessage', payload);
  default:
    return state;
  }
};

export default combineReducers({
  steps,
  location,
});
