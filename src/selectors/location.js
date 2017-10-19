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
