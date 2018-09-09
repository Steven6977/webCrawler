const Crawler = require("./utils/Crawler"),
  User = require("./model/User"),
  Progress = require("./model/Progress"),
  Service = require("./utils/Service"),
	{ log, connect, unconnect } = require("./utils"),
	Dao = require("./utils/Dao");

const logger = log("./run.log");


class App {
  constructor({ 
		database=null,
		httpHeader=null,
		entry=null,
		level=0,
		finished
	}) {
    this.crawler = new Crawler({
      
    /**
     * the thing is, if the http requests is sending too fast, the server will just reject
     */
    maxConnections: 4,
    /**
     * slow down, maxConnections will be forced to 1 if rateLimit is passed!
     * rateLimit 1000 means sending request at interval of 1 second
     */
		//rateLimit: 100,
		
		_httpHeader: httpHeader
		
		});
		this.level = level;
		this.entry = entry;
		this.finished = finished;
    this.database = database;
  }

  async start() {
		let { url_token } = this.entry;
		// this.crawler.on('drain',function(){
		// 	console.log('drain...');
		// });

		try{
			let pool = await connect(this.database);
			this.service = new Service(new Dao(pool));
			this.readProgress();
			this.analyzeStart(url_token, 0);
		}catch(e) {
			console.error(e);
		}
  }

  readProgress() {
    //select next url_token from progress
  }

  async analyzeStart(url_token, level) {
		let progress = new Progress({
      url_token,
      level
		});

		logger.debug(`analyzeStart ${url_token}`);
    await this.service.progressInsert(progress);
    
		let user = new User({url_token});

		logger.debug(`analyzing ${url_token} - followers`);
		let followers_count = await this.loop(user.getUrl("followers"), progress, "followers");
		
		logger.debug(`analyzing ${url_token} - followees`);
		let followees_count = await this.loop(user.getUrl("followees"), progress, "followers");
		
		logger.debug(`analyzeEnd ${url_token}`);
		await this.service.progessDone(progress);

		logger.debug(`${url_token}(level ${level}) has ${followers_count} followers and ${followees_count} followees`);

		let next = await this.service.selectNext();
		if(next.level < this.level) {
			logger.debug(`next url_token is ${next.url_token}`);
			logger.debug(`${next.level} | ${this.level}`);
			this.analyzeStart(next.url_token, next.level);
		}else {
			logger.debug("All done!");
			await unconnect(this.service.dao.pool);
			this.finished();
		}

  }


	async loop(uri, progress, type) {
		let { error, res } = await this.crawler.promiseQueue([{uri}]);

    if (error) {
      logger.error(error);
    } else {
			let respBody = JSON.parse(res.body);
			let nextUrl, nextUrlParam, offset;
			try{
				nextUrl = respBody.paging.next;
        nextUrlParam = new UrlParam(nextUrl);
			}catch(e) {
				console.error(e);
				console.error(respBody);
			}
			offset = nextUrlParam.get("offset") - 20;

			let users = [], pros = [];
      respBody.data.forEach(e => {
				users.push(new User(e));
				pros.push(new Progress({
					url_token: e.url_token,
					level: progress.level + 1
				}));
			});
			
			logger.debug(users.map(e => e.name).join(","));

      //save user info
			await this.service.saveObjects(users);

			//save progress to be done
			await this.service.saveObjects(pros);

			//update progress, update progress
			progress[`${type}_offset`] = offset;
      await this.service.progessUpdate(progress);

			//see if this is the end
      if (respBody.paging.is_end) {
        return respBody.paging.totals;
      } else {
        return await this.loop(nextUrl, progress, type);
      }
		}	
	}


	
}

class UrlParam {
  constructor(url) {
    let p = url.split("?");
    if (p.length > 1) {
      this.param = p[p.length - 1];
    } else {
      this.param = p[0];
    }
    this.map = new Map();
    let keyvalues = this.param.split("&");
    for (let kvalue of keyvalues) {
      let kv = kvalue.split("=");
      if (kv.length == 2) {
        this.map.set(kv[0], kv[1]);
      }
    }
  }

  get(key) {
    return this.map.get(key);
  }
}

module.exports = App;
