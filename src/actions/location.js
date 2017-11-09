import actionTypes from './actionTypes';

export const setLocationData = (locationData) => ({
  type: actionTypes.location.locationData.UPDATE,
  payload: locationData,
});

export const setLocationErrorMessage = (message) => ({
  type: actionTypes.location.errorMessage.UPDATE,
  payload: message,
});

export const setCurrentLocation = (locationData) => ({
  type: actionTypes.location.currentLocation.UPDATE,
  payload: locationData,
});
