import { fromJS, Map, List } from 'immutable';
import { get } from 'lodash';
import uuid from 'uuid-v4';

import actionTypes from '../actions/actionTypes';

const initialStepsState = fromJS({
  destinations: List(),
  searchedRouteOptions: [],
  activeRouteIndex: 0,
  showMap: false,
  savedRoutes: List(),
});

const createDestinationFromResponse = ({ data, details }) => {
  const locationData = Map({
    // Long description
    description: get(data, 'description'),
    // Short description
    name: get(details, 'name'),
    dataPlaceId: get(data, 'place_id'),
    detailsPlaceId: get(details, 'place_id'),
    coordinates: Map({
      longitude: get(details, 'geometry.location.lng'),
      latitude: get(details, 'geometry.location.lat'),
    }),
    viewPort: Map({
      northEast: Map({
        longitude: get(details, 'geometry.viewport.northeast.lng'),
        latitude: get(details, ['geometry', 'viewport', 'northeast', 'lat']),
      }),
      southWest: Map({
        longitude: get(details, 'geometry.viewport.southwest.lng'),
        latitude: get(details, ['geometry', 'viewport', 'southwest', 'lat']),
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
  // const allRoutes = routes.reduce((steps, route) => {
  //   const combinedLegs = route.legs.reduce((legsMap, leg) => (
  //     legsMap
  //       .update('distance', distance => distance + leg.distance.value)
  //       .update('steps', nextSteps => nextSteps.push(Map({
  //         latitude: leg.start_location.lat,
  //         longitude: leg.start_location.lng,
  //       })).concat(leg.steps.map(step => ({
  //         latitude: step.end_location.lat,
  //         longitude: step.end_location.lng,
  //       }))))
  //   ), Map({ distance: 0, steps: List() }));
  //   steps.push(combinedLegs.toJS());
  //   return steps;
  // }, []);

  return state.set('searchedRouteOptions', fromJS(routes));
};

const updateShowMap = (state, showMap) => {
  showMap = typeof showMap === 'boolean' ? showMap : !state.get('showMap');
  return state.set('showMap', showMap);
};

const saveRoute = (state, { name = 'Unnamed Route', details }) => {
  const destinations = state.get('destinations', List());
  const routeOptions = state.get('searchedRouteOptions', List());
  const activeRouteIndex = state.get('activeRouteIndex', 0);
  const route = routeOptions.get(activeRouteIndex, Map());
  if (route.isEmpty() || !routeOptions.size) return state;
  return state.update(
    'savedRoutes',
    List(),
    routes => routes.push(Map({ destinations, route, name, details, _wId: uuid() })),
  );
};

const initializeSavedRoutes = (state, stringifiedData) => {
  // This is very expensive but it only happens on initializing the app
  const immutableData = fromJS(JSON.parse(stringifiedData));
  return state.set('savedRoutes', immutableData);
};

const deleteSavedRoute = (state, wId) =>
  state.update('savedRoutes', List(), savedRoutes => savedRoutes.filterNot(route => route.get('_wId') === wId));

export default (state = initialStepsState, { type, payload }) => {
  switch (type) {
  case actionTypes.directions.activeIndex.UPDATE:
    return state.set('activeRouteIndex', payload);
  case actionTypes.directions.searchedRouteOptions.UPDATE:
    return updateSearchedRouteOptions(state, payload);
  case actionTypes.directions.destinations.UPDATE:
    return updateDestinations(state, payload);
  case actionTypes.directions.destinations.CLEAR_INDEX:
    return state.update('destinations', destinations => destinations.splice(payload, 1));
  case actionTypes.directions.destinations.CLEAR:
    return state.update('destinations', List());
  case actionTypes.directions.map.UPDATE:
    return updateShowMap(state, payload);
  case actionTypes.directions.RESET:
    return state.set('searchedRouteOptions', List()).set('destinations', List());
  case actionTypes.directions.SAVE:
    return saveRoute(state, payload);
  case actionTypes.directions.CLEAR_ALL:
    return state.set('savedRoutes', List());
  case actionTypes.directions.INITIALIZE:
    return initializeSavedRoutes(state, payload);
  case actionTypes.directions.DELETE:
    return deleteSavedRoute(state, payload);
  default:
    return state;
  }
};
