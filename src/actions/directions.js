import actionTypes from './actionTypes';

export const updateActiveIndex = (index) => ({
  type: actionTypes.directions.activeIndex.UPDATE,
  payload: index,
});

export const updateSearchedRouteOptions = (routesList) => ({
  type: actionTypes.directions.searchedRouteOptions.UPDATE,
  payload: routesList,
});

export const resetActiveSearchedRoutes = () => ({
  type: actionTypes.directions.searchedRouteOptions.RESET,
});

export const updateCurrentSearchOrigin = (searchResults) => ({
  type: actionTypes.directions.currentSearch.origin.UPDATE,
  payload: searchResults,
});

export const updateCurrentSearchDestination = (searchResults) => ({
  type: actionTypes.directions.currentSearch.destination.UPDATE,
  payload: searchResults,
});

export const clearCurrentSearchResultsOrigin = () => ({
  type: actionTypes.directions.currentSearch.origin.CLEAR,
});

export const clearCurrentSearchResultsDestination = () => ({
  type: actionTypes.directions.currentSearch.destination.CLEAR,
});
