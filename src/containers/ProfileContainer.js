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
  updateHeight,
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
  getHeight,
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
  height: getHeight(state),
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
  updateHeight,
})(Profile);
