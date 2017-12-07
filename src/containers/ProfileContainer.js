import { connect } from 'react-redux';

import {
  setMinutesBack,
  setStepsSinceHour,
  updateRealtimeStepData,
  setIsPedometerAvailable,
  updateCurrentStepCount,
  resetCurrentStepCount,
} from '../actions';

import {
  getMinutesBack,
  getStepsSinceHour,
  getRealtimeStepData,
  getCurrentStepCount,
  getLastStepsPerSecond,
  getLastTotalSteps,
  getStepResetDate,
} from '../selectors';

import Profile from '../components/Profile';

const mapStateToProps = (state) => ({
  minutesBack: getMinutesBack(state),
  stepsSinceHour: getStepsSinceHour(state),
  realtimeSteps: getRealtimeStepData(state),
  totalSteps: getLastTotalSteps(state),
  stepsPerSecond: getLastStepsPerSecond(state),
  currentStepCount: getCurrentStepCount(state),
  stepResetDate: getStepResetDate(state),
});

export default connect(mapStateToProps, {
  setMinutesBack,
  setStepsSinceHour,
  updateRealtimeStepData,
  setIsPedometerAvailable,
  updateCurrentStepCount,
  resetCurrentStepCount,
})(Profile);
