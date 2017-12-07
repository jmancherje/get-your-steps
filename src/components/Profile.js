import React from 'react';
import { Pedometer } from 'expo';
import { List, Map } from 'immutable';
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
  Right,
  Button,
  Body,
  Header,
  Container,
  Content,
} from 'native-base';
import moment from 'moment';

import sharedStyles from './styles/sharedStyles';

export default class Profile extends React.Component {
  static propTypes = {
    stepsPerSecond: PropTypes.number.isRequired,
    totalSteps: PropTypes.number.isRequired,
    minutesBack: PropTypes.number.isRequired,
    stepsSinceHour: PropTypes.number.isRequired,
    realtimeSteps: PropTypes.instanceOf(List).isRequired,
    setIsPedometerAvailable: PropTypes.func.isRequired,
    updateRealtimeStepData: PropTypes.func.isRequired,
    setMinutesBack: PropTypes.func.isRequired,
    setStepsSinceHour: PropTypes.func.isRequired,
    updateCurrentStepCount: PropTypes.func.isRequired,
    stepResetDate: PropTypes.instanceOf(Date).isRequired,
    resetCurrentStepCount: PropTypes.func.isRequired,
  };

  static defaultProps = {
    realtimeSteps: List(),
  };

  componentDidMount() {
    this._subscribe();
    this.getLastHoursSteps();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _subscribe = () => {
    Pedometer.isAvailableAsync().then(
      (success) => {
        this.props.setIsPedometerAvailable(true);
        this._subscription = Pedometer.watchStepCount((result) => {
          const {
            realtimeSteps,
            updateRealtimeStepData,
            updateCurrentStepCount,
          } = this.props;
          const {
            totalSteps: lastTotalSteps = 0,
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
          updateRealtimeStepData(nextStepData);
          updateCurrentStepCount(nextStepData.get('totalSteps'));
          // Update the steps count based on hours back button/slider
          this.getLastHoursSteps();
        });
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

  getLastHoursSteps = (minutesBack = this.props.minutesBack) => {
    const { setStepsSinceHour } = this.props;
    if (minutesBack < 1) return;
    const end = new Date();
    const start = new Date();
    start.setHours(end.getHours() - minutesBack);
    Pedometer.getStepCountAsync(start, end).then(
      (result) => {
        setStepsSinceHour(result.steps);
      },
      (error) => {
        setStepsSinceHour(0);
      }
    );
  };

  handleValueChange = (minutesBack) => {
    this.props.setMinutesBack(minutesBack);
  };

  handleSlidingComplete = (minutesBack) => {
    this.getLastHoursSteps(this.props.minutesBack);
  };

  handlePressButton = (minutesBack) => {
    this.handleValueChange(minutesBack);
    this.getLastHoursSteps(minutesBack);
  };

  render() {
    const {
      minutesBack,
      stepsSinceHour,
      stepsPerSecond,
      totalSteps,
      stepResetDate,
    } = this.props;
    const currentTime = new Date();
    currentTime.setMinutes(currentTime.getMinutes() - minutesBack);
    const customValueString = `${stepsSinceHour} Steps since ${moment(currentTime).format('LT')}`;

    return (
      <Container>
        <Header>
          <Body><Text style={ sharedStyles.header }>Profile</Text></Body>
        </Header>
        <Content>
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
                  { stepsPerSecond.toFixed(2) } Steps/sec
                </Text>
              </Left>
              <Body>
                <Text>
                  { (stepsPerSecond * 60).toFixed(2) } Steps/min
                </Text>
              </Body>
            </ListItem>
            <ListItem
              itemDivider
              style={ styles.listDivider }
            >
              <Text
                style={ styles.listDividerText }
              >Steps Since Time</Text>
            </ListItem>
            <ListItem>
              <Text>
                { customValueString }
              </Text>
            </ListItem>
            <ListItem style={ styles.sliderList }>
              <Slider
                onSlidingComplete={ this.handleSlidingComplete }
                onValueChange={ this.handleValueChange }
                step={ 20 }
                minimumValue={ 0 }
                maximumValue={ 1440 }
                value={ this.props.minutesBack }
                style={ styles.slider }
              />
            </ListItem>
            <ListItem
              itemDivider
              style={ styles.listDivider }
            >
              <Text
                style={ styles.listDividerText }
              >Steps Since Last Reset</Text>
            </ListItem>
            <ListItem>
              <Left>
                <Text>
                  Total Steps { totalSteps } since { moment(stepResetDate).format('LT') }
                </Text>
              </Left>
              <Right>
                <Button small transparent onPress={ this.props.resetCurrentStepCount }>
                  <Text>Reset Count</Text>
                </Button>
              </Right>
            </ListItem>
          </NbList>
        </Content>
      </Container>
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
