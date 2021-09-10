//const M = require('i18next');
const _ = require('lodash');
const yaml = require('js-yaml');
const fs = require('fs');
const moment = require('moment');
const cfg = yaml.load(fs.readFileSync(__dirname + '/config.yml', 'utf8'), {json: true});
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
  const token = param.state.text ? param.state.text : '명상';
  const cmd = param.state.cmd;
  const clientType = config.CLIENT_TYPE;
  const moduleName = config.MODULE_NAME;
  const capiUrl = config.CAPI_URL + '/v1/audio';
  const M = ext_common.init(api, lang, moduleName)
  let errCode;
  
  //개별
  let meditationData;
  let title;
  let len;
  let topic;
  const userNickName = api.bus.nickName;

  logger.info(moduleName, `! beginTime : ${moment().format('YYYY-MM-DDTHH:mm:ss.SSS')}` );
  logger.info(moduleName, `! robotId : ${robotId}`);
  logger.info(moduleName, `! environment : ${env}`);
  logger.info(moduleName, `! param.state.token : ${token}`);
  logger.info(moduleName, `! param.state.cmd : ${cmd}`);
 

  if (!robotId) {
    logger.error(moduleName, `# noRobotId`);
    ext_common.piboTellWithoutBg(M.t('NO_ROBOT_ID'), 'speak');
    return;
  }
  try {
    topic = ext_language.selectTopic(token)
    let [introment, closement] = ext_language.selectMent(topic)
    meditationData = await ext_api.getMeditationData(capiUrl,robotId,clientType,topic);
    if (!meditationData) return

    title = meditationData.metadata.title;
    len = meditationData.metadata.len;

    logger.info(moduleName, `! TITLE : ${title}`);
    logger.info(moduleName, `! LEN : ${len}`);
    ext_common.piboTellWithoutBg(M.t(introment), 'breath3');
    ext_common.piboPlay({category: 'meditation', src:meditationData.metadata.src}, 'breath_long');
    ext_common.showDisplay(title, len);
    ext_common.piboTellWithoutBg(ext_common.choiceTell(M.t(closement, { nickName: ext_language.plusJosa(userNickName)})), 'speak');
  }catch(err){
    logger.error(moduleName, `# logic.err : ${err}`)
  }
}

exports.end = (param, api) => {
  api.motion.stop();
  api.heart.off();
};


