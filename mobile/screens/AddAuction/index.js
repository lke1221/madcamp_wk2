import React, { useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';

const AddAuction = ({navigation}) => {

    const [pname, setPname] = useState('');
    const [price, setPrice] = useState('');

    const sendData = () => {
        fetch('http://192.249.18.106:80/goods', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
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

        //this.props.navigation.goBack()
    }

    return(
        <View style={styles.inputs}>
            <TextInput style={styles.input} placeholder="물건 이름" autoCapitalize="none" onChangeText={setPname}></TextInput>
            <TextInput style={styles.input} placeholder="가격" autoCapitalize="none" onChangeText={setPrice}></TextInput>
            <TouchableOpacity style={styles.buttonAlt} onPress={sendData}>
                <Text style={styles.buttonAltText}>추가하기</Text>
            </TouchableOpacity>
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