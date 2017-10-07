import { Pedometer } from 'expo';
import React from 'react';
import {
  Slider,
  StyleSheet,
} from 'react-native';
import {
  Text,
  List,
  ListItem,
  Left,
  Body,
} from 'native-base';
import moment from 'moment';

import HourBackBtn from './HourBackBtn';

const hourOptions = [1, 6, 24];

export default class Steps extends React.Component {
  state = {
    isPedometerAvailable: 'checking',
    pastStepCount: 0,
    hoursBack: 1,
    stepsSinceHour: 0,
    currentStepCount: 0,
    realtimeStepData: [],
  };

  componentDidMount() {
    this._subscribe();
    this.getLastHoursSteps();

    const DAY_COUNT = 100;
    const start = new Date();
    start.setMinutes(0);
    start.setSeconds(0);

    for (let i = DAY_COUNT; i >= 0; i--) {
      const nextStart = new Date(start.getTime());
      nextStart.setDate(start.getDate() - i);
      const nextEnd = new Date(nextStart.getTime());
      for (let k = 0; k <= 23; k++) {
        nextStart.setHours(k);
        nextEnd.setHours(k + 1);
        Pedometer.getStepCountAsync(nextStart, nextEnd).then(
          (result) => {
            console.log(`${i} Days ago. ${k}:00 - ${k + 1}:00: ${result.steps} Steps`);
          },
          (error) => {
            console.log('error', error);
          }
        );
      }
    }
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

  handleValueChange = (hoursBack) => {
    this.setState({
      hoursBack,
    });
  };

  handleSlidingComplete = (hoursBack) => {
    this.getLastHoursSteps(hoursBack);
  };

  handlePressButton = (hoursBack) => {
    this.handleValueChange(hoursBack);
    this.handleSlidingComplete(hoursBack);
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
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() - this.state.hoursBack);
    const customValueString = `${this.state.stepsSinceHour} Steps since ${moment(currentTime).format('LT')}`;
    const {
      stepsPerSecond = 0,
      stepsPerMinute = 0,
    } = this.getMovingAverageSteps();

    return (
      <List>
        <ListItem
          itemDivider
          style={ styles.listDivider }
        >
          <Text
            style={ styles.listDividerText }
          >Step Frequency</Text>
        </ListItem>
        <ListItem>
          <Left>
            <Text>
              { stepsPerSecond } Steps/sec
            </Text>
          </Left>
          <Body>
            <Text>
              { stepsPerMinute } Steps/min
            </Text>
          </Body>
        </ListItem>
        <ListItem
          itemDivider
          style={ styles.listDivider }
        >
          <Text
            style={ styles.listDividerText }
          >Custom Step Count</Text>
        </ListItem>
        <ListItem>
          <Text>
            { customValueString }
          </Text>
        </ListItem>
        <ListItem
          itemDivider
          style={ {
            flex: 1,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-around',
            backgroundColor: 'white',
          } }
        >
          { hourOptions.map(hour => (
            <HourBackBtn
              key={ hour }
              hours={ hour }
              handlePress={ this.handlePressButton }
              active={ hour === this.state.hoursBack }
            />
          )) }
        </ListItem>
        <ListItem
          style={ {
            height: 40,
          } }
        >
          <Slider
            onSlidingComplete={ this.handleSlidingComplete }
            onValueChange={ this.handleValueChange }
            step={ 1 }
            minimumValue={ 0 }
            maximumValue={ 24 }
            value={ this.state.hoursBack }
            style={ styles.slider }
          />
        </ListItem>
      </List>
    );
  }
}

const styles = StyleSheet.create({
  slider: {
    width: '100%',
  },
  listDividerText: {
    fontSize: 13,
    fontWeight: '500',
  },
  listDivider: {
    height: 30,
  },
});
