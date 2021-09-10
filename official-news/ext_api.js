const axios = require('axios');
const ext_common = require('./ext_common');

exports.get_naver_api = async (keyword, NAVER_URL, NAVER_ID, NAVER_KEY) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: NAVER_URL,
      params: {
        query: `${keyword}`,
      },
      headers: {
        'Content-Type': 'application/json',
        'X-NCP-APIGW-API-KEY-ID': NAVER_ID,
        'X-NCP-APIGW-API-KEY': NAVER_KEY,
      },
    }).then(res => {
      if (res.data.code){
        ext_common.errorCheck(res.data.code.toString())
        resolve(false)
      }
      resolve(res.data)
    }).catch(err => {
      ext_common.errorCheck(err.toString())
      resolve(false)
    })
  })
}

exports.getNewsData = (url, clientType, robotId, typeData) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: url + '/v1/news',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-client-type': clientType,
        'x-client-id': robotId,
      },
      data: {
        type: typeData,
      },
    }).then(res => {
      if (res.data.code){
        ext_common.errorCheck(res.data.code.toString())
        resolve(false)
      }
      resolve(res.data)
    }).catch(err => {
      ext_common.errorCheck(err.toString())
      resolve(false)
    })
  })
}

exports.getCovidData = (url, clientType, robotId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: url+'/v1/covid19',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-client-type': clientType,
        'x-client-id': robotId,
      },
    }).then(res => {
      if (res.data.code){
        ext_common.errorCheck(res.data.code.toString())
        resolve(false)
      }
      resolve(res.data)
    }).catch(err => {
      ext_common.errorCheck(err.toString())
      resolve(false)
    })
  })
}
