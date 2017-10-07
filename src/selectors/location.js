import { Map } from 'immutable';
import { createSelector } from 'reselect';

export const getLocation = state => state.get('location', Map());

export const getLocationData = createSelector(
  [getLocation],
  location => location.get('locationData', Map()),
);

export const getLocationErrorMessage = createSelector(
  [getLocation],
  location => location.get('errorMessage', ''),
);
