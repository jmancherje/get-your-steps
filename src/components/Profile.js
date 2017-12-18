import React from 'react';
import { Pedometer } from 'expo';
import { List, Map } from 'immutable';
import PropTypes from 'prop-types';
import Collapsible from 'react-native-collapsible';
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
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Picker,
} from 'native-base';
import moment from 'moment';
import { range } from 'lodash';

import sharedStyles from './styles/sharedStyles';

export default class Profile extends React.Component {
  static propTypes = {
    stepsPerSecond: PropTypes.number.isRequired,
    totalSteps: PropTypes.number.isRequired,
    stepsSinceHour: PropTypes.number.isRequired,
    realtimeSteps: PropTypes.instanceOf(List).isRequired,
    setIsPedometerAvailable: PropTypes.func.isRequired,
    updateRealtimeStepData: PropTypes.func.isRequired,
    setMinutesBack: PropTypes.func.isRequired,
    setStepsSinceHour: PropTypes.func.isRequired,
    updateCurrentStepCount: PropTypes.func.isRequired,
    stepResetDate: PropTypes.instanceOf(Date).isRequired,
    resetCurrentStepCount: PropTypes.func.isRequired,
    stepGoal: PropTypes.number.isRequired,
    stepsToday: PropTypes.number.isRequired,
    setStepsToday: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired, // eslint-disable-line
    updateStepGoal: PropTypes.func.isRequired,
    updateHeight: PropTypes.func.isRequired,
    height: PropTypes.number.isRequired,
  };

  static defaultProps = {
    realtimeSteps: List(),
  };

  state = {
    minutesBack: 60,
    showSaveForm: false,
    stepGoal: null,
  };

