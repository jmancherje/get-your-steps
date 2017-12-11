import { AsyncStorage } from 'react-native';

import actionTypes from './actionTypes';

export const updateStepGoal = (steps) => async (dispatch, getState) => {
  try {
    await AsyncStorage.setItem('stepGoal', JSON.stringify(steps));

    dispatch({
      type: actionTypes.profile.stepGoal.UPDATE,
      payload: steps,
    });
  } catch (err) {
    console.log(err);
  }
};

export const updateHeight = (inches) => async (dispatch, getState) => {
  try {
    await AsyncStorage.setItem('height', JSON.stringify(inches));

    dispatch({
      type: actionTypes.profile.height.UPDATE,
      payload: inches,
    });
  } catch (err) {
    console.log(err);
  }
};
