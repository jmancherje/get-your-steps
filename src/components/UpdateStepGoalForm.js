import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Text,
  Button,
} from 'native-base';

export default class SaveRouteForm extends React.Component {
  static propTypes = {
    updateStepGoal: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired, // eslint-disable-line
  };

  state = {
    stepGoal: null,
  }

  handleChange = (stepGoal) => {
    this.setState({ stepGoal });
  };

  handleSave = () => {
    const { stepGoal } = this.state;
    if (stepGoal) {
      this.props.updateStepGoal(parseInt(stepGoal, 10));
      this.props.navigation.goBack();
    }
  };

  render() {
    return (
      <Container>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Daily Step Goal</Label>
              <Input
                autoFocus
                keyboardType="numeric"
                onChangeText={ this.handleChange }
                onSubmitEditing={ this.handleSave }
              />
            </Item>
          </Form>
          <Button
            full
            info
            disabled={ !this.state.stepGoal }
            onPress={ this.handleSave }
          >
            <Text>Confirm</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}
