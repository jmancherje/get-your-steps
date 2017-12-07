import { connect } from 'react-redux';

import {
  setHoursBack,
  setStepsSinceHour,
  updateRealtimeStepData,
  setHistoricStepData,
  setIsPedometerAvailable,
  updateCurrentStepCount,
} from '../actions';

import {
  getHoursBack,
  getStepsSinceHour,
  getRealtimeStepData,
  getCurrentStepCount,
  getLastStepsPerSecond,
  getLastTotalSteps,
} from '../selectors';

import Profile from '../components/Profile';

const mapStateToProps = (state) => ({
  hoursBack: getHoursBack(state),
  stepsSinceHour: getStepsSinceHour(state),
  realtimeSteps: getRealtimeStepData(state),
  totalSteps: getLastTotalSteps(state),
  stepsPerSecond: getLastStepsPerSecond(state),
  currentStepCount: getCurrentStepCount(state),
});

export default connect(mapStateToProps, {
  setHoursBack,
  setStepsSinceHour,
  updateRealtimeStepData,
  setHistoricStepData,
  setIsPedometerAvailable,
  updateCurrentStepCount,
})(Profile);
