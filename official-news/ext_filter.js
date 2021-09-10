const _ = require('lodash');

exports.clearKeyword = (list) => {
  // 단어로 들어올 때
  _.remove(list, function (str) {
    return (
      str == '테스트' ||
      str == '뉴스' ||
      str == '파' ||
      str == '코로나' ||
      str == '내일' ||
      str == '오늘' ||
      str == '제' ||
      str == '것' ||
      str == '농' ||
      str == '려조' ||
      str == '로조' ||
      str == '이보' ||
      str == '졍' ||
      str == '정보' ||
      str == '상황' ||
      str == '지역' ||
      str == '확진' 
    );
  });

  // 단어가 쪼개져서 들어올 때
  let keyword = list.join(' ').replace('파이보', '');
  // 남은 keyword가 원하는 단어가 아닐 때
  if (list.includes('종시')) {
    keyword = keyword.replace('종시', '세종시');
  } else if (list.includes('로동')) {
    keyword = keyword.replace('로동', '을지로동');
  } else if (list.includes('한강')) {
    keyword = keyword.replace('한강', '한강로');
  } else if (list.includes('남가')) {
    keyword = keyword.replace('남가', '남가좌');
  } else if (list.includes('북가자')) {
    keyword = keyword.replace('북가자', '북가좌');
  } else if (list.includes('태조야동')) {
    keyword = keyword.replace('태조야동', '무태조야동');
  } else if (list.includes('구')) {
    keyword = keyword.replace('구', '구의');
  } else if (list.includes('방')) {
    keyword = keyword.replace('방', '방이');
  } 

  return keyword;
};

exports.cleanText = (text) => {
  let cleanData = text
    .replace(/039;/gi, '')
    .replace(/ARS/gi, '<sub alias="에이알에스">ARS</sub>')
    .replace(/MR/gi, '<sub alias="엠알">MR</sub>')
    .replace(/ - 머니S/gi, '')
    .replace(/- ITDaily/gi, '')
    .split(' | ')[0];

  let cleanData2 = cleanData;
  if (cleanData.includes('기자 -')) {
    cleanData2 = cleanData.split('-')[0];
  }

  return cleanData2;
};

exports.selectTopic = (token) => {
  let topic = 'total';
  if (token.includes('아이티') || token.includes('IT') || token.includes('it')) {
    topic = 'it';
  } else if (token.includes('연예') || token.includes('연애')) {
    topic = 'ent';
  } else if (token.includes('경제') || token.includes('economy')) {
    topic = 'economy';
  } else if (token.includes('사회') || token.includes('social')) {
    topic = 'social';
  } else if (token.includes('정치') || token.includes('politics')) {
    topic = 'politics';
  } else if (token.includes('스포츠') || token.includes('sports')) {
    topic = 'sports';
  }
  return topic
}