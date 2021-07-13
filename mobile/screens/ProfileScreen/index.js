import React, {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
    View,
    Text,
    Button,
    StyleSheet
} from 'react-native';
export default class ProfileScreen extends Component{

    constructor(){
        super();
        this.state={
            user_id : '',
            profiles:[],
        }
    };

    componentDidMount(){
        fetch('http://192.249.18.106:80/users')
        .then(response=>response.json())
        .then(responseJson => this.setState({profiles : responseJson}))
        .catch(err =>alert(err));

        AsyncStorage.getItem('user_id').then((value)=>{this.setState({user_id:value})});
    }

    render(){
        return (
            <View style={styles.container}>
                {
                    this.state.profiles.map((item, index)=> {
                        return ((item.email==this.state.user_id)&&<Text style={styles.intro}>
                            이름 : {item.nick}{"\n"}
                            이메일: {item.email}{"\n"}
                            잔액: {item.money}원</Text>)
                    })
                }
                <Button
                    title='back'
                    onPress={() => this.props.navigation.goBack()} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    intro: {
        padding:4, 
        color:"black",
        fontSize:20,
        marginBottom:16
    },
})