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
  Button,
} from 'native-base';
import moment from 'moment';

import HourBackBtn from './HourBackBtn';

const hourOptions = [1, 12, 24];

export default class Steps extends React.Component {
  static propTypes = {
    hoursBack: PropTypes.number.isRequired,
    stepsSinceHour: PropTypes.number.isRequired,
    realtimeSteps: PropTypes.instanceOf(List).isRequired,
    setIsPedometerAvailable: PropTypes.func.isRequired,
    setRealtimeStepData: PropTypes.func.isRequired,
    setHoursBack: PropTypes.func.isRequired,
    setStepsSinceHour: PropTypes.func.isRequired,
    setHistoricStepData: PropTypes.func.isRequired,
  };
  static defaultProps = {
    realtimeSteps: List(),
  };

  componentDidMount() {
    this._subscribe();
    this.getLastHoursSteps();
    // this.initializeUserStepData();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  initializeUserStepData = () => {
    // TODO: figure out how many days back to measure
    //    or to measure back dynamically depending on the present data
    const DAY_COUNT = 3;

    // i = days back
    for (let i = DAY_COUNT; i >= 0; i--) {
      // k = start hour
      for (let k = 0; k <= 23; k++) {
        const startDate = new Date();
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        const endDate = new Date();
        endDate.setMinutes(0);
        endDate.setSeconds(0);
        // Subtract the number of days
        startDate.setDate(startDate.getDate() - i);
        endDate.setDate(endDate.getDate() - i);
        // Set start hour and end hour 1 hour apart
        startDate.setHours(k);
        endDate.setHours(k + 1);
        Pedometer.getStepCountAsync(startDate, endDate).then(
          // eslint-disable-next-line no-loop-func
          (result) => {
            console.log('steps for ', moment(startDate).format('LT'), result.steps);
            this.props.setHistoricStepData({
              steps: result.steps,
              endDate,
              startDate,
            });
          },
          (error) => {
            // TODO: handle error here
            console.log('error', error);
          }
        );
      }
    }
  };

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
      this.getLastHoursSteps();
    });

    // TODO put this in App.js and use prop to prevent using Pedometer when not available
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

  getLastHoursSteps = (hoursBack = this.props.hoursBack) => {
    const { setStepsSinceHour } = this.props;
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
    this.getLastHoursSteps(hoursBack);
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
          style={ styles.buttonListItem }
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
        <ListItem style={ styles.sliderList }>
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
        <ListItem>
          <Button onPress={ this.initializeUserStepData }>
            <Text>Gather all Past Data</Text>
          </Button>
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
  sliderList: {
    height: 40,
  },
  buttonListItem: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
  },
});
