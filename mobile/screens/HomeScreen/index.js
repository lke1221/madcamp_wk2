import React, {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Button,
    Platform,
    TextInput
} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { launchImageLibrary } from 'react-native-image-picker';

const createFormData = (photo, body = {}) => {
    const data = new FormData();
  
    data.append('photo', {
      name: photo.fileName,
      type: photo.type,
      uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
    });
  
    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });
  
    return data;
  };


export default class HomeScreen extends Component{

    _navigate(){
        this.props.navigation.navigate('AddAuction');
    }

    constructor(){
        super();
        this.state={
            user_id : '',
            user_name : '',
            text: '',
            profiles:[],
            goods:[],
            user_money : 0,
            photo : null
        }
    };

    /*handleChoosePhoto(){
        launchImageLibrary({ noData: true }, (response) => {
          if (response) {
            this.setState({photo : response})
          }
        });
    };

    handleUploadPhoto = () => {
        fetch('192.249.18.106/img', {
          method: 'POST',
          body: createFormData(this.state.photo, { userId: '123' }),
        })
          .then((response) => response.json())
          .then((response) => {
            console.log('response', response);
          })
          .catch((error) => {
            console.log('error', error);
          });
    };*/

    componentDidMount(){
        fetch('http://192.249.18.106:80/users')
        .then(response=>response.json())
        .then(responseJson => this.setState({profiles : responseJson}))
        .catch(err =>alert(err));

        fetch('http://192.249.18.106:80/goods')
        .then(response=>response.json())
        .then(responseJson => this.setState({goods : responseJson}))
        .catch(err =>alert(err));

        AsyncStorage.getItem('user_id').then((value)=>{this.setState({user_id:value})});
    }

    render(){
        return (
            <ScrollView style={styles.container}>
                {
                    this.state.profiles.map((item, index)=> {
                        return ((item.email==this.state.user_id)&&<Text style={styles.text}>안녕하세요 {item.name}님!{"\n"}
                        잔액은 {item.money}원 입니다</Text>)
                    })
                }
                <Button title="경매 추가하기" onPress={this._navigate.bind(this)}/>
                <View style={styles.goods}>
                {
                    this.state.goods.map((item, index)=>{
                        return <View key={index} style={styles.item}>
                                    <Text> 품목 : {item.name} </Text>
                                    <Text> 최초 가격 : {item.price} </Text>
                        </View>
                    })
                }
                </View>
                {/*<Button title="Upload Photo" onPress={this.handleUploadPhoto} />
                <Button title="Choose Photo" onPress={this.handleChoosePhoto} />*/}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp('5%'),
        backgroundColor: 'white',
    },
    wrapContent: {
        width: wp('90%'),
        height: wp('90%'),
        paddingBottom: wp('5%'),
        
    },
    content: {
        width: "100%",
        height: "100%",
        backgroundColor: "#46c3ad",
    },
    scroll:{
        marginTop:16, 
        backgroundColor:'gray',
    },
    text: {
        padding:4, 
        color:"black",
        fontSize:20
    }, 
    item: {
        padding: 10,
        fontSize: 18,
        //height: 44,
        borderWidth: 0.25,
        borderColor: "#000",
        //flexDirection:'row'
    },
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
    goods: {
        marginTop:16, 
        //padding: 10,
        fontSize: 18,
        borderWidth: 0.25,
        borderColor: "#000"
      },
})