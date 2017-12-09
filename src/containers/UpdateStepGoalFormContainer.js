import { connect } from 'react-redux';

import {
  updateStepGoal,
} from '../actions';

import UpdateStepGoalForm from '../components/UpdateStepGoalForm';

export default connect(null, {
  updateStepGoal,
})(UpdateStepGoalForm);
