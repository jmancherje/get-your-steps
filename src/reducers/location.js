import { Map, List, fromJS } from 'immutable';

import actionTypes from '../actions/actionTypes';
import SAMPLE_SIZE from '../constants/sampleSize';

const sanitizePayload = (payload) => {
  let payloadMap = Map.isMap(payload) ? payload : fromJS(payload);
  if (payloadMap.getIn(['coords', 'speed']) < 0) {
    payloadMap = payloadMap.setIn(['coords', 'speed'], 0);
  }
  return payloadMap;
};

const updateCurrentLocation = (state, payload = Map()) => {
  const payloadMap = Map.isMap(payload) ? payload : fromJS(payload);
  if (
    payloadMap.hasIn(['coords', 'longitude']) &&
    payloadMap.hasIn(['content', 'latitude'])
  ) {
    return state;
  }
  return state.set('currentLocation', Map({
    longitude: payloadMap.getIn(['coords', 'longitude']),
    latitude: payloadMap.getIn(['coords', 'latitude']),
  }));
};

const handleLocationDataUpdate = (state, payload = Map()) => {
  const sanitizedPayload = sanitizePayload(payload);
  const realtimeLocationData = state.get('realtimeLocationData', List());
  let averageSpeed = sanitizedPayload.getIn(['coords', 'speed'], 0);
  if (realtimeLocationData.size >= SAMPLE_SIZE) {
    const cumulativeSpeedOverSampleSize = realtimeLocationData
      .slice(realtimeLocationData.size - SAMPLE_SIZE)
      .reduce((sum, nextLocation) => sum + nextLocation.getIn(['coords', 'speed'], 0), 0);
    averageSpeed = (cumulativeSpeedOverSampleSize / SAMPLE_SIZE);
  }
  const updatedPayload = sanitizedPayload.set('averageSpeed', averageSpeed);
  return state
    // TODO: add update here for currentLocation
    // .update('currentLocation', Map(), () => getCurrentLocation(sanitizedPayload))
    .update('realtimeLocationData', List(), locationList => locationList.push(updatedPayload));
};

const initialLocationState = Map({
  errorMessage: '',
  realtimeLocationData: List(),
  currentLocation: Map({
    latitude: 37.779360,
    longitude: -122.409491,
  }),
});

export default (state = initialLocationState, { type, payload }) => {
  switch (type) {
  case actionTypes.location.locationData.UPDATE:
    return handleLocationDataUpdate(state, payload);
  case actionTypes.location.errorMessage.UPDATE:
    return state.set('errorMessage', payload);
  case actionTypes.location.currentLocation.UPDATE:
    return updateCurrentLocation(state, payload);
  default:
    return state;
  }
};
