import React, {Component} from "react";
import {View, Platform, AsyncStorage, YellowBox} from "react-native";
import CustomActions from './CustomActions';
import NetInfo from "@react-native-community/netinfo";
import MapView from "react-native-maps";
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

  /**
    * If user goes offline messages are stored in async storage
    * @function getMessages
    * @return messages
    */

  // pulls messages from asyncStorage
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

    /**
   * Adds the message the firebase database
   * @function addMessage
   * @param {number} _id
   * @param {string} text
   * @param {date} createdAt
   * @param {string} user
   * @param {image} image
   * @param {number} geo - coordinates
   */

  // Adds messages to database
  addMessage = () => {
    let message = this.state.messages[0];
    let {user} = this.state;
    this.referenceMessages.add({
      user,
      _id: message._id,
      image: message.image || null,
      location: message.location || null,
      text: message.text || "",
      createdAt: message.createdAt
    });
  }

    /**
   * deletes messages from asyncStorage. Currently not used but written incase it is needed
   * @async
   * @function deleteMessages
   * @param {none}
   */

  // Deletes stored messages.
  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem("messages");
    } catch (error) {
      console.log(error.message);
    }
  };

    /**
   * Updates the state of the message with the input of the text.
   * @function onCollectionUpdate
   * @param {string} _id
   * @param {string} text - message
   * @param {string} image - uri
   * @param {number} location - location coordinates
   * @param {date} createdAt - date/time of message creation
   * @param {string} user
   */
     
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];

    querySnapshot.forEach((doc) => {
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        image: data.image || null,
        location: data.location,
        createdAt: data.createdAt.toDate(),
        user: data.user
      }); 
    });
    this.setState({
      messages
    });
  };

  // check if user is offline/online
  componentDidMount(){
    const {name} = this.props.navigation.state.params;

    // if user is online
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({
          isConnected: true
        });

        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }
          //update user state with currently active user info
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
        // if user is offline
        this.getMessages();
        console.log("offline");
      }
    });
  }

  // removes user data
  componentWillUnmount(){
    this.authUnsubscribe();
    this.unsubscribeMessageUser();
  }

    /**
  * saves messages to asyncStorage
  * @async
  * @function saveMessagetoStorage
  * @return {Promise<AsyncStorage>} message in asyncStorage
  */

  // saves messages to asyncStorage
  saveMessages = async () => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

    /**
   * @function onSend
   * @param {*} messages - message can be: {message/image/location}
   * @returns {state} updates state with message
   */

     // Sends message and adds it to state and database.
  onSend = (messages = []) => {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessage();
      this.saveMessages();
    });
  }

    /**
   * removes toolbar if internet is not detected
   * @function renderInputToolbar
   * @param {*} props
   * @returns {InputToolbar}
   */

  // If offline, input is removed.
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

  // shows view to allow picture/upload picture/locaiton
  renderCustomActions = (props) => {
    return <CustomActions {...props} />
  }

    /**
   * if currentMessage has location coords then mapview is returned
   * @function renderCustomView
   * @param {*} props
   * @returns {MapView}
   */

  // show user's location
  renderCustomView = (props) => {
    const {currentMessage} = props;
    if (currentMessage.location){
      return (
        <MapView 
        style={{width: 150,
          height: 100,
          borderRadius: 13,
          margin: 3}}
        region={{
          latitude: currentMessage.location.latitude,
          longitude: currentMessage.location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        />
      );
    }
    return null;
  }

  // Sets username from Start.js
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.state.params.name,
    }
  }

  render(){
    return (
    <View style={{flex:1, justifyContent: "center", backgroundColor: this.props.navigation.state.params.color}}>
      <GiftedChat
        renderCustomView={this.renderCustomView}
        renderBubble={this.renderBubble}
        renderActions={this.renderCustomActions}
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


