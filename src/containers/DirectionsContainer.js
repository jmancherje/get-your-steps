import { connect } from 'react-redux';

import {
  getCurrentLocation,
} from '../selectors/location';

import {
  getCurrentStepCount,
} from '../selectors/steps';

import {
  getSearchedRouteOptions,
  getActiveRouteIndex,
  getCurrentSearchOrigin,
  getCurrentSearchDestination,
} from '../selectors/directions';

import {
  updateActiveIndex,
  updateSearchedRouteOptions,
  resetActiveSearchedRoutes,
  updateCurrentSearchOrigin,
  updateCurrentSearchDestination,
  clearCurrentSearchResultsOrigin,
  clearCurrentSearchResultsDestination,
} from '../actions/directions';

import {
  resetCurrentStepCount,
} from '../actions/steps';

import Directions from '../components/Directions';

const mapStateToProps = (state) => ({
  searchedRouteOptions: getSearchedRouteOptions(state),
  currentLocation: getCurrentLocation(state),
  currentStepCount: getCurrentStepCount(state),
  activeRouteIndex: getActiveRouteIndex(state),
  currentSearchOrigin: getCurrentSearchOrigin(state),
  currentSearchDestination: getCurrentSearchDestination(state),
});

export default connect(mapStateToProps, {
  resetCurrentStepCount,
  updateActiveIndex,
  updateSearchedRouteOptions,
  resetActiveSearchedRoutes,
  updateCurrentSearchOrigin,
  updateCurrentSearchDestination,
  clearCurrentSearchResultsOrigin,
  clearCurrentSearchResultsDestination,
})(Directions);
