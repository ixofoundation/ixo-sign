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

const { ActivityCompletion } = NativeModules;

export default class TestSign extends Component<{}> {
  requestCode = 0

  constructor(props) {
    super(props);
    this.state = {
      text: props.content
    };
  }

  async onPress() {
    if (Platform.OS === 'ios') {
      alert('iOS is not currently supported.');
      return;
    }

    ActivityCompletion.finish(
      ActivityCompletion.OK,
      "com.ixosign.SIGNED",
      { content: this.state.text });
  }

  render() {
    if (!this.props.content) {
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
