import actionTypes from './actionTypes';

export const setMinutesBack = (minutes) => ({
  type: actionTypes.steps.minutesBack.UPDATE,
  payload: minutes,
});

export const setStepsSinceHour = (steps) => ({
  type: actionTypes.steps.stepsSinceHour.UPDATE,
  payload: steps,
});

export const setStepsToday = (steps) => ({
  type: actionTypes.steps.stepsToday.UPDATE,
  payload: steps,
});

export const updateRealtimeStepData = (stepPayload) => ({
  type: actionTypes.steps.realtimeSteps.UPDATE,
  payload: stepPayload,
});

export const setIsPedometerAvailable = (isPedometerAvailable) => ({
  type: actionTypes.steps.isPedometerAvailable.UPDATE,
  payload: isPedometerAvailable,
});

export const setHistoricStepData = (historicData) => ({
  type: actionTypes.steps.historicData.SET,
  payload: historicData,
});

export const updateCurrentStepCount = (totalSteps) => ({
  type: actionTypes.steps.currentStepCount.UPDATE,
  payload: totalSteps,
});

export const resetCurrentStepCount = () => ({
  type: actionTypes.steps.currentStepCount.RESET,
});
