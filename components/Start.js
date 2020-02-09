import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput, ImageBackground, TouchableOpacity } from "react-native";

export default class Start extends Component {
  constructor(props){
    super(props);

    this.state = {
      name: "",
      color: null
    } 
  }

  render(){
    return (
      <ImageBackground source={require("../assets/background.png")} style={styles.backgroundImg}> 
        <View style={styles.container}>
          <Text style={styles.chatTitle}>Chat App</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              onChangeText={(name) => { this.setState({name})}}
              value={this.state.name}
              placeholder="Your name" />    
            <Text style={styles.chooseBackgroundText}>Choose Background Color</Text>
            <View style={styles.chooseBackgroundColor}>  
              <TouchableOpacity
                onPress={() => this.setState({ color: "#090C08"})}
                style={[styles.colorButton, styles.color1]}
              />
              <TouchableOpacity
                onPress={() => this.setState({ color: "#474056"})}
                style={[styles.colorButton, styles.color2]}
              />
              <TouchableOpacity
                onPress={() => this.setState({ color: "#8A95A5"})}
                style={[styles.colorButton, styles.color3]}
              />
              <TouchableOpacity
                onPress={() => this.setState({ color: "#B9C6AE"})}
                style={[styles.colorButton, styles.color4]}
              />
            </View>
            <TouchableOpacity
              style={styles.startChat}
              onPress={() => this.props.navigation.navigate("Chat", { name: this.state.name, color: this.state.color })}
            ><Text style={styles.chatButtonText}>Go to Chat</Text></TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1, 
    justifyContent: "center", 
    alignItems: "center"
  },
  backgroundImg: {
    width: "100%",
    height: "100%"
  },
  chatTitle:{
    fontSize: 45,
    fontWeight: "600",
    color: "#fff"
  },
  inputContainer:{
    marginVertical: 70,
    width: 350,
    height: 250,
    backgroundColor: "#fff",
    padding: 10
  },
  textInput: {
    width: "100%",
    height: 50,
    fontWeight: "300",
    opacity: 50,
    fontSize: 24, 
    borderColor: "gray", 
    borderWidth: 1
  },
  chooseBackgroundColor:{
    marginHorizontal: 20,
    flex: 4, 
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between"
  },
  chooseBackgroundText:{
    marginVertical: 15,
    fontSize: 16, 
    fontWeight: "300", 
    color: "#757083", 
    opacity: 100
  },
  colorButton:{
    borderRadius: 100,
    width: 50,
    height: 50
  },
  color1:{
    backgroundColor: "#090C08"
  },
  color2:{
    backgroundColor: "#474056"
  },
  color3:{
    backgroundColor: "#8A95A5"
  },
  color4:{
    backgroundColor: "#B9C6AE"
  },
  startChat: {
    fontWeight: "600",
    backgroundColor: "#757083",
    padding: 15
  },
  chatButtonText:{
    color: "#fff", 
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center"}
});