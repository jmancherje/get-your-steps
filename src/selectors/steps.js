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

export const getLastStepsPerSecond = createSelector(
  [getRealtimeStepData],
  stepData => stepData.getIn([stepData.size - 1, 'stepsPerSecond'], 0)
);

export const getLastTotalSteps = createSelector(
  [getRealtimeStepData],
  stepData => stepData.getIn([stepData.size - 1, 'totalSteps'], 0)
);

export const getMinutesBack = createSelector(
  [getSteps],
  steps => steps.get('minutesBack')
);

export const getStepsSinceHour = createSelector(
  [getSteps],
  steps => steps.get('stepsSinceHour', 0)
);

export const getStepsToday = createSelector(
  [getSteps],
  steps => steps.get('stepsToday', 0)
);


export const getCurrentStepCount = createSelector(
  [getSteps],
  steps => steps.get('currentStepCount', 0)
);

export const getStepResetDate = createSelector(
  [getSteps],
  steps => steps.get('stepResetDate'),
);
