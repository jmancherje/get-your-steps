import { connect } from 'react-redux';

import {
  setMinutesBack,
  setStepsSinceHour,
  updateRealtimeStepData,
  setIsPedometerAvailable,
  updateCurrentStepCount,
  resetCurrentStepCount,
  setStepsToday,
  updateStepGoal,
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
});

export default connect(mapStateToProps, {
  setMinutesBack,
  setStepsSinceHour,
  updateRealtimeStepData,
  setIsPedometerAvailable,
  updateCurrentStepCount,
  resetCurrentStepCount,
  setStepsToday,
  updateStepGoal,
})(Profile);
