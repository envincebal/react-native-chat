import React, {Component} from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView } from 'react-native';
import Start from "./components/Start";
import Chat from "./components/Chat";
import {createAppContainer} from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { connectActionSheet } from '@expo/react-native-action-sheet';

const navigator = createStackNavigator({
  Start: {screen: Start},
  Chat: {screen: Chat}
});

const navigatorContainer = createAppContainer(navigator);

export default navigatorContainer;