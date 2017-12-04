import { connect } from 'react-redux';

import {
  getCurrentLocation,
  getSearchedRouteOptions,
  getNumberOfDestinations,
  getActiveRouteIndex,
  getDestinations,
} from '../selectors';

import {
  updateActiveIndex,
  updateDestinations,
  clearDestinationIndex,
  clearDestinations,
  addCurrentLocationToDestinations,
  updateSearchedRouteOptions,
  resetDirections,
} from '../actions';

import Directions from '../components/Directions';

const mapStateToProps = (state) => ({
  numberOfDestinations: getNumberOfDestinations(state),
  searchedRouteOptions: getSearchedRouteOptions(state),
  currentLocation: getCurrentLocation(state),
  activeRouteIndex: getActiveRouteIndex(state),
  destinations: getDestinations(state),
});

export default connect(mapStateToProps, {
  updateActiveIndex,
  updateDestinations,
  clearDestinationIndex,
  clearDestinations,
  addCurrentLocationToDestinations,
  updateSearchedRouteOptions,
  resetDirections,
})(Directions);
