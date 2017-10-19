import { Map, List, fromJS } from 'immutable';

import actionTypes from '../actions/actionTypes';
import SAMPLE_SIZE from '../constants/sampleSize';

const handleLocationDataUpdate = (state, payload = Map()) => {
  const payloadMap = Map.isMap(payload) ? payload : fromJS(payload);
  const realtimeLocationData = state.get('realtimeLocationData', List());
  let averageSpeed = payloadMap.getIn(['coords', 'speed'], 0);
  if (realtimeLocationData.size >= SAMPLE_SIZE) {
    const cumulativeSpeedOverSampleSize = realtimeLocationData
      .slice(realtimeLocationData.size - SAMPLE_SIZE)
      .reduce((sum, nextLocation) => sum + nextLocation.getIn(['coords', 'speed'], 0), 0);
    averageSpeed = (cumulativeSpeedOverSampleSize / SAMPLE_SIZE);
  }
  const updatedPayload = payloadMap.set('averageSpeed', averageSpeed);
  return state
    .update('realtimeLocationData', List(), locationList => locationList.push(updatedPayload));
};

const initialLocationState = Map({
  errorMessage: '',
  realtimeLocationData: List(),
});

export default (state = initialLocationState, { type, payload }) => {
  switch (type) {
  case actionTypes.location.locationData.UPDATE:
    return handleLocationDataUpdate(state, payload);
  case actionTypes.location.errorMessage.UPDATE:
    return state.set('errorMessage', payload);
  default:
    return state;
  }
};
