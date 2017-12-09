import { connect } from 'react-redux';

import {
  setMinutesBack,
  setStepsSinceHour,
  updateRealtimeStepData,
  setIsPedometerAvailable,
  updateCurrentStepCount,
  resetCurrentStepCount,
  setStepsToday,
} from '../actions';

import {
  getStepsSinceHour,
  getRealtimeStepData,
  getCurrentStepCount,
  getLastStepsPerSecond,
  getLastTotalSteps,
  getStepResetDate,
  getStepGoal,
  getStepsToday,
  getIsPedometerAvailable,
} from '../selectors';

import Profile from '../components/Profile';

const mapStateToProps = (state) => ({
  stepsSinceHour: getStepsSinceHour(state),
  realtimeSteps: getRealtimeStepData(state),
  totalSteps: getLastTotalSteps(state),
  stepsPerSecond: getLastStepsPerSecond(state),
  currentStepCount: getCurrentStepCount(state),
  stepResetDate: getStepResetDate(state),
  stepGoal: getStepGoal(state),
  stepsToday: getStepsToday(state),
  isPedometerAvailable: getIsPedometerAvailable(state),
});

export default connect(mapStateToProps, {
  setMinutesBack,
  setStepsSinceHour,
  updateRealtimeStepData,
  setIsPedometerAvailable,
  updateCurrentStepCount,
  resetCurrentStepCount,
  setStepsToday,
})(Profile);
