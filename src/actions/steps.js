import actionTypes from './actionTypes';

export const setHoursBack = (hours) => ({
  type: actionTypes.steps.hoursBack.UPDATE,
  payload: hours,
});

export const setStepsSinceHour = (steps) => ({
  type: actionTypes.steps.stepsSinceHour.UPDATE,
  payload: steps,
});

export const setRealtimeStepData = (stepArray) => ({
  type: actionTypes.steps.realtimeSteps.UPDATE,
  payload: stepArray,
});

export const setIsPedometerAvailable = (isPedometerAvailable) => ({
  type: actionTypes.steps.isPedometerAvailable.UPDATE,
  payload: isPedometerAvailable,
});
