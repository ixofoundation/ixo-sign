import React, { Component } from 'react';
import {
  Button,
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {Ixo} from "ixo-module";

import * as Keychain from 'react-native-keychain';

import AuthModal from './src/AuthModal';

export default class TestSign extends Component<{}> {
  requestCode = 0


  constructor(props) {
    super(props);
    
    this.state = {
      text: (props.content == undefined || typeof props.content == 'object' ? props.content : JSON.parse(props.content)),
      //text: {message: 'This is a test'},
      username: '',
      password: '',
      service: TestSign._service,
      status: 'no key',
      sovrinDID: '',
      authenticate: false,
    };

    this._onAuthSuccess = this._onAuthSuccess.bind(this);
    this._onAuthCancel = this._onAuthCancel.bind(this);
  }

  signText() {
    const ixo = this.getIxo();
    const sovId = ixo.cryptoUtil.generateSovrinDID(this.state.password);

    var textToSign = {
      did: "0x" + sovId.did,
      data: this.state.text.data,
      template: this.state.text.template
    };

    var signature = ixo.cryptoUtil.getDocumentSignature(
      sovId.secret.signKey, sovId.verifyKey, textToSign);

    console.log('bbb');
    var signDate = (new Date()).toJSON();
    var response = {
      payload: textToSign,
      signature: {
        type: "Ed25519",
        created: signDate,
        publicKey: "0x" + sovId.verifyKey,
        creator: "0x" + sovId.did,
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
    console.log('aaa');
    const { ActivityCompletion } = NativeModules;

    ActivityCompletion.finish(
      ActivityCompletion.OK,
      "com.ixosign.SIGNED",
      response);
  }

  static isString (value) {
    return typeof value === 'string' || value instanceof String;
  };

  getIxo(){
    //Hardcode in some text to sign
    const ixo = new Ixo("https://ixo-node.herokuapp.com");
    console.log('done ixo');
    return ixo;
  }

  static _service = 'IXOSTOREzz';
  loadKey() {
    const ixo = this.getIxo();

    console.log('generated DID');

    let credentialsTemp = {foo:'bar' };
    Keychain
      .getGenericPassword(TestSign._service)
      .then((credentials) => {
        if (credentials) {
          console.log('creds loaded for %s', credentials.username);
          console.log('creds loaded for %s', credentials.password);
          this.setState({ ...credentials, status: 'Credentials exist and loaded!' });
          return Promise.resolve(true);
        } else {
          // OK Nothing in the KeyStore
          // Need to generate new pair...
          this.setState({ status: 'No credentials stored.' });
          // Keychain library always returns string in android, bool in ios, regardless..
          console.log('gen creds');
          const mnemonic = ixo.cryptoUtil.generateMnemonic();
          const sovrinDID = ixo.cryptoUtil.generateSovrinDID(mnemonic);
          console.log('done gen creds');
          console.log("mn: %s", mnemonic);
          console.log(sovrinDID.did);
          credentialsTemp.username = sovrinDID.did;
          credentialsTemp.password = mnemonic;
          this.setState({ ...credentialsTemp, status: 'Credentials generated and loaded!' });
          return Keychain.setGenericPassword(credentialsTemp.username, credentialsTemp.password, TestSign._service);
        }
      }).then((result) => {
        //already set, but Promise is defined in 'd.ts' file ios as bool; android as string.
        // on iOS this is true, on android it's a string when OK....
        if (result === true){
          return Promise.resolve(credentialsTemp);
        }
        if (TestSign.isString(result)){
          return Promise.resolve(credentialsTemp);
        }
        console.log('failed on getGenericPassword');
        return Promise.reject('failed on getGenericPassword');
      })
      .then(credentials => {
        console.log('set the credentials %s', this.state.username);

      })
      .catch((err) => {
        this.setState({ status: 'Could not load nor create credentials. ' + err });
      });
  }

  componentWillMount() {
    this.loadKey();
  }

  render() {
    console.log('cc1')
    if (!this.state.text) {
      return (
        <View style={styles.container}>
          <Text>Nothing to sign!!!</Text>
          <Text>{this.state.status}</Text>
        </View>
      );
    }

    let authModal;
    if (this.state.authenticate) {
      authModal = (
        <AuthModal
          onSuccess={this._onAuthSuccess}
          onCancel={this._onAuthCancel}
        />
      )
    }

    return (
      <View stle={styles.container}>
        <Text style={styles.jsonText}>{JSON.stringify(this.state.text, null, 2)}</Text>
        <View padder style={styles.buttonPanel}>
          <Text style={{ flex: 1}}></Text>
          <Button onPress={() => this.onPress()} title="Sign" />
          <Text style={{ flex: 1 }}></Text>
          <Button onPress={() => this.setState({authenticate: true})} title="Login" />
          <Text style={{ flex: 1 }}></Text>
        </View>
        {authModal}
      </View>
    );
  }
  
  _onAuthSuccess() {
    this.setState({authenticate: false});
    alert('Success!');
  }

  _onAuthCancel() {
    this.setState({authenticate: false});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  buttonPanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  jsonText: Platform.select({
    android: {
      backgroundColor: 'white',
      fontFamily: 'monospace'
    },
    ios: {}
  })
});
