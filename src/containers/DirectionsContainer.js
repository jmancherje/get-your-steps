import { connect } from 'react-redux';

import {
  getCurrentLocation,
  getSearchedRouteOptions,
  getActiveRouteIndex,
  getDestinations,
  getStepsPerMeter,
} from '../selectors';

import {
  updateActiveIndex,
  updateDestinations,
  clearDestinationIndex,
  clearDestinations,
  addCurrentLocationToDestinations,
  updateSearchedRouteOptions,
  resetDirections,
  saveRoute,
} from '../actions';

import Directions from '../components/Directions';

const mapStateToProps = (state) => ({
  searchedRouteOptions: getSearchedRouteOptions(state),
  currentLocation: getCurrentLocation(state),
  activeRouteIndex: getActiveRouteIndex(state),
  destinations: getDestinations(state),
  stepsPerMeter: getStepsPerMeter(state),
});

export default connect(mapStateToProps, {
  updateActiveIndex,
  updateDestinations,
  clearDestinationIndex,
  clearDestinations,
  addCurrentLocationToDestinations,
  updateSearchedRouteOptions,
  resetDirections,
  saveRoute,
})(Directions);
