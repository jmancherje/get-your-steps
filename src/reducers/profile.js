import { fromJS } from 'immutable';

import actionTypes from '../actions/actionTypes';

const initialStepsState = fromJS({
  stepGoal: 3000,
  height: 68,
});

export default (state = initialStepsState, { type, payload }) => {
  switch (type) {
  case actionTypes.profile.stepGoal.UPDATE:
    return state.set('stepGoal', payload);
  case actionTypes.profile.stepGoal.INITIALIZE:
    return state.set('stepGoal', JSON.parse(payload));
  case actionTypes.profile.height.UPDATE:
    return state.set('height', payload);
  case actionTypes.profile.height.INITIALIZE:
    return state.set('height', JSON.parse(payload));
  default:
    return state;
  }
};
