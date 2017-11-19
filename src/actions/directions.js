import { Map } from 'immutable';

import actionTypes from './actionTypes';
import { getDestinations } from '../selectors/directions';
import { GOOGLE_DIRECTIONS_KEY as key } from '../../keys';

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

const fetchDirections = (destinations) => {
  // TODO: make this work for multiple locations instead of just 2
  const origin = destinations.get(0, Map());
  const destination = destinations.get(1, Map());
  let destinationString = `place_id:${destination.get('dataPlaceId')}`;
  if (!destination.get('dataPlaceId')) {
    destinationString = `${destination.getIn(['coordinates', 'latitude'])},${destination.getIn(['coordinates', 'longitutde'])}`;
  }
  const url = 'https://maps.googleapis.com/maps/api/directions/json?mode=walking&alternatives=true';
  const currentLocationString = `${origin.getIn(['coordinates', 'latitude'])},${origin.getIn(['coordinates', 'longitude'])}`;
  const apiUrl = `${url}&origin=${currentLocationString}&destination=${destinationString}&key=${key}`;
  return fetch(apiUrl)
    .then(res => res.json())
    .then(response => response);
};

export const updateDestinations = (payload) => (dispatch, getState) => {
  dispatch({
    type: actionTypes.directions.destinations.UPDATE,
    payload,
  });

  // TODO: add logic here to generate route if destinations.size > 1
  const destinations = getDestinations(getState());
  if (destinations.size < 2) return;
  fetchDirections(destinations)
    .then(response => {
      dispatch(updateSearchedRouteOptions(response));
    });
};
