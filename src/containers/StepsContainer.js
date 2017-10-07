import { connect } from 'react-redux';

import {
  setHoursBack,
  setStepsSinceHour,
  setRealtimeStepData,
  setIsPedometerAvailable,
} from '../actions/steps';

import {
  getHoursBack,
  getStepsSinceHour,
  getRealtimeStepData,
  getCurrentStepCount,
} from '../selectors/steps';

import Steps from '../components/Steps';

const mapStateToProps = (state) => ({
  hoursBack: getHoursBack(state),
  stepsSinceHour: getStepsSinceHour(state),
  realtimeSteps: getRealtimeStepData(state),
  currentStepCount: getCurrentStepCount(state),
});

export default connect(mapStateToProps, {
  setHoursBack,
  setStepsSinceHour,
  setRealtimeStepData,
  setIsPedometerAvailable,
})(Steps);
