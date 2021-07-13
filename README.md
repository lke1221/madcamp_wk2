
# RNAuction

실시간 경매 시스템 

## 팀원 
[이권은](https://github.com/lke1221), [이홍기](https://github.com/alexhonggi/)

## Abstract

서버의 **실시간 양방향 소통이 가능한 점**과
데이터베이스를 통한 **데이터 공유**에 착안하여, 
실시간으로 다인이 경매에 참여할 수 있는 플랫폼을 만들고자 하였으나..

## Blueprint
- 세 개의 모델, **사용자 모델**, **상품 모델**,  **경매 모델**을 이용하여, 사용자가  
(1) **회원가입 및 로그인** 할 수 있으며, 가진 돈을 설정할 수 있다.  
(2) 내부 저장소와 카메라를 이용하여 **물건을 찍어 등록**할 수 있고, **이름과 가격을 설정**할 수 있다.  
(3) 상품 목록을 선택하여 **경매 모델로 진입**할 수 있으며, **입찰가와 메시지**를 선택하여 베팅할 수 있다.  
(4) ** SSE(server-sent event) ** 를 사용하여 경매 참여자의 **시간을 동기화**할 수 있고  
(5) **Socket.io**를 이용하여 **실시간으로 입찰 정보**를 올릴 수 있다.  
(6) **node-schedule**을 이용하여 **경매 시작 시간과 종료 시간**을 조율할 수 있고  
(7) 낙찰 여부를 확정, 개인의 프로필에서 **낙찰 목록**을 열람할 수 있다. 

## Server

### Models 
1. Users: 사용자 모델
 

```js
module.exports = (sequelize, DataTypes) => {
   return sequelize.define('users', {
       email: {
           type: DataTypes.STRING(40),
           allowNull: false,
           unique: true,
       },
       nick: {
           type: DataTypes.STRING(15),
           allowNull: false,
       },
       password: {
           type: DataTypes.STRING(100),
           allowNull: true,
       },
       money: {
           type: DataTypes.INTEGER,
           allowNull: false,
           defaultValue: 100000,
       },
...
```

2. Goods: 상품 모델  
```js
        name: { type: DataTypes.STRING(40), allowNull: false, },
        img: { type: DataTypes.STRING(200), allowNull: true, },
        price: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0,},
```
3. Auction: 경매 모델
```js
        bid: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, },
        msg: { type: DataTypes.STRING(100), allowNull: true, },
```

### Routes
1. Auth
```js 
router.post('/login', (req, res, next) => {
    console.log("로그인 시도 중...")
    User.findOne({ where : {
        email: req.body.email, 
    }})
    .then(dbUser => {
        if (!dbUser) {
            return res.status(404).json({message: "user not found"});
        } else {
            // password hash
            bcrypt.compare(req.body.password, dbUser.password, (err, compareRes) =>
       ...
            else if (compareRes) { // password match
            const token = jwt.sign({ email: req.body.email }, 'secret', { expiresIn: '1h' });
            res.status(200).json({message: "user logged in", "token": token});
            // res.render('main', { user: req.user });
            console.log("로그인 성공!...")
       ...
});

```
2. index: **프런트엔드**의 스크린을 위해 지정된 경로 작성  

`/goods` - **상품 모델**, 경매에 올릴 물건의 정보를 프런트로부터 받아 DB에 기록한다.
```js
router.post('/goods', upload.single('img'), async (req, res, next) => {
  try {
    const { ownerId, name, price } = req.body;
    const good = await Good.create({
      ownerId: req.user.id,
      name, 
      img: null,
      price,
  ...
```  
`/goods/:id/bid` - **경매 모델**, 입찰 정보를 프런트로부터 받아 DB에 기록하고, 조건에 맞지 않은 부분은 걸러낸다.

```js
router.post('/goods/:id/bid', async (req, res, next) => {
  try {
    const { bid, msg } = req.body;
    const good = await Good.findOne({
      where: { id: req.params.id },
      include: { model: Auction },
      order: [[{ model: Auction }, 'bid', 'DESC']],
    });
    if (good.price > bid) { 
    // 시작 가격보다 낮게 입찰하면
    
    // 경매 종료 시간이 지났으면
    
    // 직전 입찰가와 현재 입찰가 비교
    
    const result = await Auction.create({
      bid,
      msg,
      userId: req.user.id,
      goodId: req.params.id,
    });

    req.app.get('io').to(req.params.id).emit('bid', {
      bid: result.bid,
      msg: result.msg,
      nick: req.user.nick,
    });
    return res.send('ok');
  ...
});
```
### App.js
DB의 정보를 서버를 통해 클라이언트에 전달할 수 있도록, 다양한 경로를 설정하였다.
```js
app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
```

## Front

### HomeScreen.js  
`goods.db`에서 json형식으로 내용을 불러와서 화면에 띄우는 부분이다.  
`TouchableOpacity` 속성을 부여하여 눌렀을 때 **DetailScreen**으로 이동하도록 한다.


```js
                    this.state.goods.map((item, index)=>{
                        return <TouchableOpacity key={index} style={styles.items} onPress={this._navigateDetails.bind(this, item.name, item.price)}>
                                    <Text style={styles.item}> 품목 : {item.name} </Text>
                                    <Text style={styles.item}> 최초 가격 : {item.price} </Text>
                        </TouchableOpacity>
                    })
```  

`componentDidMount`는 화면이 처음 mount될 때 실행된다.  
`fetch` 는 method를 생략할 경우 `GET`이 디폴트값인데, 정보를 가져온다. 정보를 올리는 것은 `POST`이다.
```js
    componentDidMount(){
        fetch('http://192.249.18.106:80/goods')
        .then(response=>response.json())
        .then(responseJson => this.setState({goods : responseJson}))
        .catch(err =>alert(err));
    }
```

### AddAuction.js  
서버에 정보를 올리는 부분이다.  
**'경매 추가하기'** 버튼을 누르면 실행되는 함수로, 품목과 최초 가격을 서버에 전송한다.
```js
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
     ...
```
### AuthScreen.js  
Login 버튼과 Signup 버튼이 번갈아서 보이는 부분의 코드이다.

```js
        fetch(`${API_URL}/${isLogin ? 'login' : 'signup'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
```
로그인 화면이면 이름을 등록하지 않는 `textinput`이 보이지 않고,  
 로그인 화면이 아닐 경우 (= 회원가입 화면일 경우) `textinput`이 보인다.

```js
{!isLogin && <TextInput style={styles.input} placeholder="Name" onChangeText={setName}></TextInput>}
```

## 난관에 봉착했다.

### 이미지 업로드

**Server-side**
  
1. **헤더** 형식  
: fetch 메서드의 헤더 형식이 기본적으로 `application/json` 이었으나,  
  이미지를 사용하기 위해 `multipart/form-data` 로 바꾸어도 에러가 발생함.
2. **Multer** - 상품 이미지 업로드 기능 구현하기   
: Multer로 미들웨어를 구현하여, 이미지 선택 시 먼저 업로드를 진행하고, 판매글 작성 시 이미지 주소를 저장하고자 함.   
  하나의 사진을 첨부할 시 req.file 객체를 생성하여, req.file.filename으로 이미지를 특정하고,  
  upload.single 미들웨어는 이미지를 처리, req.file 객체에 결과를 저장하고자 하였다.
```js
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/good', isLoggedIn, upload.single('img'), async (req, res, next) => {
...
``` 

- 링크만 보내 저장할 수 없을까?
: 내부 저장소의 이미지(경매에 제출할 물건)을 모든 참가자가 공유하려면 서버에 이미지를 업로드하는 작업이 반드시 필요하였음.

**Client-side**  

1. **react-native-document-picker**  
: file-picker를 이용하여 내부 저장소에서 사진을 선택, 서버에 업로드하고자 하였으나  
서버에 업로드하는 core code가 php로 구성되어 있고, 더불어 CodeIgniter의 사용이 필요해 중단하였음.
```js
const res = await DocumentPicker.pick({
    type: [DocumentPicker.types.allFiles],
});
this.setState({ singleFile: res });
```

2. **image-picker** 사용  
: image-picker를 사용하는 방식을 사용하고자 하였고, 개별 이미지에 대해 실험을 해보았으나  
데이터베이스의 다른 항목과 함께 보내는 방식을 성공하지 못하였음.
```js
router.post('/img', upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({url: `/img/${req.file.filename}`});
})
```

 


### 데이터베이스 모델 연결

3개의 모델(유저, 상품, 경매)에 4개의 연결이 존재.   

`ownerId` , `soldId` : 유저 - 상품 간 연결   
`userId` : 유저 - 경매 정보 간 연결  
`goodId`: 상품 - 경매 정보 간 연결
  

ex) `ownerId`  = `req.user.id` 
**associated** 된 관계 간에는 데이터베이스의 행 생성 시 자동으로 관계가 갱신되지만, 그렇지 못한 상황이 발생.  

**다음**과 같은 해결책을 시도해보았습니다. 
1. `req.user`  를 `res.local.user`에 대입하여 로컬 서버에서 변수를 처리.
2. `auth.js` 에서 `/login` 과정 시, jwt token이 통과하는 상황에서 `user.id`를 따로 저장.  
: `res.render` 를 사용하고자 하였으나, 웹과 달리 `ejs`를 사용해야 하는 어려움이 있었다.  
`const`로 정의하여 `router/index.js`에서 `import` 하고자 하였으나 모듈 에러로 _실패_.  
`require`로 불러오려 했지만 역시 _실패_.  
`config.json`에서 `main`을 `app.js`로 설정하여 `app.use()`로 전달하고자 하였으나 _실패_.
3. SQL Workbench를 사용하지 않고 sequelize로만 디자인하고자 하였으나  
 req.user를 불러오지 못하는 것은 동일.
4. SQL Workbench로만, 그리고 sequelize를 사용하여 디자인해보았으나  
DB에 ownerId가 associated 되지 않는 문제가 지속적으로 발생하였습니다. 

 
- 연결을 하지 않고 디자인해본다면?  

`ownerId`를 `req.user.id`로 정의하지 않고, 단독 변수로 정의하여 보았지만, 다음과 같은 문제가 발생.
1. 상품 모델의 데이터베이스에 제대로 된 값이 들어가지 않음. 
2. 상품 모델과 베팅 정보가 연결되지 않음.
3. `id`를 auto-increment 설정하여, 잘못된 값 입력 시 상품의 `id`와 방이 가리키는 링크가 일치하지 않음.
 


## 어려웠던 점
   **자료와 참고문헌의 부재.**  
특히, 서버 - 클라이언트 간의 상호작용을 설명해주는 자료가 부족했다.  
문제점이 발생했을 때, 문제 발생의 원인이 **서버**인지 **클라이언트** 부분인지 파악하는 데 많은 시행착오가 있었다.
## 시간이 더 있었다면..

1. SSE(Server-Sent-Event)를 이용해 경매 참여자들의 시간 동기화
```js
module.exports = (server) => {
    const sse = new SSE(server);
    sse.on('connection', (client) => {
        setInterval(() => {
            client.send(new Date().valueOf().toString());
        }, 1000);
    });
};
```
2. Socket.io를 연결하여 실시간으로 입찰 정보 올리기
```js
io.on('connection', (socket) => {
        const req = socket.request;
        const { headers: { referer } } = req;
        const roomId = referer.split('/')[referer.split('/').length - 1];
        socket.join(roomId);
        socket.on('disconnect', () => {
            socket.leave(roomId);
        });
    });
```
3. node-schedule을 이용하여 경매 시간 설정하기
```js
    end.setDate(end.getDate() + 1); // 하루 뒤
    schedule.scheduleJob(end, async () => {
      const success = await Auction.find({
        where: { goodId: good.id },
        order: [['bid', 'DESC']],
      });
      await Good.update({ soldId: success.userId }, { where: { id: good.id } });
      await User.update({
        money: sequelize.literal(`money - ${success.bid}`),
      }, {
        where: { id: success.userId },
      });
    });
```
4. 설정된 시간이 다한 후 낙찰자의 낙찰 목록 구현하기
```js
try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const targets = await Good.findAll({
      where: {
        soldId: null,
        createdAt: { $lte: yesterday },
      },
    });
    ...
    await Good.update({ soldId: success.userId }, { where: { id: target.id } });
    await User.update({
      money: sequelize.literal(`money - ${success.bid}`),
    }, {
      where: { id: success.userId },
    });
```
