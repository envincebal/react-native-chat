import PropTypes from "prop-types";
import React, {Component} from "react";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import firebase from "firebase";
import "firebase/firestore";

export default class CustomActions extends Component {

   /*
     * uploading image as blob to cloud storage
     * @async
     * @function uploadImage
     * @param {string}
     * @returns {string} url
     */
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

   /**
     * requests permission to pick  from photo library. sends url to uploadImage and onSend
     * @async
     * @function pickImg
     * 
     */

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

   /**
     * requests permission for user location
     * @async
     * @function getLocation
     * @returns {Promise<number>}
     */
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

      /**
     * requests permission for camera to take photo as the state and returns uri string. Sends uri string to uploadImage and onSend function
     * @async
     * @function takePic
     * @returns {Promise<string>} uri - sent to onSend and uploadImage
     */

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

      /**
     * When + is pressed actionSheet is called
     * @function onActionPress
     * @returns {actionSheet} - with options to choose from library, take photo, or send location
     */
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