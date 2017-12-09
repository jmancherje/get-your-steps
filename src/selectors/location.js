import { Map, List } from 'immutable';
import { createSelector } from 'reselect';

export const getLocation = state => state.get('location', Map());

export const getRealtimeLocationData = createSelector(
  [getLocation],
  location => location.get('realtimeLocationData', List()),
);

export const getLocationErrorMessage = createSelector(
  [getLocation],
  location => location.get('errorMessage', ''),
);

export const getLatestLocationData = createSelector(
  [getRealtimeLocationData],
  locationData => locationData.get(-1, Map()),
);

export const getCurrentLocation = createSelector(
  [getLatestLocationData],
  latestLocationData => {
    const longitude = latestLocationData.getIn(['coords', 'longitude']);
    const latitude = latestLocationData.getIn(['coords', 'latitude']);
    if (latitude && longitude) {
      return Map({ longitude, latitude });
    }
    return Map();
  }
);
