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

const updateSearchedRouteOptions = (state, payload) => {
  const routes = payload.routes;
  if (!Array.isArray(routes) || routes.length < 1) return state;

  // TODO: do this without immutable to prevent unnecessary .toJS
  const allRoutes = routes.reduce((steps, route) => {
    const combinedLegs = route.legs.reduce((legsMap, leg) => (
      legsMap
        .update('distance', distance => distance + leg.distance.value)
        .update('steps', nextSteps => nextSteps.push(Map({
          latitude: leg.start_location.lat,
          longitude: leg.start_location.lng,
        })).concat(leg.steps.map(step => ({
          latitude: step.end_location.lat,
          longitude: step.end_location.lng,
        }))))
    ), Map({ distance: 0, steps: List() }));
    steps.push(combinedLegs.toJS());
    return steps;
  }, []);

  return state.set('searchedRouteOptions', fromJS(allRoutes));
};

export default (state = initialStepsState, { type, payload }) => {
  switch (type) {
  case actionTypes.directions.activeIndex.UPDATE:
    return state.set('activeRouteIndex', payload);
  case actionTypes.directions.searchedRouteOptions.UPDATE:
    return updateSearchedRouteOptions(state, payload);
  case actionTypes.directions.destinations.UPDATE:
    return updateDestinations(state, payload);
  default:
    return state;
  }
};
