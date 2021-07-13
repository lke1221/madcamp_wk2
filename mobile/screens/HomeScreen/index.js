import React, {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Button,
    Platform,
    TouchableOpacity,
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

    _navigateAdd(){
        this.props.navigation.push('AddAuction');
    }

    _navigateDetails(pname, price){
        this.props.navigation.navigate({routeName: 'DetailScreen', params : {pname:pname, price:price}});
    }

    constructor(){
        super();
        this.state={
            user_id : '',
            text: '',
            profiles:[],
            goods:[],
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
                        return ((item.email==this.state.user_id)&&<Text style={styles.intro}>안녕하세요 {item.nick}님!{"\n"}
                        잔액은 {item.money}원 입니다</Text>)
                    })
                }
                <TouchableOpacity style={styles.buttonAlt} onPress={this._navigateAdd.bind(this)}>
                        <Text style={styles.buttonAltText}>경매 추가하기</Text>
                </TouchableOpacity>
                <View style={styles.goods}>
                {
                    this.state.goods.map((item, index)=>{
                        return <TouchableOpacity key={index} style={styles.items} onPress={this._navigateDetails.bind(this, item.name, item.price)}>
                                    <Text style={styles.item}> 품목 : {item.name} </Text>
                                    <Text style={styles.item}> 최초 가격 : {item.price} </Text>
                        </TouchableOpacity>
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
    scroll:{
        marginTop:16, 
        backgroundColor:'gray',
    }, 
    items: {
        padding: 10,
        borderWidth: 0.25,
        borderColor: "#000",
    },
    item: {
        padding: 2,
        fontSize: 18,
    },
    goods: {
        marginTop:16, 
        //padding: 10,
        fontSize: 18,
        borderWidth: 0.25,
        borderColor: "#000"
    },
    intro: {
        padding:4, 
        color:"black",
        fontSize:20,
        marginBottom:16
    },
    buttonAlt: {
        width: '100%',
        borderWidth: 1,
        height: 50,
        borderRadius: 50,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
        backgroundColor : '#023e71'
    },
    buttonAltText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '400',
    },
})