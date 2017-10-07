import Expo from 'expo';
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
  List,
  ListItem,
} from 'native-base';

import Steps from './src/components/Steps';
import LocationData from './src/components/LocationData';

export default class App extends React.Component {
  render() {
    return (
      <Container>
        <Header>
          <Body>
            <Title>Steps</Title>
          </Body>
        </Header>
        <Content>
          <LocationData />
          <Steps />
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
