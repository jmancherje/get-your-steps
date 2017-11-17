import { fromJS, Map } from 'immutable';

import actionTypes from '../actions/actionTypes';

const initialStepsState = fromJS({
  currentSearch: {
    origin: Map(),
    destination: Map(),
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
      longitude: details.geometry.location.lng,
      latitude: details.geometry.location.lat,
    }),
    viewPort: Map({
      northEast: Map({
        longitude: details.geometry.viewport.northeast.lng,
        latitude: details.geometry.viewport.northeast.lat,
      }),
      southWest: Map({
        longitude: details.geometry.viewport.southwest.lng,
        latitude: details.geometry.viewport.southwest.lat,
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
