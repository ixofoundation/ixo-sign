import React from "react";
import { Image } from 'react-native';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, View } from "native-base";
import {Ixo} from 'ixo-module';

export default class SigningScreen extends React.Component {

    static navigationOptions = {
        header: null
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
      

}
