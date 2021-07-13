import React, { useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, Button } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

const AddAuction = (props) => {

    const [pname, setPname] = useState('');
    const [price, setPrice] = useState('');
    const [singleFile, setSingleFile] = useState(null);


    const uploadImage = async () => {
        // Check if any file is selected or not
        if (singleFile != null) {
          // If file selected then create FormData
          const fileToUpload = singleFile;
          const data = new FormData();
          data.append('name', 'Image Upload');
          data.append('file_attachment', fileToUpload);
          // Please change file upload URL
          let res = await fetch(
            'http://192.249.18.106:80/img',
            {
              method: 'post',
              body: data,
              headers: {
                'Content-Type': 'multipart/form-data; ',
              },
            }
          );
          let responseJson = await res.json();
          if (responseJson.status == 1) {
            alert('Upload Successful');
          }
        } else {
          // If no file selected the show alert
          alert('Please Select File first');
        }
      };
    
    const selectFile = async () => {
        // Opening Document Picker to select one file
        try {
          const res = await DocumentPicker.pick({
            // Provide which type of file you want user to pick
            type: [DocumentPicker.types.allFiles],
            // There can me more options as well
            // DocumentPicker.types.allFiles
            // DocumentPicker.types.images
            // DocumentPicker.types.plainText
            // DocumentPicker.types.audio
            // DocumentPicker.types.pdf
          });
          // Printing the log realted to the file
          console.log('res : ' + JSON.stringify(res));
          // Setting the state to show single file attributes
          setSingleFile(res);
        } catch (err) {
          setSingleFile(null);
          // Handling any exception (If any)
          if (DocumentPicker.isCancel(err)) {
            // If user canceled the document selection
            alert('Canceled');
          } else {
            // For Unknown Error
            alert('Unknown Error: ' + JSON.stringify(err));
            throw err;
          }
        }
    };

    const sendData = () => {
        //() => this.props.navigation.pop()
        fetch('http://192.249.18.106:80/goods', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ownerId : AsyncStorage.getItem('user_num'),
                name : pname,
                price : price
            }),
        })
        .then(async res => { 
            try {
                const jsonRes = await res.json();
                if (res.status !== 200) {
                    console.log("failed");
                } else {
                    console.log("success");
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    }

    return(
        <View style={styles.inputs}>
            <TextInput style={styles.input} placeholder="물건 이름" autoCapitalize="none" onChangeText={setPname}></TextInput>
            <TextInput style={styles.input} placeholder="가격" autoCapitalize="none" onChangeText={setPrice}></TextInput>
            {/*Showing the data of selected Single file*/}
            {singleFile != null ? (
                <Text style={styles.textStyle}>
                    File Name: {singleFile.name ? singleFile.name : ''}
                    {'\n'}
                    Type: {singleFile.type ? singleFile.type : ''}
                    {'\n'}
                    File Size: {singleFile.size ? singleFile.size : ''}
                    {'\n'}
                    URI: {singleFile.uri ? singleFile.uri : ''}
                    {'\n'}
                </Text>
            ) : null}
            <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={selectFile}>
                <Text style={styles.buttonTextStyle}>Select File</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={uploadImage}>
                <Text style={styles.buttonTextStyle}>Upload File</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonAlt} onPress={sendData}>
                <Text style={styles.buttonAltText}>추가하기</Text>
            </TouchableOpacity>
            <Button
                    title='back'
                    onPress={() => props.navigation.goBack()}/>
        </View>
    );

};

const styles = StyleSheet.create({
    inputs: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        //paddingTop: '10%',
    },  
    input: {
        width: '80%',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        paddingTop: 10,
        fontSize: 16, 
        minHeight: 40,
    },
    buttonAlt: {
        width: '80%',
        borderWidth: 1,
        height: 40,
        borderRadius: 50,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
    },
    buttonAltText: {
        color: 'black',
        fontSize: 16,
        fontWeight: '400',
    },
});

export default AddAuction;