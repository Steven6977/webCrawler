const Crawler = require("crawler"),
  EventEmitter = require("events").EventEmitter,
  //my custom modules
  { User, UserConnection } = require("./User"),
  Service = require("./Service"),
  //private methods
  analyzing = Symbol(),
  analyzeStart = Symbol(),
  analyzeEnd = Symbol(),
  //customed http header, Authorization and Cookie need to be filled
  HEADER = {
    accept: "application/json, text/plain, */*",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
    Authorization: "",
    Cookie: "",
    "Cache-Control": "max-age=0",
    Connection: "keep-alive"
  };

let finalHttpHeader = null;

/**
 * ==========================================================================================================================
 */

class ZhihuCrawler {
  constructor({ database, maxConnections = 5, rateLimit = 0 }) {
    this.crawler = new Crawler({
      /**
       * the thing is, if the http requests is sending too fast, the server will just reject
       */
      maxConnections: maxConnections,
      /**
       * slow down, maxConnections will be forced to 1 if rateLimit is passed!
       * so, there will only be one connection at the meantime
       */
      rateLimit: rateLimit
    });
    if (database != null) {
      this.service = new Service(database);
    } else {
      console.log("please config databases");
    }
  }

  /**
   * start the task
   */
  start({ entry, httpHeader, finished }) {
    let { url_token } = entry;
    if (url_token == null || url_token == "") {
      console.log("url_token is empty! exiting...");
      return;
    }

    if (typeof finished == "function") {
      this.crawler.on("drain", function() {
    	finished();
      });
    }

    //merge together http header
    finalHttpHeader = Object.assign({}, HEADER, httpHeader);

    //start searching
    this[analyzeStart](url_token);
  }

  async handle(res, userConn, type, nextUrl) {
	let respBody = JSON.parse(res.body),
	  users = [],
	  next = respBody.paging.next,
	  urlParam = new UrlParam(next),
	  off = urlParam.get("offset"),
	  collection = userConn[type];
	
	respBody.data.forEach(e => {
		let u = new User(e);
		collection.add(u);
		users.push(u);
	});

	try{
		//save user info
		await this.service.saveUsers(users);

		//update progress, insert new progress
		await this.service.progessUpdate(userConn.user.url_token, type, off)
		for(const user of users) {
			await this.service.progressInsert(user.url_token)
		}
	}catch(e) {
		console.log(e)
	}

	//see if this is the end
	if (respBody.paging.is_end) {
		this[analyzeEnd](userConn, type);
	} else {
		this[analyzing](userConn, type, next);
	}

  }

  /**
   * ========================================================================================
   * private methods
   */

  async [analyzeEnd](userConn, type) {
    if (type == "followers") {
      this[analyzing](userConn, "followees");
      return;
    }

	//userConn.print();
	

    let url_token = userConn.user.url_token;
	let nextUser = null;
	console.log(`${url_token} done !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`)
	try{
		await this.service.progessDone(url_token);
    	//select next user to start analyzing
    	nextUser = await this.service.selectNextUser()
	}catch(e) {
		console.log(e)
	}
    
	if (nextUser == null) {
		console.log('can not find the next user waiting for analyzed')
		return;
	}
	this[analyzeStart](nextUser.url_token);
  }

  async [analyzeStart](url_token) {
	try{
		await this.service.progressInsert(url_token);
	}catch(e) {
		console.log(e)
	}
    
    let userConn = new UserConnection({
        url_token
    });

    this[analyzing](userConn, "followers");
  }

  //because crawler uses callback, so i can't use async/await
  [analyzing](userConn, type, nextUrl) {
    let url = userConn.url[type];

    this.crawler.queue([
      {
        uri: nextUrl ? nextUrl : url,
        jQuery: false,

        preRequest: function(options, done) {
          options.headers = finalHttpHeader;
          done();
        },

        callback: (error, res, done) => {
          if (error) {
            console.error(error);
          } else {
            try {
			  //handle the response
			  this.handle(res, userConn, type, nextUrl);
            } catch (e) {
              console.log(e);
            }
          }
          done();
        }
      }
    ]);
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

module.exports = ZhihuCrawler;
