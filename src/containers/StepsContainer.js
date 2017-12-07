import { connect } from 'react-redux';

import {
  setMinutesBack,
  setStepsSinceHour,
  updateRealtimeStepData,
  setHistoricStepData,
  setIsPedometerAvailable,
  updateCurrentStepCount,
} from '../actions';

import {
  getMinutesBack,
  getStepsSinceHour,
  getRealtimeStepData,
  getCurrentStepCount,
  getLastStepsPerSecond,
  getLastTotalSteps,
} from '../selectors';

import Steps from '../components/Steps';

const mapStateToProps = (state) => ({
  minutesBack: getMinutesBack(state),
  stepsSinceHour: getStepsSinceHour(state),
  realtimeSteps: getRealtimeStepData(state),
  totalSteps: getLastTotalSteps(state),
  stepsPerSecond: getLastStepsPerSecond(state),
  currentStepCount: getCurrentStepCount(state),
});

export default connect(mapStateToProps, {
  setMinutesBack,
  setStepsSinceHour,
  updateRealtimeStepData,
  setHistoricStepData,
  setIsPedometerAvailable,
  updateCurrentStepCount,
})(Steps);
