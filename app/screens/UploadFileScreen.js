// Import React in our code
import React, {useState} from 'react';

// Import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
  TouchableHighlight,
} from 'react-native';

// Firebase Storage to upload file
import storage from '@react-native-firebase/storage';
// To pick the file from local file system
import database from '@react-native-firebase/database';

import DocumentPicker from 'react-native-document-picker';

let addItem = item => {
  database().ref('/data').push({
    name: item,
  });
};

const UploadFileScreen = () => {
  // State Defination
  const [loading, setLoading] = useState(false);
  const [filePath, setFilePath] = useState({});
  const [process, setProcess] = useState('');

  const [name, onChangeText] = React.useState('');

  const handleSubmit = () => {
    addItem(name);
    Alert.alert('Item saved successfully');
  };

  const _chooseFile = async () => {
    // Opening Document Picker to select one file
    try {
      const fileDetails = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: 'application/json',
      });
      console.log('fileDetails : ' + JSON.stringify(fileDetails));
      // Setting the state for selected File
      setFilePath(fileDetails);
    } catch (error) {
      setFilePath({});
      // If user canceled the document selection
      alert(
        DocumentPicker.isCancel(error)
          ? 'Canceled'
          : 'Unknown Error: ' + JSON.stringify(error),
      );
    }
  };

  const _uploadFile = async () => {
    try {
      // Check if file selected
      if (Object.keys(filePath).length === 0) {
        return alert('Please Select any File');
      }
      setLoading(true);

      // Create Reference
      console.log(filePath[0].uri.replace('file://', ''));
      console.log(filePath[0].name);
      const reference = storage().ref(`myfiles/${filePath[0].name}`);

      // Put File
      const task = reference.putFile(filePath[0].uri);

      task.on('state_changed', taskSnapshot => {
        setProcess(
          `${taskSnapshot.bytesTransferred} transferred 
           out of ${taskSnapshot.totalBytes}`,
        );
        console.log(
          `${taskSnapshot.bytesTransferred} transferred 
           out of ${taskSnapshot.totalBytes}`,
        );
      });
      task.then(() => {
        alert('Image uploaded to the bucket!');
        setProcess('');
      });
      setFilePath({});
    } catch (error) {
      console.log('Error->', error);
      alert(`Error-> ${error}`);
    }
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.container}>
            <Text style={styles.titleText}>
              Upload Input Text as File on FireStorage
            </Text>
            <View style={styles.container}>
              <Text>Choose File and Upload to FireStorage</Text>
              <Text>{process}</Text>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.buttonStyle}
                onPress={_chooseFile}>
                <Text style={styles.buttonTextStyle}>
                  Choose Image (Current Selected:{' '}
                  {Object.keys(filePath).length === 0 ? 0 : 1})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={_uploadFile}>
                <Text style={styles.buttonTextStyle}>
                  Upload File on FireStorage
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.title}>Create your own JSON File</Text>
            <TextInput
              style={styles.itemInput}
              onChangeText={text => onChangeText(text)}
            />
            <TouchableHighlight
              style={styles.button}
              underlayColor="#000"
              onPress={handleSubmit}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableHighlight>

            <Text style={styles.footerHeading}>
              React Native Firebase Cloud Storage
            </Text>
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

export default UploadFileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: 'orange',
    padding: 10,
    width: 300,
    marginTop: 16,
  },
  buttonTextStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
  footerHeading: {
    fontSize: 18,
    textAlign: 'center',
    color: 'grey',
  },
  footerText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'grey',
  },
  title: {
    marginBottom: 20,
    fontSize: 25,
    textAlign: 'center',
  },
  itemInput: {
    height: 50,
    padding: 4,
    marginRight: 5,
    fontSize: 23,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    color: '#000',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    alignSelf: 'center',
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: '#000',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});
