const Crawler = require("./utils/Crawler"),
  User = require("./model/User"),
  Progress = require("./model/Progress"),
  Service = require("./utils/Service"),
  { log } = require("../utils");

const logger = log("./run.log");


class App {
  constructor({ 
		database,
		httpHeader,
		entry,
		level,
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
    this.service = new Service(database);
  }

  start() {
    let { url_token } = this.entry;
    if (!url_token) {
      console.log("url_token is empty! exiting...");
      return;
    }

    readProgress();

    //start searching
    this.analyzeStart(url_token, 0);
  }

  readProgress() {
    this.map = new Map();
  }

  async analyzeStart(url_token, level) {
    logger.debug(`analyzeStart ${url_token}`);
    let progress = new Progress({
      url_token,
      level
    });
    await this.service.progressInsert(progress);
    //analyze followers firstly
    this.analyzing(
      new User({
        url_token
			}),
			progress
    );
  }

  async analyzing(user, progress) {
		logger.debug(`analyzing ${url_token}`);

    let url = user._url["followers"];
		await send(url,)
    
	}
	
	async send(url,) {
		let { error, res, done } = await this.crawler.promiseQueue([
      {
        uri: url,
        jQuery: false
      }
    ]);

    if (error) {
      logger.error(error);
    } else {
      let respBody = JSON.parse(res.body),
        users = [],
        next = respBody.paging.next,
        urlParam = new UrlParam(next),
        offset = urlParam.get("offset");

      respBody.data.forEach(e => {
        let u = new User(e);
        users.push(u);
      });

      //save user info
      await this.service.saveUsers(users);

      //update progress, update progress
      await this.service.progessUpdate(userConn.user.url_token, type, offset);
      for (const user of users) {
        await this.service.progressInsert(user.url_token);
      }

      //see if this is the end
      if (respBody.paging.is_end) {
        this.analyzeEnd(userConn, type);
      } else {
        this.analyzing(userConn, type, next);
      }
    }
    done();
	}

  async analyzeEnd(userConn, type) {
    if (type == "followers") {
      this.analyzing(userConn, "followees");
      return;
    }

    //userConn.print();

    let url_token = userConn.user.url_token;
    let nextUser = null;
    logger.debug(`analyzeEnd ${url_token}`);

    await this.service.progessDone(url_token);
    //select next user to start analyzing
    nextUser = await this.service.selectNextUser();

    if (nextUser == null) {
      console.log("can not find the next user waiting for analyzed");
      return;
    }
    this.analyzeStart(nextUser.url_token);
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
