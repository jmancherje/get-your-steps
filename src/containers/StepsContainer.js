import { connect } from 'react-redux';

import {
  setHoursBack,
  setStepsSinceHour,
  setRealtimeStepData,
  setHistoricStepData,
  setIsPedometerAvailable,
} from '../actions/steps';

import {
  getHoursBack,
  getStepsSinceHour,
  getRealtimeStepData,
  getCurrentStepCount,
  getLastStepsPerSecond,
  getTotalStepsFromPedometer,
} from '../selectors/steps';

import Steps from '../components/Steps';

const mapStateToProps = (state) => ({
  hoursBack: getHoursBack(state),
  stepsSinceHour: getStepsSinceHour(state),
  realtimeSteps: getRealtimeStepData(state),
  totalSteps: getTotalStepsFromPedometer(state),
  stepsPerSecond: getLastStepsPerSecond(state),
  currentStepCount: getCurrentStepCount(state),
});

export default connect(mapStateToProps, {
  setHoursBack,
  setStepsSinceHour,
  setRealtimeStepData,
  setHistoricStepData,
  setIsPedometerAvailable,
})(Steps);
