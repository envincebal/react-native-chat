import React, {Component} from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView } from 'react-native';

export default class Chat extends Component {

  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.state.params.name,
    }
  }

  render(){
    return (
    <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: this.props.navigation.state.params.color}}>
      <Text></Text>
    </View>
    );
  }
}


