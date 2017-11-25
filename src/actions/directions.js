import actionTypes from './actionTypes';
import { getDestinations } from '../selectors/directions';
import { getCurrentLocation } from '../selectors/location';
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
  const requestDestinationString = destinations.reduce((reqString, destination, index) => {
    let destinationString = `place_id:${destination.get('dataPlaceId')}`;
    if (!destination.get('dataPlaceId')) {
      destinationString = `${destination.getIn(['coordinates', 'latitude'])},${destination.getIn(['coordinates', 'longitude'])}`;
    }
    if (index === 0) {
      return `${reqString}${destinationString}`;
    }
    if (index + 1 === destinations.size) {
      return `${reqString}&destination=${destinationString}`;
    }
    if (index === 1) {
      return `${reqString}&waypoints=${destinationString}`;
    }
    return `${reqString}|${destinationString}`;
  }, 'origin=');
  const url = 'https://maps.googleapis.com/maps/api/directions/json?mode=walking&alternatives=true';
  const apiUrl = `${url}&${requestDestinationString}&key=${key}`;
  return fetch(apiUrl)
    .then(res => res.json())
    .then(response => response);
};

export const updateDestinations = (payload) => (dispatch, getState) => {
  dispatch({
    type: actionTypes.directions.destinations.UPDATE,
    payload,
  });

  const destinations = getDestinations(getState());
  if (destinations.size < 2) return;
  fetchDirections(destinations)
    .then(response => {
      dispatch(updateSearchedRouteOptions(response));
    });
};

export const clearDestinationIndex = (index) => ({
  type: actionTypes.directions.destinations.CLEAR_INDEX,
  payload: index,
});

export const addCurrentLocationToDestinations = () => (dispatch, getState) => {
  const currentLocation = getCurrentLocation(getState());
  dispatch(updateDestinations({
    data: { description: 'Current Location' },
    details: {
      name: 'Current Location',
      geometry: {
        location: {
          lat: currentLocation.get('latitude'),
          lng: currentLocation.get('longitude'),
        },
      },
    },
  }));
};
