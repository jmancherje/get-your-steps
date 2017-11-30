import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Footer,
  FooterTab,
  Text,
  Button,
} from 'native-base';

// const examples = [
//   'Walk to Work',
//   'Walk the dog',
//   'Walking to the gym',
//   'Walking to class',
// ];

// const getRandomPlaceholder = () => {
//   const index = Math.floor(Math.random() * (examples.length ));
//   return examples[index];
// };

export default class SaveRouteForm extends React.Component {
  static propTypes = {
    saveRoute: PropTypes.func.isRequired,
  };

  state = {
    details: null,
    name: null,
  }

  handleNameChange = (name) => {
    this.setState({ name });
  };

  handleDetailsChange = (details) => {
    this.setState({ details });
  };

  handleSave = () => {
    const { name, details } = this.state;
    this.props.saveRoute({ name, details });
  };

  render() {
    return (
      <Container>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Route Name</Label>
              <Input onChangeText={ this.handleNameChange } />
            </Item>
            <Item floatingLabel last>
              <Label>Details (optional..)</Label>
              <Input onChangeText={ this.handleDetailsChange } />
            </Item>
          </Form>
        </Content>
        <Footer>
          <FooterTab>
            <Button
              full
              info
              disabled={ !this.state.name }
              onPress={ this.handleSave }
            >
              <Text>Save</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}
