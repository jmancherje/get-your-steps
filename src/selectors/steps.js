import { Map, List } from 'immutable';
import { createSelector } from 'reselect';

export const getSteps = state => state.get('steps', Map());

export const getIsPedometerAvailable = createSelector(
  [getSteps],
  steps => steps.get('isPedometerAvailable', false)
);

export const getRealtimeStepData = createSelector(
  [getSteps],
  steps => steps.get('realtimeSteps', List())
);

export const getHoursBack = createSelector(
  [getSteps],
  steps => steps.get('hoursBack')
);

export const getStepsSinceHour = createSelector(
  [getSteps],
  steps => steps.get('stepsSinceHour', 0)
);

export const getCurrentStepCount = createSelector(
  [getSteps],
  steps => steps.get('currentStepCount', 0)
);
