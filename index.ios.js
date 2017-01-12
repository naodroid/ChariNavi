/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import RoutePage from './apps/pages/route_page';

//----------------------------
export default class ChariNavi extends Component {
  render() {
    return (
      <RoutePage/>
    );
  }
}

AppRegistry.registerComponent('charinavi', () => ChariNavi);
