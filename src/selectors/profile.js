import { Map } from 'immutable';
import { createSelector } from 'reselect';

import heightToSteps from '../constants/heightToSteps';

export const getProfile = state => state.get('profile', Map());

export const getStepGoal = createSelector(
  [getProfile],
  profile => profile.get('stepGoal', 3000),
);

export const getHeight = createSelector(
  [getProfile],
  profile => profile.get('height', 68),
);

export const getStepsPerMeter = createSelector(
  [getHeight],
  height => height * heightToSteps,
);
