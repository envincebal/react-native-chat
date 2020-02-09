import React, {Component} from 'react';
import Start from "./components/Start";
import Chat from "./components/Chat";
import {createAppContainer} from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";

//navigation on app. start.js set name and background pic for Chat.js
const navigator = createStackNavigator({
  Start: {screen: Start},
  Chat: {screen: Chat}
});

const navigatorContainer = createAppContainer(navigator);

export default navigatorContainer;