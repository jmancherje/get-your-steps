import { fromJS, Map } from 'immutable';

import actionTypes from '../actions/actionTypes';

const initialStepsState = fromJS({
  currentSearch: {
    origin: null,
    destination: null,
  },
  searchedRouteOptions: [],
  activeRouteIndex: 0,
  // TODO Saved routes
});

const updateCurrentSearch = (state, { data, details }, originOrDestination) => {
  const locationData = Map({
    // Long description
    description: data.description,
    // Short description
    name: details.name,
    dataPlaceId: data.place_id,
    detailsPlaceId: details.place_id,
    coordinates: Map({
      longitude: details.geometry.location.lat,
      latitude: details.geometry.location.lng,
    }),
    viewPort: Map({
      northEast: Map({
        longitude: details.geometry.viewport.northeast.lat,
        latitude: details.geometry.viewport.northeast.lng,
      }),
      southWest: Map({
        longitude: details.geometry.viewport.southwest.lat,
        latitude: details.geometry.viewport.southwest.lng,
      }),
    }),
  });
  return state.setIn(['currentSearch', originOrDestination], locationData);
};

export default (state = initialStepsState, { type, payload }) => {
  switch (type) {
  case actionTypes.directions.activeIndex.UPDATE:
    return state.set('activeRouteIndex', payload);
  case actionTypes.directions.searchedRouteOptions.UPDATE:
    return state.set('searchedRouteOptions', payload);
  case actionTypes.directions.currentSearch.destination.UPDATE:
    return updateCurrentSearch(state, payload, 'destination');
  case actionTypes.directions.currentSearch.origin.UPDATE:
    return updateCurrentSearch(state, payload, 'origin');
  default:
    return state;
  }
};
