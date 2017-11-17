import { fromJS, Map, List } from 'immutable';

import actionTypes from '../actions/actionTypes';

const initialStepsState = fromJS({
  currentSearch: {
    origin: Map(),
    destination: Map(),
  },
  destinations: List(),
  searchedRouteOptions: [],
  activeRouteIndex: 0,
  // TODO Saved routes
});

const createDestinationFromResponse = ({ data, details }) => {
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
  return locationData;
};

const updateDestinations = (state, { data, details, index }) => (
  state.update(
    'destinations',
    List(),
    destinations => {
      const locationData = createDestinationFromResponse({ data, details });
      if (typeof index === 'number') {
        return destinations.insert(index, locationData);
      }
      return destinations.push(locationData);
    })
);

export default (state = initialStepsState, { type, payload }) => {
  switch (type) {
  case actionTypes.directions.activeIndex.UPDATE:
    return state.set('activeRouteIndex', payload);
  case actionTypes.directions.searchedRouteOptions.UPDATE:
    return state.set('searchedRouteOptions', payload);
  case actionTypes.directions.destinations.UPDATE:
    return updateDestinations(state, payload);
  default:
    return state;
  }
};
