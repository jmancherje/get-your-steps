import { connect } from 'react-redux';

import {
  setHoursBack,
  setStepsSinceHour,
  updateRealtimeStepData,
  setIsPedometerAvailable,
  updateCurrentStepCount,
  resetCurrentStepCount,
} from '../actions';

import {
  getHoursBack,
  getStepsSinceHour,
  getRealtimeStepData,
  getCurrentStepCount,
  getLastStepsPerSecond,
  getLastTotalSteps,
  getStepResetDate,
} from '../selectors';

import Profile from '../components/Profile';

const mapStateToProps = (state) => ({
  hoursBack: getHoursBack(state),
  stepsSinceHour: getStepsSinceHour(state),
  realtimeSteps: getRealtimeStepData(state),
  totalSteps: getLastTotalSteps(state),
  stepsPerSecond: getLastStepsPerSecond(state),
  currentStepCount: getCurrentStepCount(state),
  stepResetDate: getStepResetDate(state),
});

export default connect(mapStateToProps, {
  setHoursBack,
  setStepsSinceHour,
  updateRealtimeStepData,
  setIsPedometerAvailable,
  updateCurrentStepCount,
  resetCurrentStepCount,
})(Profile);
