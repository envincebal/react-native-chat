import React, {Component} from "react";
import { StyleSheet, Text, View, TextInput, Button, ScrollView, Platform } from "react-native";
import {GiftedChat, Bubble} from "react-native-gifted-chat";
import KeyboardSpacer from "react-native-keyboard-spacer";

export default class Chat extends Component {
  constructor(props){
    super(props);

    this.state = {
      messages: []
    }
  }

  componentDidMount(){
    const {name} = this.props.navigation.state.params;
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
         },
         {
          _id: 2,
          text: "Hello " + name + "! You have entered the chat.",
          createdAt: new Date(),
          system: true,
         },
      ]
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  renderBubble = (props) => {
    return (
      <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000"
        }
      }} 
      />
    )
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.state.params.name,
    }
  }

  render(){
    return (
    <View style={{flex:1, justifyContent: "center", backgroundColor: this.props.navigation.state.params.color}}>
      <GiftedChat
        renderBubble={this.renderBubble}
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      /> 
      {Platform.OS === "android" ? <KeyboardSpacer /> : null } 
    </View>
    );
  }
}


