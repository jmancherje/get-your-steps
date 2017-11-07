import React from 'react';
import {
  Container,
  Header,
  Button,
  Body,
  Title,
  Content,
  Text,
  Footer,
  FooterTab,
} from 'native-base';
import { TabNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';

import Reducer from './src/reducers';
import StepsContainer from './src/containers/StepsContainer';
import LocationContainer from './src/containers/LocationContainer';

// Store configuration
const store = createStore(Reducer, composeWithDevTools(
  applyMiddleware(thunk),
));

class AppWrapper extends React.Component {
  render() {
    return (
      <Container>
        <Header>
          <Body>
            <Title>Steps</Title>
          </Body>
        </Header>
        <Content>
          <LocationContainer />
          <StepsContainer />
        </Content>
        <Footer>
          <Footer>
            <FooterTab>
              <Button full>
                <Text>Hi</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Footer>
      </Container>
    );
  }
}

const Tabs = TabNavigator({
  Steps: {
    screen: AppWrapper,
  },
  Notifications: {
    screen: AppWrapper,
  },
}, {
  tabBarPosition: 'bottom',
  animationEnabled: true,
  tabBarOptions: {
    activeTintColor: '#e91e63',
  },
});


// eslint-disable-next-line react/no-multi-comp
export default class App extends React.Component {
  render() {
    return (
      <Provider store={ store }>
        <Tabs />
      </Provider>
    );
  }
}
