import actionTypes from './actionTypes';

export const updateStepGoal = (steps) => ({
  type: actionTypes.profile.stepGoal.UPDATE,
  payload: steps,
});
