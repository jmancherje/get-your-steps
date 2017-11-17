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
    activeIndex: {
      UPDATE: 'directions/activeIndex/UPDATE',
    },
    searchedRouteOptions: {
      UPDATE: 'directions/searchedRouteOptions/UPDATE',
      RESET: 'directions/searchedRouteOptions/RESET',
    },
    destinations: {
      UPDATE: 'directions/destinations/UPDATE',
    },
    currentSearch: {
      origin: {
        UPDATE: 'directions/currentSearch/origin/UPDATE',
        CLEAR: 'directions/currentSearch/origin/CLEAR',
      },
      destination: {
        UPDATE: 'directions/currentSearch/destination/UPDATE',
        CLEAR: 'directions/currentSearch/destination/CLEAR',
      },
    },
  },
});
