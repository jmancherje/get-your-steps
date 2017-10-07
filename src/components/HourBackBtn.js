import { Pedometer } from 'expo';
import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
} from 'react-native';
import {
  Text,
  Button,
} from 'native-base';

export default class HourBackBtn extends React.Component {
  static propTypes = {
    handlePress: PropTypes.func.isRequired,
    hours: PropTypes.number.isRequired,
    active: PropTypes.bool.isRequired,
  };

  state = {
    isPedometerAvailable: 'checking',
    pastStepCount: 0,
    hoursBack: 24,
    stepsSinceHour: 0,
    currentStepCount: 0,
    realtimeStepData: [],
  };

  componentDidMount() {
    this._subscribe();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _subscribe = () => {
    this._subscription = Pedometer.watchStepCount((result) => {
      const {
        totalSteps: lastTotalSteps,
        time: lastTimeStamp,
      } = this.state.realtimeStepData[this.state.realtimeStepData.length - 1] || {};

      const currentDate = new Date();
      const currentTime = currentDate.getTime();
      const nextStepData = {
        stepIncrement: result.steps - lastTotalSteps,
        time: currentTime,
        timeIncrement: typeof lastTimeStamp === 'number' ? currentTime - lastTimeStamp : 0,
        totalSteps: result.steps,
      };
      this.setState({
        currentStepCount: result.steps,
        realtimeStepData: this.state.realtimeStepData.concat(nextStepData),
      });
    });

    Pedometer.isAvailableAsync().then(
      (result) => {
        this.setState({
          isPedometerAvailable: String(result)
        });
      },
      (error) => {
        this.setState({
          isPedometerAvailable: `Could not get isPedometerAvailable: ${error}`
        });
      }
    );

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1);
    Pedometer.getStepCountAsync(start, end).then(
      (result) => {
        this.setState({ pastStepCount: result.steps });
      },
      (error) => {
        this.setState({
          pastStepCount: `Could not get stepCount: ${error}`
        });
      }
    );
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  getLastHoursSteps = (hoursBack = this.state.hoursBack) => {
    if (hoursBack < 1) return;
    const end = new Date();
    const start = new Date();
    start.setHours(end.getHours() - hoursBack);
    Pedometer.getStepCountAsync(start, end).then(
      (result) => {
        this.setState({
          stepsSinceHour: result.steps,
        });
      },
      (error) => {
        this.setState({
          stepsSinceHour: 0,
        });
      }
    );
  };

  handlePress = () => {
    this.props.handlePress(this.props.hours);
  };

  handleSlidingComplete = (hoursBack) => {
    this.getLastHoursSteps(hoursBack);
  };

  getMovingAverageSteps = () => {
    const { realtimeStepData } = this.state;
    if (realtimeStepData.length < 3) return {};
    const endStepData = realtimeStepData[realtimeStepData.length - 1];
    const startStepData = realtimeStepData[realtimeStepData.length - 3];
    const {
      time: startTime,
      totalSteps: startSteps,
    } = startStepData;
    const {
      time: endTime,
      totalSteps: endSteps,
    } = endStepData;
    const stepIncrement = endSteps - startSteps;
    const timeIncrement = endTime - startTime;
    const stepsPerSecond = (stepIncrement / timeIncrement) * 1000;
    return {
      stepsPerSecond: stepsPerSecond.toFixed(2),
      stepsPerMinute: (stepsPerSecond * 60).toFixed(2),
      stepsPerHour: (stepsPerSecond * 3600).toFixed(2),
    };
  };

  render() {
    const { hours, active } = this.props;
    return (
      <Button
        rounded
        light={ !active }
        success={ active }
        key={ hours }
        onPress={ this.handlePress }
        style={ styles.button }
      >
        <Text
          style={ styles.text }
        >
          { `${hours} hr${hours === 1 ? '' : 's'} ago` }
        </Text>
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    textAlign: 'center',
  },
  button: {
    width: '28%',
    justifyContent: 'space-around',
  },
});
