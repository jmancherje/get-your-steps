import { connect } from 'react-redux';

import {
  getCurrentLocation,
} from '../selectors/location';

import {
  getCurrentStepCount,
} from '../selectors/steps';

import {
  resetCurrentStepCount,
} from '../actions/steps';

import Directions from '../components/Directions';

const mapStateToProps = (state) => ({
  currentLocation: getCurrentLocation(state),
  currentStepCount: getCurrentStepCount(state),
});

export default connect(mapStateToProps, {
  resetCurrentStepCount,
})(Directions);
