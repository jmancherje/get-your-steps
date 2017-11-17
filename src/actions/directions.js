import actionTypes from './actionTypes';
import { getDestinations } from '../selectors/directions';

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

export const updateDestinations = (payload) => (dispatch, getState) => {
  dispatch({
    type: actionTypes.directions.destinations.UPDATE,
    payload,
  });

  // TODO: add logic here to generate route if destinations.size > 1
  const destinations = getDestinations(getState());
};
