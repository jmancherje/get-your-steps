import { connect } from 'react-redux';

import {
  getCurrentLocation,
  getCurrentStepCount,
  getSearchedRouteOptions,
  getNumberOfDestinations,
  getActiveRouteIndex,
  getDestinations,
  getIsShowingMap,
} from '../selectors';

import {
  updateActiveIndex,
  updateDestinations,
  clearDestinationIndex,
  clearDestinations,
  addCurrentLocationToDestinations,
  updateSearchedRouteOptions,
  resetDirections,
  resetCurrentStepCount,
} from '../actions';

import Directions from '../components/Directions';

const mapStateToProps = (state) => ({
  numberOfDestinations: getNumberOfDestinations(state),
  searchedRouteOptions: getSearchedRouteOptions(state),
  currentLocation: getCurrentLocation(state),
  currentStepCount: getCurrentStepCount(state),
  activeRouteIndex: getActiveRouteIndex(state),
  destinations: getDestinations(state),
  showMap: getIsShowingMap(state),
});

export default connect(mapStateToProps, {
  resetCurrentStepCount,
  updateActiveIndex,
  updateDestinations,
  clearDestinationIndex,
  clearDestinations,
  addCurrentLocationToDestinations,
  updateSearchedRouteOptions,
  resetDirections,
})(Directions);
