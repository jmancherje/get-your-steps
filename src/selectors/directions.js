import { Map, List } from 'immutable';
import { createSelector } from 'reselect';

export const getDirections = state => state.get('directions', Map());

export const getSearchedRouteOptions = createSelector(
  [getDirections],
  directions => directions.get('searchedRouteOptions', List()),
);

export const getActiveRouteIndex = createSelector(
  [getDirections],
  directions => directions.get('activeRouteIndex', 0),
);
