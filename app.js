const Crawler = require("./utils/Crawler"),
  User = require("./model/User"),
  Progress = require("./model/Progress"),
  Service = require("./utils/Service"),
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

class App {
  constructor({ database, maxConnections = 4, rateLimit = 0 }) {
    this.crawler = new Crawler({
      maxConnections: maxConnections,
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
  start({ entry, httpHeader, level, finished }) {
    let { url_token } = entry;
    if (url_token == null || url_token == "") {
      console.log("url_token is empty! exiting...");
      return;
    }

    this.level = level;

    //merge together http header
    finalHttpHeader = Object.assign({}, HEADER, httpHeader);

    readProgress();

    //start searching
    this.analyzeStart(url_token, 0);
  }

  readProgress() {
    this.map = new Map();
  }

  async analyzeStart(url_token, level) {
    console.log(`analyzeStart ${url_token}`);
    try {
      await this.service.progressInsert(url_token, level);
    } catch (e) {
      console.log(e);
    }

    console.log(`analyzing ${url_token}`);
    this.analyzing(userConn, "followers");
  }

  async analyzing(userConn, type, nextUrl) {
    let url = userConn.url[type];

    let { error, res, done } = await this.crawler.promiseQueue([
      {
        uri: nextUrl ? nextUrl : url,
        jQuery: false,

        preRequest: function(options, done) {
          options.headers = finalHttpHeader;
          done();
        }
      }
    ]);

    if (error) {
      console.error(error);
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

      //update progress, insert new progress
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
    console.log(`analyzeEnd ${url_token}`);

    try {
      await this.service.progessDone(url_token);
      //select next user to start analyzing
      nextUser = await this.service.selectNextUser();
    } catch (e) {
      console.log(e);
    }
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
