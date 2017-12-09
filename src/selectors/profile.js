import { Map } from 'immutable';
import { createSelector } from 'reselect';

export const getProfile = state => state.get('profile', Map());

export const getStepGoal = createSelector(
  [getProfile],
  profile => profile.get('stepGoal', 3000),
);
