// const assert = require('assert');
const axios = require("axios");
const moment = require("moment");
const readline = require('readline');
const { exec } = require('child_process');


// 입력 조건 체크
const args = process.argv.slice(2);
if (args.length < 2) {
    console.log("");
    console.log('usage) node test.js {mode} {serial}');
    console.log('       - mode: dev | stg | ops');
    console.log('       - serial: robot serial code');
    return;
}

// 로봇 메타 조회
const checkMeta = (_ENV, _RSC) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://${_ENV.toLowerCase()}-rapi.circul.us/v1/robot/${_RSC}`, {
            headers: {
                'x-client-type': '08f12867e7a16b1b9071ae92ca8b6e7e1698068f',
                'x-client-id': '5d9031d36ad9bf03c0045ac5',
                Accept: 'application/json',
            },
        })
        .then((r1) => {
            console.log(JSON.stringify(r1.data));
            // {"result":true,"data":{"_userId":"pibotest5575","connectedTime":1625552563238,"createdAt":"2021-07-06T06:22:43.239Z","geoDic":{"lat":37.4813072,"lng":126.8765524,"x":58,"y":125,"address":["서울특별시","금천구","가산동"]},"fwVer":"FWN200312A","osVer":"1976-05-26","robotId":"60e3f6b3e8765800118a0381","tempUnit":"celsius","updatedAt":"2021-08-06T05:41:40.517Z","_robotId":"1000000025d25575"}}

            if (r1.data.result){
                const _UID = r1.data.data._userId;

                axios.get(`https://${_ENV.toLowerCase()}-rapi.circul.us/v1/user/${_UID}`, {
                    headers: {
                        'x-client-type': '08f12867e7a16b1b9071ae92ca8b6e7e1698068f',
                        'x-client-id': '5d9031d36ad9bf03c0045ac5',
                        Accept: 'application/json',
                    },
                })
                .then((r2) => {
                    console.log(JSON.stringify(r2.data));
                    // {"result":true,"data":{"birthDate":"2021-07-01","createdAt":"2021-07-06T06:21:47.144Z","emailAddr":"bmyi@circul.us","emailVerified":true,"firstName":"병민","lastName":"이","nickName":"병민","robotConnected":true,"robotId":"60e3f6b3e8765800118a0381","updatedAt":"2021-07-06T06:24:23.041Z","userId":"60e3f67be8765800118a0380","_userId":"pibotest5575"}}

                    if (r2.data.result){
                        r1.data.data.birthDate = r2.data.data.birthDate;
                        resolve(r1.data);
                    }
                    else {
                        r1.data.data.birthDate = "2000-01-01";
                        resolve(r1.data);
                    }
                })
                .catch((e2) => {
                    console.log(e2.stack);
                    resolve({ result: false, data: e2 });
                });
            }
            else {
                const warnMsg = `${_RSC} not available!`;
                console.log(warnMsg);
                resolve({ result: false, data: warnMsg });
            }
        })
        .catch((e1) => {
            console.log(e1.stack);
            resolve({ result: false, data: e1 });
        });  
    });
};


const indexjs = require('./index');
const configjs = require('./config');
const lang_ko = require('./lang_ko.json')
const title = configjs.init.title.ko;


