import React, {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    StyleSheet
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class SettingScreen extends Component{
    
    _navigateProfile(){
        this.props.navigation.navigate('ProfileScreen');
    }
    
    _navigate(){
        this.props.navigation.navigate('SomethingScreen');
    }

    _checkLogout(){
        Alert.alert(
            "Alert",
            "Are you sure?",
            [
                {text: 'ok', onPress: this._logout.bind(this)},
                {text: 'cancel', onPress: () => null},
            ],
            { cancelable: true }
        )
    }

    _logout(){
        try {
            AsyncStorage.removeItem('user_id').then(console.log('Data removed'));
        }
        catch(exception) {
            console.log(exception)
        }
        const resetAction = StackActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName: 'AuthScreen' })],
        });
        this.props.navigation.dispatch(resetAction);
    }

    render(){
        return (
            <View style={styles.container}>
                <TouchableOpacity 
                    style={styles.wrapButton}
                    onPress={this._navigateProfile.bind(this)}>
                    <Text>🤗 My profile</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.wrapButton}
                    onPress={this._navigate.bind(this)}>
                    <Text>🏅 Something</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.wrapButton}
                    onPress={this._checkLogout.bind(this)}>
                    <Text>🔓 Logout</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    wrapButton: {
        width: wp('100%'),
        height: hp('8%'),
        paddingLeft: wp('8%'),
        justifyContent: 'center',
        borderBottomWidth: 0.5,
        borderColor: '#ccc',
    }
})