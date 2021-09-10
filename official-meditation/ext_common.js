const M = require('i18next');
const ko = require('./lang_ko.json');
const en = require('./lang_en.json');
let api
let moduleName
let lang
exports.init = (a, language, modulename) => {
    api = a
    moduleName = modulename
    lang = language
    M.init({
        resources: {
          en: {
            bot: en.OFFICIAL_MEDITATION,
          },
          ko: {
            bot: ko.OFFICIAL_MEDITATION,
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

exports.choiceTell = (ObjectTell) => {
    let tell = api.util.sample(Object.values(ObjectTell));
    return tell;
};

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

exports.piboPlay = (query, motion) => {
    api.pibo.play({query: query}, {
        motion: motion,
        volume: 2,
    })
}
exports.showDisplay = (title, len) => {
    const T = title.replace(/_/gi, ' ') + '                 ';
    const minute = parseInt(len / 60).toString();
    const second = parseInt(len % 60).toString();

    const M = minute.length === 1 ? '0' + minute : minute;
    const S = second.length === 1 ? '0' + second : second;

    api.heart.top(T);
    api.heart.bottom(`${M}:${S}`);
    api.play.event((key, data) => {
        api.heart.bottom(data.time);
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