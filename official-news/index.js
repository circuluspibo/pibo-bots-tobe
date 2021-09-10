const _ = require('lodash');
const yaml = require('js-yaml');
const fs = require('fs');
const cfg = yaml.load(fs.readFileSync(__dirname + '/config.yml', 'utf8'), { json: true });
const moment = require('moment');
const ext_api = require('./ext_api');
const ext_common = require('./ext_common');
const ext_language = require('./ext_filter');

exports.bot = async (param, api) => {
  //공통
  const lang = api.config.get('language');
  const robotId = api.bus.robotId;
  const env = api.config.get('env');
  const config = cfg[env];
  const logger = api.logger;
  const token = param.state.token ? param.state.token : ['뉴스'];
  const cmd = param.state.cmd;
  const clientType = config.CLIENT_TYPE;
  const moduleName = config.MODULE_NAME;
  const capiUrl = config.CAPI_URL;
  const M = ext_common.init(api, lang, moduleName);
  let errCode;

  //개별
  const keywords_noun = param.state.keywords.noun;
  const geoInfo = api.config.get('geo')[0];
  const myCity = geoInfo.address;
  let SIDO = myCity[0];
  let covid_data = false;
  let total_covid_data;
  let mini_SIDO;
  let newsData;
  let topic;
  let topic_ko;

  // const covid_list = ['제주', '경남', '경북', '전남', '전북', '충남', '충북', '강원', '경기', '세종', '울산', '대전', '광주', '인천', '대구', '부산', '서울']
  
  logger.info(moduleName, `! beginTime : ${moment().format('YYYY-MM-DDTHH:mm:ss.SSS')}` );
  logger.info(moduleName, `! robotId : ${robotId}`);
  logger.info(moduleName, `! environment : ${env}`);
  logger.info(moduleName, `! param.state.token : ${token}`);
  logger.info(moduleName, `! param.state.cmd : ${cmd}`);

  // robotId가 undefined 일때
  if (!robotId) {
    logger.error(moduleName, `# noRobotId`);
    ext_common.piboTellWithoutBg(M.t('NO_ROBOT_ID'), 'speak');
    return;
  }

  // 시간
  moment.locale(lang);
  const currentDateMonth = moment().format('MMMM');
  const currentDatedate = moment().format('Do');
  let date = M.t('DATE', { month: currentDateMonth, date: currentDatedate });

  try {
    // request topic
    topic = ext_language.selectTopic(token);
    topic_ko = (M.t(topic.toUpperCase()))
    const covid_keyword = ext_language.clearKeyword(keywords_noun);
    logger.info(moduleName, `# get keyword : ${covid_keyword}`);

    // 지역 코로나를 물어본 경우 해당 지역 찾기
    if (covid_keyword && token.includes('코로나') && topic == 'total') {
      const naver_api = await ext_api.get_naver_api(covid_keyword, config.NAVER_URL, config.NAVER_ID, config.NAVER_KEY);
      if (!naver_api || naver_api.errorMessage || naver_api.addresses.length === 0) {
        ext_common.piboTellWithoutBg(M.t('NO_DATA'), 'speak');
        return
      }
      SIDO = naver_api.addresses[0].roadAddress.split(' ')[0];
    }
    
    // 충청남도 => 충남, 경기도 => 경기, 서울특별시 => 서울, 경상북도 => 경북
    mini_SIDO = SIDO.substring(0,2);
    if (mini_SIDO == '충청' || mini_SIDO == '경상' || mini_SIDO == '전라') {
      mini_SIDO = SIDO.substring(0,1) + SIDO.substring(2,3);
    }
    logger.info(moduleName, `# get covid_data sido : ${mini_SIDO}`);
    
    // 해당 지역 코로나 데이터 받기
    const covid_res = await ext_api.getCovidData(capiUrl, clientType, robotId);
    if (covid_res) {
      covid_data = covid_res.data.response.body.items.item.filter(val => val.gubun == mini_SIDO)[0];
      total_covid_data = covid_res.data.response.body.items.item.filter(val => val.gubun == '합계')[0];
    }

    // 코로나 상황을 물어볼 경우
    if (token.includes('코로나')) {
      if (!covid_data) {
        ext_common.piboTellWithoutBg(M.t('NO_DATA'), 'speak');
        return
      } else {
        let pibo_Tell = M.t('COVID', { SIDO: mini_SIDO, total_cnt: total_covid_data.incDec, cnt: covid_data.incDec });
        pibo_Tell += api.util.sample(Object.values(M.t('COVID_CLOSE')));
        ext_common.piboTell(pibo_Tell, 'speak', 'pibo-resource%sound%news.mp3');
        return
      }
    }

    // 뉴스 데이터 불러오기
    newsData = await ext_api.getNewsData(capiUrl, clientType, robotId, topic)
    if (!newsData) return

    // 데이터 clean
    let cleanData = [];
    newsData.data.forEach((data) => {
      const saveData = ext_language.cleanText(api.util.cleanText(data));
      cleanData.push(saveData);
    });

    // 인트로
    const intro = M.t('INTRO', {
      date: date,
      topic_ko: topic_ko,
    });

    // 바디
    let body = '';
    let threeNewsData = _.sampleSize(cleanData, 3);
    for (let i = 1; i < 4; i++) {
      body += M.t(`TELL_${i}`, { content: threeNewsData[i-1] });
    }

    // 클로즈
    let close;
    if (topic_ko == '종합' && covid_data && covid_data.incDec > 5) {
      close = M.t('COVID', { SIDO: mini_SIDO, total_cnt: total_covid_data.incDec, cnt: covid_data.incDec });
      close += api.util.sample(Object.values(M.t('COVID_CLOSE')));
    } else {
      close = api.util.sample(Object.values(M.t('CLOSE')));
    }
    
    let tell = intro + body + close;
    
    // piboTell
    logger.info(moduleName, `# piboTell_News : ${tell}`);
    ext_common.piboTell(tell, 'speak', 'pibo-resource%sound%news.mp3');

  } catch (err) {
    logger.error(moduleName, `# logic.err : ${err}`);
  }
};

exports.end = (param, api) => {
};