  componentDidMount() {
    this._subscribe();
    this.getLastHoursSteps();
    this.getStepsToday();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _subscribe = () => {
    const {
      realtimeSteps,
      updateRealtimeStepData,
      updateCurrentStepCount,
    } = this.props;
    Pedometer.isAvailableAsync().then(
      (success) => {
        this.props.setIsPedometerAvailable(true);
        this._subscription = Pedometer.watchStepCount((result) => {
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
          this.getStepsToday();
        });
      },
      (error) => {
        console.log('error?', error);
        this.props.setIsPedometerAvailable(false);
      }
    );
  };

  getStepsToday = () => {
    const { setStepsToday } = this.props;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    Pedometer.getStepCountAsync(start, end).then(
      (result) => {
        setStepsToday(result.steps);
      },
      error => {
        console.log('error fetching steps', error);
      }
    );
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  getLastHoursSteps = (minutesBack = this.state.minutesBack) => {
    const { setStepsSinceHour } = this.props;
    if (minutesBack < 1) return;
    const end = new Date();
    const start = new Date();
    start.setMinutes(end.getMinutes() - minutesBack);
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
    this.getLastHoursSteps(this.state.minutesBack);
  };

  handlePressButton = (minutesBack) => {
    this.handleValueChange(minutesBack);
    this.getLastHoursSteps(minutesBack);
  };

  updateMinutesBack = (val) => this.setState({ minutesBack: val });

  handleChange = (stepGoal) => {
    this.setState({ stepGoal });
  };

  showSaveForm = () => {
    this.setState({ showSaveForm: true });
    if (this.inputRef && this.inputRef._root) {
      this.inputRef._root.focus();
    }
  };

  hideSaveForm = () => {
    this.setState({ showSaveForm: false });
  }

  handleSave = () => {
    const { stepGoal } = this.state;
    if (stepGoal) {
      this.props.updateStepGoal(parseInt(stepGoal, 10));
      this.setState({ showSaveForm: false });
      if (this.inputRef && this.inputRef._root) {
        this.inputRef._root.clear();
      }
    }
  };

  inputRef = null;
  setInputRef = (ref) => {
    this.inputRef = ref;
  }

  updateHeight = (inches) => {
    this.props.updateHeight(inches);
  };

  getUpdateStepGoalButton = () => {
    if (!this.state.showSaveForm) {
      return (
        <Button small transparent onPress={ this.showSaveForm } style={ styles.updateBtn }>
          <Text style={ styles.updateBtnText }>
            Update
          </Text>
        </Button>
      );
    }
    return (
      <Button small danger transparent onPress={ this.hideSaveForm } style={ styles.updateBtn }>
        <Text style={ styles.updateBtnText }>
          Cancel
        </Text>
      </Button>
    );
  };

  render() {
    const {
      stepsSinceHour,
      stepsPerSecond,
      totalSteps,
      stepResetDate,
      stepsToday,
      stepGoal,
      height,
    } = this.props;
    const currentTime = new Date();
    currentTime.setMinutes(currentTime.getMinutes() - this.state.minutesBack);
    const customValueString = `${stepsSinceHour} Steps since ${moment(currentTime).format('LT')}`;
    const metStepGoal = stepsToday >= stepGoal;
    const percentageOfGoal = Math.round((stepsToday / stepGoal) * 100);
    return (
      <Container>
        <Content
          keyboardShouldPersistTaps="always"
        >
          <NbList>
            <ListItem
              itemDivider
              style={ styles.listDivider }
            >
              <Text
                style={ styles.listDividerText }
              >My Daily Step Goal</Text>
            </ListItem>
            <ListItem style={ sharedStyles.listStackCorrection }>
              <Left>
                <Text style={ styles.stepGoal }>
                  { stepGoal }
                </Text>
                <Text>
                  Steps Per Day
                </Text>
              </Left>
              <Right>
                { this.getUpdateStepGoalButton() }
              </Right>
            </ListItem>
            <Collapsible
              collapsed={ !this.state.showSaveForm }
            >
              <Form>
                <Item>
                  <Label>Daily Step Goal</Label>
                  <Input
                    ref={ this.setInputRef }
                    keyboardType="numeric"
                    onChangeText={ this.handleChange }
                    onSubmitEditing={ this.handleSave }
                  />
                </Item>
              </Form>
              <Button full primary disabled={ !this.state.stepGoal } onPress={ this.handleSave }>
                <Text>Save Step Goal</Text>
              </Button>
            </Collapsible>
            <ListItem
              itemDivider
              style={ styles.listDivider }
            >
              <Text>Daily Progress</Text>
            </ListItem>
            <ListItem style={ [sharedStyles.listStackCorrection, styles.padLeft] }>
              <Text>
                { metStepGoal ? `Step Goal Met! ${stepsToday} Steps Today` : `${percentageOfGoal}% to your goal, ${stepsToday} Steps / ${stepGoal} Total` }
              </Text>
            </ListItem>
            <ListItem
              itemDivider
              style={ styles.listDivider }
            >
              <Text
                style={ styles.listDividerText }
              >Your Height (Used to estimate steps for a route)</Text>
            </ListItem>
            <ListItem style={ [sharedStyles.listStackCorrection, styles.pickerListItem] }>
              <Form>
                <Picker
                  selectedValue={ height }
                  iosHeader="Select Height"
                  mode="dropdown"
                  textStyle={ { color: '#007AFF' } }
                  onValueChange={ this.updateHeight }
                >
                  { range(48, 84).map(rawInchValue => {
                    const feet = Math.floor(rawInchValue / 12);
                    const inches = rawInchValue % 12;
                    let label = `${feet} foot ${inches} inches`;
                    if (!inches) {
                      label = `${feet} feet`;
                    }
                    return (
                      <Item label={ label } value={ rawInchValue } key={ rawInchValue } />
                    );
                  }) }
                </Picker>
              </Form>
            </ListItem>
            <ListItem
              itemDivider
              style={ styles.listDivider }
            >
              <Text
                style={ styles.listDividerText }
              >Steps Since Time</Text>
            </ListItem>
            <ListItem style={ [sharedStyles.listStackCorrection, styles.padLeft] }>
              <Text>
                { customValueString }
              </Text>
            </ListItem>
            <ListItem style={ [styles.sliderList, sharedStyles.listStackCorrection] }>
              <Slider
                onSlidingComplete={ this.handleSlidingComplete }
                onValueChange={ this.updateMinutesBack }
                step={ 20 }
                minimumValue={ 0 }
                maximumValue={ 1440 }
                style={ styles.slider }
              />
            </ListItem>
            <ListItem
              itemDivider
              style={ styles.listDivider }
            >
              <Text
                style={ styles.listDividerText }
              >Live Step Frequency (Walk to see value update)</Text>
            </ListItem>
            <ListItem style={ sharedStyles.listStackCorrection }>
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
              >Steps Since Last Reset</Text>
            </ListItem>
            <ListItem style={ sharedStyles.listStackCorrection }>
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
  stepGoal: {
    fontWeight: '600',
  },
  padLeft: {
    paddingLeft: 18,
  },
  updateBtnText: {
    fontSize: 12,
    paddingLeft: 0,
    paddingRight: 0,
  },
  updateBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  pickerListItem: {
    height: 47,
    paddingLeft: 0,
  },
});
