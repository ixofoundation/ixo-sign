import React, { Component } from 'react';
import {
  Button,
  NativeModules,
  Platform,
  StyleSheet,
  TextInput,
  Text,
  View
} from 'react-native';
import {Ixo} from "ixo-module";

export default class TestSign extends Component<{}> {
  requestCode = 0


  constructor(props) {
    super(props);
    /*
    this.state = {
      text: props.content
    };
    */
    //Hardcode in some text to sign
    this.ixo = new Ixo("https://ixo-node.herokuapp.com");
    var sovrinDID = this.ixo.cryptoUtil.generateSovrinDID(this.ixo.cryptoUtil.generateMnemonic);

    this.state = {
      sovrinDID: sovrinDID,
      text: "{message: 'This is a test'}"
    };
  }

  signText() {
    var signature = this.ixo.cryptoUtil.getDocumentSignature(this.state.sovrinDID.secret.signKey, this.state.sovrinDID.verifyKey, this.state.text);
    var signDate = (new Date()).toJSON();
    var response = {
      content: this.state.text,
      signature: {
        type: "Ed25519",
        created: signDate, 
        publicKey: "0x" + this.state.sovrinDID.verifyKey,
        creator: "0x" + this.state.sovrinDID.did,
        signature: "0x" + signature
      }
    };

    console.log(response);
    return response;
  }

  async onPress() {
    if (Platform.OS === 'ios') {
      console.warn('iOS is not currently supported.');
      return;
    }

    var response = this.signText();

    const { ActivityCompletion } = NativeModules;
    
    ActivityCompletion.finish(
      ActivityCompletion.OK,
      "com.ixosign.SIGNED",
      response);
  }

  render() {
    if (!this.state.text) {
      return (
        <View style={styles.container}>
          <Text>Nothing to sign!</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <TextInput 
          style={{width: '100%'}}
          value={this.state.text} 
          onChangeText={text => this.setState({text: text})} />
        <Button onPress={() => this.onPress()} title="Sign" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
