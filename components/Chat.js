import React, {Component} from "react";
import { StyleSheet, Text, View, TextInput, Button, ScrollView, Platform, AsyncStorage, YellowBox } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import {GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import KeyboardSpacer from "react-native-keyboard-spacer";
const firebase = require("firebase");
require("firebase/firestore");

export default class Chat extends Component {
  constructor(props){
    super(props);
    YellowBox.ignoreWarnings(["Setting a timer"]);
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyByZOCLQcMciuiV4nUUYH6OEAetuKBP24k",
        authDomain: "test-7dadc.firebaseapp.com",
        databaseURL: "https://test-7dadc.firebaseio.com",
        projectId: "test-7dadc",
        storageBucket: "test-7dadc.appspot.com",
        messagingSenderId: "900068761325"
      });
    }

    this.state = {
      messages: [],
      user: {
        _id: "",
        name: "",
        avatar: ""
      },
      isConnected: false
    } 
  }

  getMessages = async () => {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  addMessage() {
    let message = this.state.messages[0];
    let {user} = this.state;
    this.referenceMessages.add({
      user,
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt
    });
  }

  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem("messages");
    } catch (error) {
      console.log(error.message);
    }
  };

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];

    querySnapshot.forEach((doc) => {
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user
      }); 
    });
    this.setState({
      messages
    });
  };

  componentDidMount(){
    const {name} = this.props.navigation.state.params;

    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({
          isConnected: true
        });

        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }
          
          this.setState({
            user: {
              _id: user.uid,
              name,
              avatar: "https://placeimg.com/140/140/any"
            }
          });
          
          this.referenceMessages = firebase.firestore().collection("messages");  
          this.unsubscribeMessageUser = this.referenceMessages.onSnapshot(this.onCollectionUpdate);
        }); 
        console.log("online");
      } else {
        this.getMessages();
        console.log("offline");
      }
    });
  }

  componentWillUnmount(){
    this.authUnsubscribe();
    this.unsubscribeMessageUser();
  }


  saveMessages = async () => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessage();
      this.saveMessages();
    });
  }

  renderInputToolbar = (props) => {
    if (!this.state.isConnected) {
    } else {
      return( 
        <InputToolbar
        {...props}
        />
      );
    }
  }

  renderBubble = (props) => {
    return (
      <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#123458'
        },
        left: {
          backgroundColor: '#6495ED'
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
        renderInputToolbar={this.renderInputToolbar}
        messages={this.state.messages}
        user={this.state.user}
        onSend={messages => this.onSend(messages)}
      /> 
 
      {Platform.OS === "android" ? <KeyboardSpacer /> : null } 
    </View>
    );
  }
}


