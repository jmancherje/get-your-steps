import { Pedometer } from 'expo';
import React from 'react';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import {
  Slider,
  StyleSheet,
} from 'react-native';
import {
  Text,
  List as NbList,
  ListItem,
  Left,
  Body,
} from 'native-base';
import moment from 'moment';

import HourBackBtn from './HourBackBtn';

const hourOptions = [1, 6, 24];

export default class Steps extends React.Component {
  static propTypes = {
    hoursBack: PropTypes.number.isRequired,
    stepsSinceHour: PropTypes.number.isRequired,
    realtimeSteps: PropTypes.instanceOf(List).isRequired,
    setIsPedometerAvailable: PropTypes.func.isRequired,
    setRealtimeStepData: PropTypes.func.isRequired,
    setHoursBack: PropTypes.func.isRequired,
    setStepsSinceHour: PropTypes.func.isRequired,
  };
  static defaultProps = {
    realtimeSteps: List(),
  };

  componentDidMount() {
    this._subscribe();
    this.getLastHoursSteps();

    const DAY_COUNT = 7;
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
            // console.log(`${i} Days ago. ${k}:00 - ${k + 1}:00: ${result.steps} Steps`);
          },
          (error) => {
            // console.log('error', error);
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
        realtimeSteps,
        setRealtimeStepData,
      } = this.props;
      const {
        totalSteps: lastTotalSteps,
        time: lastTimeStamp,
      } = realtimeSteps.get(realtimeSteps.size - 1, Map()).toJS();

      const currentDate = new Date();
      const currentTime = currentDate.getTime();
      const nextStepData = Map({
        stepIncrement: result.steps - lastTotalSteps,
        time: currentTime,
        timeIncrement: typeof lastTimeStamp === 'number' ? currentTime - lastTimeStamp : 0,
        totalSteps: result.steps,
      });
      setRealtimeStepData(realtimeSteps.push(nextStepData));
    });

    // TODO put this in App.js
    Pedometer.isAvailableAsync().then(
      (result) => {
        this.props.setIsPedometerAvailable(true);
      },
      (error) => {
        this.props.setIsPedometerAvailable(false);
      }
    );
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  getLastHoursSteps = () => {
    const { hoursBack, setStepsSinceHour } = this.props;
    if (hoursBack < 1) return;
    const end = new Date();
    const start = new Date();
    start.setHours(end.getHours() - hoursBack);
    Pedometer.getStepCountAsync(start, end).then(
      (result) => {
        setStepsSinceHour(result.steps);
      },
      (error) => {
        setStepsSinceHour(0);
      }
    );
  };

  handleValueChange = (hoursBack) => {
    this.props.setHoursBack(hoursBack);
  };

  handleSlidingComplete = (hoursBack) => {
    this.getLastHoursSteps(this.props.hoursBack);
  };

  handlePressButton = (hoursBack) => {
    this.handleValueChange(hoursBack);
    this.handleSlidingComplete(hoursBack);
  };

  getMovingAverageSteps = () => {
    const { realtimeSteps } = this.props;
    if (realtimeSteps.size < 3) return {};
    const endStepData = realtimeSteps.get(realtimeSteps.length - 1);
    const startStepData = realtimeSteps.get(realtimeSteps.length - 3);
    const {
      time: startTime,
      totalSteps: startSteps,
    } = startStepData.toJS();
    const {
      time: endTime,
      totalSteps: endSteps,
    } = endStepData.toJS();
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
    currentTime.setHours(currentTime.getHours() - this.props.hoursBack);
    const customValueString = `${this.props.stepsSinceHour} Steps since ${moment(currentTime).format('LT')}`;
    const {
      stepsPerSecond = 0,
      stepsPerMinute = 0,
    } = this.getMovingAverageSteps();

    return (
      <NbList>
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
              active={ hour === this.props.hoursBack }
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
            value={ this.props.hoursBack }
            style={ styles.slider }
          />
        </ListItem>
      </NbList>
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
