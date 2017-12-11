import { connect } from 'react-redux';

import {
  getSavedRoutes,
  getStepGoal,
  getStepsPerMeter,
} from '../selectors';

import {
  deleteRoute,
} from '../actions';

import SavedRoutes from '../components/SavedRoutes';

const mapStateToProps = (state) => ({
  savedRoutes: getSavedRoutes(state),
  stepGoal: getStepGoal(state),
  stepsPerMeter: getStepsPerMeter(state),
});

export default connect(mapStateToProps, {
  deleteRoute,
})(SavedRoutes);
