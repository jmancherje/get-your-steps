import actionTypes from './actionTypes';

export const setLocationData = (locationData) => ({
  type: actionTypes.location.locationData.UPDATE,
  payload: locationData,
});

export const setLocationErrorMessage = (message) => ({
  type: actionTypes.location.errorMessage.UPDATE,
  payload: message,
});
