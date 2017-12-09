import { fromJS } from 'immutable';

import actionTypes from '../actions/actionTypes';

const initialStepsState = fromJS({
  stepGoal: 3000,
});

export default (state = initialStepsState, { type, payload }) => {
  switch (type) {
  case actionTypes.profile.stepGoal.UPDATE:
    return state.set('stepGoal', payload);
  default:
    return state;
  }
};
