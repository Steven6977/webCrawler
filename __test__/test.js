const Crawler = require("../utils/Crawler");
const {log} = require("../utils");
logger = log("./test.log");

let crawler = new Crawler({
  maxConnections: 4,
  rateLimit: 100
});

async function start() {
  console.log('start')
  try{
    let {error, res, done} = await crawler.promiseQueue([{
      uri: 'http://google.com/',
      jQuery: false
    }]);
    
  
    if(error){
      logger.error(error);
    }else{
      logger.info('Grabbed', res.body.length, 'bytes');
    }
    done();
  }catch(e){
    logger.error(e)
  }
  console.log('end')
}

start();




