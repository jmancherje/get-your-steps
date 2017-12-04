export default Object.freeze({
  steps: {
    isPedometerAvailable: {
      UPDATE: 'steps/isPedometerAvailable/UPDATE',
    },
    hoursBack: {
      UPDATE: 'steps/hoursBack/UPDATE',
    },
    stepsSinceHour: {
      UPDATE: 'steps/stepsSinceHour/UPDATE',
    },
    realtimeSteps: {
      UPDATE: 'steps/realtimeSteps/UPDATE',
    },
    currentStepCount: {
      UPDATE: 'steps/currentStepCount/UPDATE',
      RESET: 'steps/currentStepCount/RESET',
    },
    historicData: {
      SET: 'steps/historicData/SET',
    },
  },
  location: {
    locationData: {
      UPDATE: 'location/locationData/UPDATE',
    },
    errorMessage: {
      UPDATE: 'location/errorMessage/UPDATE',
    },
    currentLocation: {
      UPDATE: 'location/currentLocation/UPDATE',
    },
  },
  directions: {
    RESET: 'directions/RESET',
    SAVE: 'directions/SAVE',
    CLEAR_ALL: 'directions/CLEAR_ALL',
    INITIALIZE: 'directions/INITIALIZE',
    DELETE: 'directions/DELETE',
    activeIndex: {
      UPDATE: 'directions/activeIndex/UPDATE',
    },
    searchedRouteOptions: {
      UPDATE: 'directions/searchedRouteOptions/UPDATE',
      RESET: 'directions/searchedRouteOptions/RESET',
    },
    destinations: {
      UPDATE: 'directions/destinations/UPDATE',
      CLEAR_INDEX: 'directions/destinations/CLEAR_INDEX',
      CLEAR: 'directions/destinations/CLEAR',
    },
    map: {
      UPDATE: 'directions/map/UPDATE',
    },
  },
});