let r;
for (let x=0; x < configjs.init.example.ko.length; x++) {
    console.log(`${x+1} : ${configjs.init.example.ko[x]}`)
}
r = readline.createInterface({
    input:process.stdin,
    output:process.stdout
}),
r.on('line', function(line) {
    const input_value = configjs.init.example.ko[line-1];
    const cache = {};
    const util = {};
    util.sample = (arr) => {
        let key = JSON.stringify(arr);
        
        if (
            cache[key] == undefined ||
            (cache[key] != undefined && cache[key].length == 0)
            ) {
                cache[key] = JSON.parse(JSON.stringify(arr));
            } else if (cache[key].length == 1) {
                return cache[key].pop();
            }
            
            let point = ~~(Math.random() * cache[key].length);
            let item = cache[key][point];
            cache[key].splice(point, 1);
            return item;
    };
    
        
    const logger = {};
    logger.info = (moduleNm, msg) => {
        console.log(moduleNm + '|' + msg);
    };
    logger.warn = (moduleNm, msg) => {
        console.log(moduleNm + '|' + msg);
    };
    logger.error = (moduleNm, msg) => {
        console.log(moduleNm + '|' + msg);
    };

    const config = {};

    const extend = {};
    extend.getMusicList = () => {
        return []
    };

    util.cleanText = (t) => {
      return t
        .replace(/  /g, '.')
        .replace(/ ^` /g, ',')
        .replace(/ ^` /g, ',')
        .replace(/ ^`^|/g, '"')
        .replace(/ ^`^}/g, '"')
        .replace(/ ^`^x/g, "'")
        .replace(/ ^`^}/g, ' ^`^y')
        .replace(/&quot;/g, '"')
        .replace(/&nbsp;/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\[.*\]/gi, '')
        .replace(/\<.*\>/gi, '')
        .replace(/\(.*\)/gi, '')
        .replace(/ *\([^)]*\) */g, '')
        .replace(/(\n|\r\n)/g, ' ')
        .replace(
          /[\u2e80-\u2eff\u31c0-\u31ef\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fbf\uf900-\ufaff]/gi,
          '',
        )
        .replace(/#/g, ' ')
        .replace(/&/g, ' ')
        .replace(/~/g, ' ')
        // .replace(
        //   /[^ \r\n ^d - ^e^n ^e^o- ^e   ^`- ^~ a-zA-Z0-9~!@#$%^&*()_+|{}:"<>?`\-=\\[\];',.\/]/gi,
        //   ' ',
        // )
        .replace(/  /g, ' ')
        .replace(/\"/g, ' ')
        .replace(/ \./g, '.');
    };
    
    
    const pibo = {};
    pibo.tell = (msg) => {
        console.log('pibo.tell : '+msg);
    }
    pibo.play = (query, cb_motion) => {
      const param = {category: query.query.category}
        if (query.query.src) {
          param.src = query.query.src
        }
        axios.get(`https://${args[0].toLowerCase()}-capi.circul.us/v1/audio`, {
            headers: {
                'x-client-type': '08f12867e7a16b1b9071ae92ca8b6e7e1698068f',
                'x-client-id': '5d9031d36ad9bf03c0045ac5',
                Accept: 'application/json',
            },
            params: param
        }).then((r1) => {
          console.log(r1.data)
          // exec(`start ${r1.data.data}`)
        }).catch(err=>{
          console.log(err)
        })
    }
    
    const state = (a, b) => {
        return
    }
    
    const play = {};
    play.event = (data) => {
        // console.log('event : '+data)
        return
    }
    
    const heart = (data) => {
        console.log('heart : '+data)
    }
    
    const motion = (data) => {
        console.log('motion : '+data)
    }
    
    const input_value_replace = input_value.replace('파이보','').replace(', ','').replace('들려줘', '').replace('!','')
    const bot = Object.keys(lang_ko)[0];
    const token = [];
    const keywords = {"noun":[],"location":[],"human":[]};
    const text = input_value;
    const noun = {};
    const input_value_split = input_value_replace.split(' ')
    input_value_split.pop()
    for (let value of input_value_split) {
        token.push(value)
        keywords.noun.push(value)
        noun[value] = 1
    }


    // 로봇 메타 정상 조회 시, index 로직 실행
    checkMeta(args[0], args[1])
    .then((r1) => {
        if (r1.result){
            const _ROID = r1.data.robotId;
            const _UAGE = parseInt(moment().format('YYYY')) - parseInt(r1.data.birthDate.split('-')[0]) + 1;
            config.get = (target) => {
                if (target == 'language'){
                    return 'ko'
                } else if (target == 'env') {
                    return args[0].toUpperCase()
                } else if (target == 'geo') {
                    return [{'lat': r1.data.geoDic.lat, 'lng': r1.data.geoDic.lng, 'x': r1.data.geoDic.x, 'y': r1.data.geoDic.y, 'address': r1.data.geoDic.address}]
                }
            };

            const param = {"state": {"bot": bot, "cmd": "_START", "prev": "undefined", "next": "undefined", "keywords": keywords, "text": text, "noun": noun, "token": token, "lastTime": 1613544508067}, "log": {"state": {"bot": bot, "cmd": "_START", "prev": "undefined", "next": "undefined", "keywords": keywords, "text": text, "noun": noun, "token": token, "lastTime": 1613544508067}}}
            console.log(JSON.stringify(param));
            const api = {"config": config, "bus": {"robotId": `${_ROID}`, "age": `${_UAGE}`, "nickName": "테스트"}, "logger": logger, "util": util, "extend": extend, "pibo": pibo, "state": state, "play": play, "heart": heart, "motion": motion}
            console.log(JSON.stringify(api));
            console.log("");

            indexjs.bot(param, api);
            r.close();
        }
        else {
            console.log(`${args[0]} robot-${args[0]} meta invalid!`);
        }
    })
    .catch((e1) => {
        console.log(e1);
    });
})

