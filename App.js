import React, {Component} from 'react';
import Start from "./components/Start";
import Chat from "./components/Chat";
import {createAppContainer} from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";

const navigator = createStackNavigator({
  Start: {screen: Start},
  Chat: {screen: Chat}
});

const navigatorContainer = createAppContainer(navigator);

export default navigatorContainer;