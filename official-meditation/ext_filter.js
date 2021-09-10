const Josa = require('josa-js');
const moment = require('moment');

exports.selectTopic = (token) => {
  let topic;
  topic =
  Number(moment().format('HH')) < 11
    ? 'morning'
    : Number(moment().format('HH')) > 20
    ? 'evenig'
    : 'basic';

  if (token.includes('아침')) {
    topic = 'morning';
  } else if (token.includes('저녁')) {
    topic = 'evening';
  } else if (token.includes('바디')) {
    topic = 'activity_2';
  } else if (token.includes('빛줄기') || token.includes('줄기')) {
    topic = 'activity_4';
  } else if (token.includes('근육')) {
    topic = 'activity_1';
  } else if (token.includes('복식')) {
    topic = 'activity_3';
  } else if (token.includes('마음')) {
    topic = 'activity_5';
  }
  return topic
};
  
exports.selectMent = (topic) => {
  let introment; 
  let closement;
  switch (topic) {
    case 'basic' :
      introment = 'INTRO_BASIC';
      closement = 'CLOSE_BASIC';
    case 'morning' :
      introment = 'INTRO_BASIC';
      closement = 'CLOSE_MORNING';
    case 'evening' :
      introment = 'INTRO_BASIC';
      closement = 'CLOSE_EVENING';
    default:
      introment = 'INTRO_ACTIVITY';
      closement = 'CLOSE_ACTIVITY';
  }
  
  return [introment, closement]
};

exports.plusJosa = (name) => {
  const josa = Josa.c(name, '이/가');
  const nameWithJosa = josa === '이' ? name + josa : name;
  return nameWithJosa;
};
