import PropTypes from "prop-types";
import React, {Component} from "react";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import firebase from "firebase";
import "firebase/firestore";

export default class CustomActions extends Component {

  uploadImage = async (uri) => {
    try {
      const blob = await new Promise((resolve, reject) =>{
        const xhr = new XMLHttpRequest();
        xhr.onload = function(){
          resolve(xhr.response);
        };
        xhr.onerror = function(e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
    });

    let uriSections = uri.split("/")
    let image = uriSections[uriSections.length - 1]

    const ref = firebase.storage().ref().child(`${image}`)
    const snapshot = await ref.put(blob);
    blob.close();
    const imgUrl = await snapshot.ref.getDownloadURL();
    return imgUrl;
    } catch(error) {
      console.log(error)
    }
  }

  pickImg = async () => {
    try {
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status === "granted") {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch(error => console.log(error));

        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrl})
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status === "granted") {
      let result = await Location.getCurrentPositionAsync({});
      const longitude = JSON.stringify(result.coords.longitude);
      const latitude = JSON.stringify(result.coords.latitude);
      if (result) {
        this.props.onSend({
          location: {
            longitude: result.coords.longitude,
            latitude: result.coords.latitude
          }
        });
      }
    }
  };

  takePic = async () => {
    try{
    const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
      if (status === "granted") {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images
        }).catch(error => console.log(error));
        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrl})
        }
      }
    } catch(error) {
      console.log(error.message)
    }
  }

  onActionPress = () => {
    const options = [
      "Choose Picture From Library",
      "Take Picture",
      "Send Location",
      "Cancel"
    ];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex
      },
      async buttonIndex => {
        switch (buttonIndex) {
          case 0:
            return this.pickImg();
          case 1:
            return this.takePic();
          case 2:
            return this.getLocation();
          default:
            break;
        }
      }
    );
  };

  render(){
    return (
      <TouchableOpacity style={[styles.container]} onPress={this.onActionPress} >
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center",
  },
 });

CustomActions.contextTypes = {
  actionSheet: PropTypes.func
};