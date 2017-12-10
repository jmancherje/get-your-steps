import React from 'react';
import { NavigationActions } from 'react-navigation';
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

const resetAction = NavigationActions.reset({
  index: 0,
  key: null,
  actions: [NavigationActions.navigate({ routeName: 'Routes' })],
});

export default class SaveRouteForm extends React.Component {
  static propTypes = {
    saveRoute: PropTypes.func.isRequired,
    resetDirections: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired, // eslint-disable-line
  };

  state = {
    name: null,
  }

  handleNameChange = (name) => {
    this.setState({ name });
  };

  handleSave = () => {
    const { name } = this.state;
    this.props.saveRoute({ name });
    this.props.resetDirections(this.props.navigation);
    this.props.navigation.dispatch(resetAction);
  };

  render() {
    return (
      <Container>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Route Name</Label>
              <Input
                onChangeText={ this.handleNameChange }
                onSubmitEditing={ this.handleSave }
                returnKeyType="done"
                autoFocus
              />
            </Item>
          </Form>
          <Button
            full
            info
            disabled={ !this.state.name }
            onPress={ this.handleSave }
          >
            <Text>Confirm</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}