/*
    {"result":true,"data":{"_userId":"pibotest5575","connectedTime":1625552563238,"createdAt":"2021-07-06T06:22:43.239Z","geoDic":{"lat":37.4813072,"lng":126.8765524,"x":58,"y":125,"address":["서울특별시","금천구","가산동"]},"fwVer":"FWN200312A","osVer":"1976-05-26","robotId":"60e3f6b3e8765800118a0381","tempUnit":"celsius","updatedAt":"2021-08-06T05:41:40.517Z","_robotId":"1000000025d25575"}}
    {"result":true,"data":{"birthDate":"2021-07-01","createdAt":"2021-07-06T06:21:47.144Z","emailAddr":"bmyi@circul.us","emailVerified":true,"firstName":"병민","lastName":"이","nickName":"병민","robotConnected":true,"robotId":"60e3f6b3e8765800118a0381","updatedAt":"2021-07-06T06:24:23.041Z","userId":"60e3f67be8765800118a0380","_userId":"pibotest5575"}}


    [FAIL CASE 1]

    {"state":{"bot":"OFFICIAL_TRAVEL","cmd":"_START","prev":"undefined","next":"undefined","keywords":{"noun":["여행","정보"],"location":[],"human":[]},"text":"파이보, 여행 정보 알려줘.","noun":{"여행":1,"정보":1},"token":["여행","정보"],"lastTime":1613544508067},"log":{"state":{"bot":"OFFICIAL_TRAVEL","cmd":"_START","prev":"undefined","next":"undefined","keywords":{"noun":["여행","정보"],"location":[],"human":[]},"text":"파이보, 여행 정보 알려줘.","noun":{"여행":1,"정보":1},"token":["여행","정보"],"lastTime":1613544508067}}}
    {"config":{},"bus":{"robotId":"60e3f6b3e8765800118a0381","age":"1"},"logger":{},"util":{},"extend":{},"pibo":{},"play":{}}

    BOT_TRAVEL|$ beginTime : 2021-08-06T19:10:49.899
    BOT_TRAVEL|! param.text : 파이보, 여행 정보 알려줘.
    BOT_TRAVEL|! param.cmd : _START
    BOT_TRAVEL|! param.state.value => typeId: 12, id: 2390225
    i18next: 1.664ms
    myCity [ '서울특별시', '동작구', '사당동' ]
    BOT_TRAVEL|! capi.o : https://stg-capi.circul.us/v1/travel/areaBasedList | {"lang":"ko","areaCode":1,"sigunguCode":12} | 200 | 46
    BOT_TRAVEL|! capi.o : https://stg-capi.circul.us/v1/travel/areaBasedList | {"lang":"ko","contentTypeId":39,"areaCode":1,"sigunguCode":12} | 200 | 22
    BOT_TRAVEL|! capi.o : https://stg-capi.circul.us/v1/travel/detailIntro | {"lang":"ko","contentTypeId":39,"introYN":"Y","contentId":2644304} | 200 | 1
    intro :  INTRO_BASIC close : CLOSE_BASIC body : BODY_RANDOM
    pibo.tell : <speak><prosody rate='70%'>파이보가 널 위한 서울 동작구 지역 유명한 여행 정보를 <sub alias='알려줄께'>알려줄게</sub>! <break time="0.8s"/> 첫 번째, 문화시설 CTS아트홀. 두 번째, 역사시설 호국지장사. 세 번째, 휴양시설 용양봉저정 공원이 있고, 근처에 생고기 맛집 친구네정육식당도 있어.<break time="0.5s"/> 파이보랑 친구네정육식당에 같이 가자!</prosody></speak>


    [FAIL CASE 2]

    {"state":{"bot":"OFFICIAL_TRAVEL","cmd":"_START","prev":"undefined","next":"undefined","keywords":{"noun":["맛집","정보"],"location":[],"human":[]},"text":"파이보, 맛집 정보 알려줘.","noun":{"맛집":1,"정보":1},"token":["맛집","정보"],"lastTime":1613544508067},"log":{"state":{"bot":"OFFICIAL_TRAVEL","cmd":"_START","prev":"undefined","next":"undefined","keywords":{"noun":["맛집","정보"],"location":[],"human":[]},"text":"파이보, 맛집 정보 알려줘.","noun":{"맛집":1,"정보":1},"token":["맛집","정보"],"lastTime":1613544508067}}}
    {"config":{},"bus":{"robotId":"60e3f6b3e8765800118a0381","age":"1"},"logger":{},"util":{},"extend":{},"pibo":{},"play":{}}

    BOT_TRAVEL|$ beginTime : 2021-08-06T19:11:23.977
    BOT_TRAVEL|! param.text : 파이보, 맛집 정보 알려줘.
    BOT_TRAVEL|! param.cmd : _START
    BOT_TRAVEL|! param.state.value => typeId: 12, id: 2390225
    i18next: 1.599ms
    myCity [ '서울특별시', '동작구', '사당동' ]
    BOT_TRAVEL|! capi.o : https://stg-capi.circul.us/v1/travel/areaBasedList | {"lang":"ko","contentTypeId":39,"areaCode":1,"sigunguCode":12} | 200 | 22
    BOT_TRAVEL|! capi.o : https://stg-capi.circul.us/v1/travel/detailIntro | {"lang":"ko","contentTypeId":39,"introYN":"Y","contentId":2645156} | 200 | 1
    BOT_TRAVEL|! capi.o : https://stg-capi.circul.us/v1/travel/detailIntro | {"lang":"ko","contentTypeId":39,"introYN":"Y","contentId":2689480} | 200 | 1
    BOT_TRAVEL|! capi.o : https://stg-capi.circul.us/v1/travel/detailIntro | {"lang":"ko","contentTypeId":39,"introYN":"Y","contentId":714209} | 200 | 1
    intro :  INTRO_FOOD close : CLOSE_BASIC body : BODY_FOOD
    pibo.tell : <speak><prosody rate='70%'>파이보가 널 위한 서울 동작구 지역 맛집 정보를 <sub alias='알려줄께'>알려줄게</sub>!<break time="0.8s"/> 첫 번째, 칼국수 맛집 김광분의풀향기손칼국수. 두 번째, 소금 막창구이 / 양념 막창구이 맛집 왕곱창막창집. 새 번째, 족발 맛집 장충족발이 있어.<break time="0.5s"/> 파이보랑 김광분의풀향기손칼국수에 같이 가자!</prosody></speak>


    [PASS CASE 1 /w data]

    {"state":{"bot":"OFFICIAL_TRAVEL","cmd":"_START","prev":"undefined","next":"undefined","keywords":{"noun":["역사","여행","정보"],"location":[],"human":[]},"text":"파이보, 역사 여행 정보 알려줘.","noun":{"역사":1,"여행":1,"정보":1},"token":["역사","여행","정보"],"lastTime":1613544508067},"log":{"state":{"bot":"OFFICIAL_TRAVEL","cmd":"_START","prev":"undefined","next":"undefined","keywords":{"noun":["역사","여행","정보"],"location":[],"human":[]},"text":"파이보, 역사 여행 정보 알려줘.","noun":{"역사":1,"여행":1,"정보":1},"token":["역사","여행","정보"],"lastTime":1613544508067}}}
    {"config":{},"bus":{"robotId":"60e3f6b3e8765800118a0381","age":"1"},"logger":{},"util":{},"extend":{},"pibo":{},"play":{}}

    BOT_TRAVEL|$ beginTime : 2021-08-06T19:11:55.702
    BOT_TRAVEL|! param.text : 파이보, 역사 여행 정보 알려줘.
    BOT_TRAVEL|! param.cmd : _START
    BOT_TRAVEL|! param.state.value => typeId: 12, id: 2390225
    i18next: 1.685ms
    myCity [ '서울특별시', '동작구', '사당동' ]
    params :  {
        lang: 'ko',
        cat1: 'A02',
        cat2: 'A0201',
        areaCode: 1,
        sigunguCode: 12
    }
    BOT_TRAVEL|! capi.o : https://stg-capi.circul.us/v1/travel/areaBasedList | {"lang":"ko","cat1":"A02","cat2":"A0201","areaCode":1,"sigunguCode":12} | 200 | 3
    intro :  INTRO_CATEGORY close : CLOSE_BASIC body : BODY_CATEGORY
    pibo.tell : <speak><prosody rate='70%'>파이보가 가볼 만한 서울 동작구 지역 역사 여행 정보를 <sub alias='알려줄께'>알려줄게</sub>!<break time="0.8s"/> 첫 번째, 달마사. 두 번째, 국립서울현충원. 세 번째, 호국지장사가 있어.<break time="0.5s"/> 파이보랑 국립서울현충원에 같이 가자!</prosody></speak>


    [PASS CASE 2 /w no data]

    {"state":{"bot":"OFFICIAL_TRAVEL","cmd":"_START","prev":"undefined","next":"undefined","keywords":{"noun":["자연","여행","정보"],"location":[],"human":[]},"text":"파이보, 자연 여행 정보 알려줘.","noun":{"자연":1,"여행":1,"정보":1},"token":["자연","여행","정보"],"lastTime":1613544508067},"log":{"state":{"bot":"OFFICIAL_TRAVEL","cmd":"_START","prev":"undefined","next":"undefined","keywords":{"noun":["자연","여행","정보"],"location":[],"human":[]},"text":"파이보, 자연 여행 정보 알려줘.","noun":{"자연":1,"여행":1,"정보":1},"token":["자연","여행","정보"],"lastTime":1613544508067}}}
    {"config":{},"bus":{"robotId":"60e3f6b3e8765800118a0381","age":"1"},"logger":{},"util":{},"extend":{},"pibo":{},"play":{}}

    BOT_TRAVEL|$ beginTime : 2021-08-06T19:12:25.448
    BOT_TRAVEL|! param.text : 파이보, 자연 여행 정보 알려줘.
    BOT_TRAVEL|! param.cmd : _START
    BOT_TRAVEL|! param.state.value => typeId: 12, id: 2390225
    i18next: 2.87ms
    myCity [ '서울특별시', '동작구', '사당동' ]
    params :  { lang: 'ko', cat1: 'A01', areaCode: 1, sigunguCode: 12 }
    BOT_TRAVEL|! capi.o : https://stg-capi.circul.us/v1/travel/areaBasedList | {"lang":"ko","cat1":"A01","areaCode":1,"sigunguCode":12} | 200 | 0
    get Data :: category :: err =  no data in basic data
    intro :  INTRO_CATEGORY close : CLOSE_BASIC body : BODY_CATEGORY
    pibo.tell : <speak><prosody rate='70%'>미안해, 서울 동작구 지역에는 자연 여행 정보가 없어.</prosody></speak>


    [ISSUE RELATED LOGICS]

    ext_make_tell_info.js
    console.log('intro : ', intro, 'close :', close, 'body :', body);

    ext_basic_func.js
    logger.info(moduleNm, `# getGetData.res.status: ${res.status}`);

    api.pibo.tell(...)
    console.log('pibo.tell : '+msg);


    [ISSUE SUMMARY]

    PASS : capi.areaBasedList 1회 호출로 응답 처리했을 경우
    FAIL : capi.detailIntro 추가 1회 이상 호출 후에 응답 처리했을 경우

      # async ~ await mismatch case 8건
        # index.js : 1건 (exports.bot = (param, api) => {)
        # ext_make_tell_info.js : 6건 (// const getDetailFoodDataWithFood = async (info, dataBox, cb) => {)
        # ext_get_data.js : 1건 (const makeKey = (basic, reqData, result, makeValue, piboTell) => {)

      # async ~ callback problem case 2건
        # ext_get_data.js : 2건 (random, food)

      # renewal guide
        # async ~ callback : Promise
        # async.filter : {array}.reduce|find
        # async.map : {array}.map + Promise.all
*/
