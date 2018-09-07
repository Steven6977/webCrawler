const Crawler = require("../utils/Crawler");


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
    console.log('...')
  
    if(error){
      console.log(error);
    }else{
      console.log('Grabbed', res.body.length, 'bytes');
    }
    done();
  }catch(e){
    console.log(e)
  }

}

start();




