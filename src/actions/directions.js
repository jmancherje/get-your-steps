import { AsyncStorage } from 'react-native';

import actionTypes from './actionTypes';
import {
  getDestinations,
  getSavedRoutes,
} from '../selectors/directions';
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

export const resetDirections = (navigation) => (dispatch, getState) => {
  // Prevent tryign to use synthetic event as a function
  if (typeof navigation === 'function') {
    navigation.navigate('SavedRoutes');
  }
  dispatch({ type: actionTypes.directions.RESET });
};

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

export const clearDestinationIndex = (index) => (dispatch, getState) => {
  dispatch({
    type: actionTypes.directions.destinations.CLEAR_INDEX,
    payload: index,
  });

  const destinations = getDestinations(getState());
  if (destinations.size >= 2) {
    fetchDirections(destinations)
      .then(response => {
        dispatch(updateSearchedRouteOptions(response));
      });
  }
};

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

export const updateShowMap = (showMap) => ({
  type: actionTypes.directions.map.UPDATE,
  payload: showMap,
});

export const saveRoute = (payload) => (dispatch, getState) => {
  // Save the current direction
  dispatch({
    type: actionTypes.directions.SAVE,
    payload,
  });

  const savedRoutes = getSavedRoutes(getState());
  AsyncStorage.setItem('savedRoutes', JSON.stringify(savedRoutes));
};

export const clearAllSavedRoutes = (payload) => (dispatch, getState) => {
  dispatch({
    type: actionTypes.directions.CLEAR_ALL,
    payload,
  });

  AsyncStorage.removeItem('savedRoutes');
};

export const deleteRoute = (wId) => (dispatch, getState) => {
  dispatch({
    type: actionTypes.directions.DELETE,
    payload: wId,
  });

  const savedRoutes = getSavedRoutes(getState());
  AsyncStorage.setItem('savedRoutes', JSON.stringify(savedRoutes));
};
