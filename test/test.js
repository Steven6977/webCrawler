const Crawler = require("../utils/Crawler");
const {log} = require("../utils");

let crawler = new Crawler({
  maxConnections: 4,
  rateLimit: 100,
  _httpHeader: {
    'Cookie': '_zap=9a0a2f36-3fcd-4a2a-9dea-1ca84df992f4; __DAYU_PP=EUMjmiYVfVYMrmUjvvENffffffff8266e3bef266; d_c0="AMAl0Wl7sg2PTpPKqVqHG5zXwJu0AkHF2S8=|1528096029"; __utmv=51854390.100--|2=registration_date=20111021=1^3=entry_date=20111021=1; _xsrf=27e6340d-bd45-44c9-8cdb-76a98b6df3fa; q_c1=68a4804edebf4027b3ad582b7875bbea|1534241432000|1522637959000; __utma=51854390.235495985.1530522142.1530522142.1535449156.2; __utmc=51854390; __utmz=51854390.1535449156.2.2.utmcsr=zhihu.com|utmccn=(referral)|utmcmd=referral|utmcct=/people/yangluhao/followers; capsion_ticket="2|1:0|10:1536353918|14:capsion_ticket|44:YTUxNzNlMTcxMDhmNDQ2ZGJiMjQ4NGVjYjkwYWMyZGM=|b94748d7e35314fc45df55c6f81da45127c1ba9b4448b854dc8914e12e7ac7b1"; z_c0="2|1:0|10:1536353931|4:z_c0|92:Mi4xTGdXa0NBQUFBQUFBd0NYUmFYdXlEU1lBQUFCZ0FsVk5pelNBWEFBMFlrZDR0RHFZZm9ad3FFdkVMQ0tSNXlyeHFR|8bad607ea023a67de0018d0ddb3f94cb032b32d0a1a7d318865e7a851751aa5a"; tgw_l7_route=200d77f3369d188920b797ddf09ec8d1'
  }
});

async function start() {
  console.log('start')
  try{
    let {error, res } = await crawler.promiseQueue([{
      uri: 'https://www.zhihu.com/api/v4/members/ghost-shing/followees?include=data%5B*%5D.answer_count%2Carticles_count%2Cgender%2Cfollower_count%2Cis_followed%2Cis_following%2Cbadge%5B%3F(type%3Dbest_answerer)%5D.topics&offset=0&limit=20',
      jQuery: false
    }]);
    
  
    if(error){
      console.error(error);
    }else{
      console.info(res.body);
    }
    
  }catch(e){
    console.error(e)
  }
  console.log('end')
}

//start();




