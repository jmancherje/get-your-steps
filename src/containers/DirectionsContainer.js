import { connect } from 'react-redux';

import {
  getCurrentLocation,
} from '../selectors/location';

import {
  getCurrentStepCount,
} from '../selectors/steps';

import {
  getSearchedRouteOptions,
  getNumberOfDestinations,
  getActiveRouteIndex,
  getDestinations,
  getIsShowingMap,
} from '../selectors/directions';

import {
  updateActiveIndex,
  updateDestinations,
  clearDestinationIndex,
  clearDestinations,
  addCurrentLocationToDestinations,
  updateSearchedRouteOptions,
  resetDirections,
  saveRoute,
} from '../actions/directions';

import {
  resetCurrentStepCount,
} from '../actions/steps';

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
  saveRoute,
})(Directions);
