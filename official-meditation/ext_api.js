const axios = require('axios');
const ext_common = require('./ext_common')
exports.getMeditationData = async(url, robotId, clientType, topic) => {
  
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: url,
      headers: {
        'x-client-type': clientType,
        'x-client-id': robotId,
      },
      params: {
        'category': 'meditation',
        'genre': topic,
      },
    }).then(res => {
      console.log(res)
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