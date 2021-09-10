const M = require('i18next');
const ko = require('./lang_ko.json');
const en = require('./lang_en.json');
let api;
let moduleName;
let lang;

exports.init = (a, language, modulename) => {
  api = a;
  lang = language
  moduleName = modulename;
  M.init({
    resources: {
      en: {
        bot: en.OFFICIAL_NEWS,
      },
      ko: {
        bot: ko.OFFICIAL_NEWS,
      },
    },
    lng: lang,
    fallbackLng: lang,
    debug: false,
    ns: ['bot'],
    defaultNS: 'bot',
    interpolation: {
      escapeValue: false,
    },
    returnObjects: true,
    returnedObjectHandler: true,
    joinArrays: true,
    keySeparator: true,
  });
  return M
}

exports.piboTell = (tell, motion, music) => {
  api.logger.info(moduleName, `# piboTell : ${tell}`);
  api.pibo.tell(`<speak><prosody rate='70%'>${tell}</prosody></speak>`, {
    lang: lang,
    play: {query: {category: 'core', src: music}},
    motion: motion,
  });
};

exports.piboTellWithoutBg = (tell, motion) => {
  api.logger.info(moduleName, `# piboTellWithoutBg : ${tell}`);
  api.pibo.tell(`<speak><prosody rate='70%'>${tell}</prosody></speak>`, {
    lang: lang,
    motion: motion,
  });
};

exports.errorCheck = (text) => {
  api.logger.error(moduleName, `# getData.err : ${text}`);
  let e = text.split(' ');
  let errorCode = Number(e.pop());
  
  if (errorCode >= 400 && errorCode < 500) {
      errorCode = 'API_ERR_400'
  } else {
      errorCode = 'API_ERR_500'
  }
  this.piboTellWithoutBg(M.t(errorCode), 'speak');
};

exports.piboMotion = (api) => {
  const motions = ['speak', 'hand1', 'cheer', 'hey', 'greeting'];

  api.speak.event((key, data) => {
    if (data.state > 0) {
      const motion = api.util.sample(motions);
      api.motion(motion);
    }
  });
};
