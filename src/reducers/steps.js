import { List, Map, fromJS } from 'immutable';
import moment from 'moment';

import actionTypes from '../actions/actionTypes';
import SAMPLE_SIZE from '../constants/sampleSize';

const updateHistoricData = (state, { startDate, endDate, steps }) => {
  const formattedPayload = Map({ startDate, endDate, steps });
  return state.updateIn(
    ['historicData', moment(startDate).format('L')], List(),
    (list) => list.set(startDate.getHours(), formattedPayload)
  );
};

const handleRealtimeStepsUpdate = (state, payload) => {
  const payloadMap = Map.isMap(payload) ? payload : fromJS(payload);
  const realtimeSteps = state.get('realtimeSteps', List());
  let stepsPerSecond = 0;
  const endStepData = payloadMap;
  const startStepData = realtimeSteps.get(realtimeSteps.size - (SAMPLE_SIZE - 1));
  console.log('sampleSize', SAMPLE_SIZE, 'realtimeSteps.size', realtimeSteps.size);
  // realtimeSteps = [{}, {}, {}, {}, {}, {}];
  console.log(startStepData);
  if (realtimeSteps.size >= SAMPLE_SIZE && startStepData && endStepData) {
    const {
      time: startTime,
      totalSteps: startSteps,
    } = startStepData.toJS();
    const {
      time: endTime,
      totalSteps: endSteps,
    } = endStepData.toJS();
    const stepIncrement = endSteps - startSteps;
    const timeIncrement = endTime - startTime;
    stepsPerSecond = (stepIncrement / timeIncrement) * 1000;
  }
  const updatedPayload = payloadMap.set('stepsPerSecond', stepsPerSecond);
  return state.set('realtimeSteps', realtimeSteps.push(updatedPayload));
};

const initialStepsState = fromJS({
  hoursBack: 1,
  stepsSinceHour: 0,
  currentStepCount: 0,
  realtimeSteps: List(),
  historicData: Map(),
});

export default (state = initialStepsState, { type, payload }) => {
  window._state = state;
  switch (type) {
  case actionTypes.steps.hoursBack.UPDATE:
    return state.set('hoursBack', payload);
  case actionTypes.steps.stepsSinceHour.UPDATE:
    return state.set('stepsSinceHour', payload);
  case actionTypes.steps.realtimeSteps.UPDATE:
    return handleRealtimeStepsUpdate(state, payload);
  case actionTypes.steps.isPedometerAvailable.UPDATE:
    return state.set('isPedometerAvailable', payload);
  case actionTypes.steps.historicData.SET:
    return updateHistoricData(state, payload);
  default:
    return state;
  }
};
