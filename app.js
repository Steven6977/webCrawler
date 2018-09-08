const Crawler = require("./utils/Crawler"),
  User = require("./model/User"),
  Progress = require("./model/Progress"),
  Service = require("./utils/Service"),
	{ log, connect, unconnect } = require("./utils"),
	Dao = require("./Dao");

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
		rateLimit: 1000,
		
		_httpHeader: httpHeader
    });
		this.level = level;
		this.entry = entry;
		this.finished = finished;
    this.database = database;
  }

  start() {
    let { url_token } = this.entry;
		
		connect(this.database).then(pool => {
			this.service = new Service(new Dao(pool));
			this.readProgress();
			this.analyzeStart(url_token, 0);
		}).catch(e => {
			console.error(e);
		})

  }

  readProgress() {
    this.map = new Map();
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
		await this.loop(user.getUrl("followers"), progress, "followers");
		
		logger.debug(`analyzing ${url_token} - followees`);
		await this.loop(user.getUrl("followees"), progress, "followers");
		
		logger.debug(`analyzeEnd ${url_token}`);
		await this.service.progessDone(progress);

		if(progress.level < this.level) {
			let next = await this.service.selectNext();
			console.log(next);
		}else {
			this.finished();
		}

  }


	async loop(uri, progress, type) {
		let { error, res, done } = await this.crawler.promiseQueue([{uri}]);
		done();

    if (error) {
      logger.error(error);
    } else {
      let respBody = JSON.parse(res.body),
      	nextUrl = respBody.paging.next,
        nextUrlParam = new UrlParam(nextUrl),
        offset = nextUrlParam.get("offset") - 20;

			let users = [], pros = [];
      respBody.data.forEach(e => {
				users.push(new User(e));
				pros.push(new Progress({
					url_token: e.url_token,
					level: progress.level + 1
				}))
			});
			
      //save user info
			await this.service.saveObjects(users);
			
			//save progress to be done
			await this.service.saveObjects(pros);

			//update progress, update progress
			progress[`${type}_offset`] = offset;
      await this.service.progessUpdate(progress);


      //see if this is the end
      if (respBody.paging.is_end) {
        return type;
      } else {
        await this.loop(next, progress, type);
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
