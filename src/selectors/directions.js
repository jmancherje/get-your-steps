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

export const getCurrentSearch = createSelector(
  [getDirections],
  directions => directions.get('currentSearch', Map())
);

export const getCurrentSearchOrigin = createSelector(
  [getCurrentSearch],
  currentSearchMap => currentSearchMap.get('origin', Map())
);

export const getCurrentSearchDestination = createSelector(
  [getCurrentSearch],
  currentSearchMap => currentSearchMap.get('destination', Map())
);

export const getDestinations = createSelector(
  [getDirections],
  directions => directions.get('destinations', List())
);

export const getIsShowingMap = createSelector(
  [getDirections],
  directions => directions.get('showMap', false)
);

export const getNumberOfDestinations = createSelector(
  [getDestinations],
  destinations => destinations.size,
);

export const getSavedRoutes = createSelector(
  [getDirections],
  directions => directions.get('savedRoutes'),
);
