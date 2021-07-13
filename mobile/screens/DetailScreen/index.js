import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from 'react-native';
export default class DetailScreen extends Component{

    constructor(){
        super();
        this.state={
            bid:0,
            msg:'',
            goods:[],
            pid:0
        }
        this.sendData=this.sendData.bind(this);
    };

    static navigationOptions = ({navigation}) => {
        return{
            title: navigation.getParam('pname')
        };
    };

    componentDidMount(){
        fetch('http://192.249.18.106:80/goods')
        .then(response=>response.json())
        .then(responseJson => this.setState({goods : responseJson}))
        .catch(err =>alert(err));

        this.state.goods.map((item, index)=> {
            if(item.name==navigation.getParam('pname')){
                this.setState({pid:parseInt(item.id.toString())})
            }
        })
    }

    sendData(){
        //() => this.props.navigation.pop()        
        /*fetch('http://192.249.18.106:80/goods')
        .then(response=>response.json())
        .then(responseJson => this.setState({goods : responseJson}))
        .catch(err =>alert(err));


        this.state.goods.map((item, index)=> {
            if(item.name==navigation.getParam('pname')){
                let pid  = item.id
            }
        })*/

        fetch('http://192.249.18.106:80/goods/${this.state.pid}/bid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bid : this.state.bid,
                msg : this.state.msg
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

    render(){
        const {navigation} = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.pname}>{navigation.getParam('pname')}</Text>
                <Text style={styles.price}>시작 가격: {navigation.getParam('price')}</Text>
                <Text>{this.state.pid}</Text>
                <TextInput style={styles.input} placeholder="입찰가격" autoCapitalize="none" onChangeText={(bid)=>this.setState({bid:bid})}></TextInput>
                <TextInput style={styles.input} placeholder="메시지" autoCapitalize="none" onChangeText={(msg)=>this.setState({msg:msg})}></TextInput>
                <TouchableOpacity style={styles.buttonAlt} onPress={this.sendData}>
                    <Text style={styles.buttonAltText}>추가하기</Text>
                </TouchableOpacity>
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
        alignItems: 'center',
    },
    pname: {
        marginTop:16,
        padding:4, 
        color:"black",
        fontSize:40,
        alignItems: 'center',
    },
    price: {
        marginTop:10,
        padding:4, 
        color:"blue",
        fontSize:20,
        alignItems: 'center',
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
})