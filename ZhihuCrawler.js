const Crawler = require("crawler"),
  EventEmitter = require("events").EventEmitter,
  //my custom modules
  { User, UserConnection } = require("./User"),
  Dao = require("./Dao"),
  //private methods
  analyzing = Symbol(),
  analyzeStart = Symbol(),
  analyzeEnd = Symbol(),
  //events
  WORKEND = Symbol(),
  //states
  STATE = {
    START: 0,
    END: 2
  },
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

  constructor({
    database = null,
    maxDepth = 1, 
	maxConnections = 5,
	rateLimit = 0
  }) {
    this.maxDepth = maxDepth;

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
      this.dao = new Dao(database);
    }

    this.hadDone = new Set();
    this.eventDriver = new EventEmitter();

    this[analyzeEnd] = this[analyzeEnd].bind(this);
  }

  /**
   * start the task
   */
  start({ entry, httpHeader, finished }) {
    this.dao.init().then(() => {
      let { name, url_token } = entry;
      if (url_token == null || url_token == "") {
        console.log("url_token is empty! exiting...");
        return;
      }

      console.log(`entry 
		-name: ${name}
		-url_token: ${url_token}
		-maxDepth: ${this.maxDepth}
		`);

      if (typeof finished == "function") {
        this.crawler.on("drain", function() {
          finished();
        });
      }

      //merge together http header
      finalHttpHeader = Object.assign({}, HEADER, httpHeader);

      //start searching
      this[analyzeStart](
        {
          name,
          url_token
        },
        1
      );
    });
  }

  /**
   * you can save use to database or file
   */
  handleUser(users) {
	//sometimes may insert failed for duplicating, but it's normal, because some peolple just following each other
    this.dao.bulkInserts(users).then(rows => {
      let names = users.map(u => u.name);
      console.log(names.join(","));

	  if(rows == null)return;

      if (rows.affectedRows !== users.length) {
        let failed = users.length - rows.affectedRows;
        console.log(`\n ${failed} item(s) inserted failing \n`);
      }
    }).catch(e => console.log(e));
  }

  /**
   * ========================================================================================
   * private methods
   */

  [analyzeEnd](userConn) {
    userConn.state++;
    if (userConn.state === STATE.END) {
      //userConn.print();

      let stop = userConn.depth >= this.maxDepth;
      //send ending signal
      if (!stop) {
        //traversing followees
        for (const followee of userConn.followees.values()) {
          this[analyzeStart](followee, userConn.depth + 1);
        }

        //add followers
        for (const follower of userConn.followers.values()) {
          this[analyzeStart](follower, userConn.depth + 1);
        }
      }

      this.eventDriver.removeListener(
        userConn.user.url_token,
        this[analyzeEnd]
      );
      userConn.followees = null;
      userConn.followers = null;
      userConn = null;
    }
  }

  [analyzeStart](user, depth) {
    if (this.hadDone.has(user.url_token)) {
      return;
    }

    this.hadDone.add(user.url_token);

    let userConn = new UserConnection(user, depth);
    userConn.depth = depth;
    userConn.state = STATE.START;

    this[analyzing](userConn, "followers");
    this[analyzing](userConn, "followees");

    //listener, check whether traversing the user is done
    this.eventDriver.on(user.url_token, this[analyzeEnd]);
  }

  [analyzing](userConn, type, nextUrl) {
    let url = userConn.url[type];
    let targetSet = userConn[type],
      user = userConn.user;

    let self = this;
    this.crawler.queue([
      {
        uri: nextUrl ? nextUrl : url,
        jQuery: false,

        preRequest: function(options, done) {
          options.headers = finalHttpHeader;
          done();
        },

        callback: function(error, res, done) {
          if (error) {
            console.error(error);
          } else {
            try {
              let respBody = JSON.parse(res.body)
            	,users = [];

              respBody.data.forEach(e => {
                let u = new User(e);
                targetSet.add(u);
                users.push(u);
              });

              self.handleUser(users);

              if (respBody.paging.is_end) {
                self.eventDriver.emit(user.url_token, userConn);
              } else {
                let next = respBody.paging.next;
                self[analyzing](userConn, type, next);
              }
            } catch (e) {
              console.log("catch error ", e);
            }
          }
          done();
        }
      }
    ]);
  }
}

module.exports = ZhihuCrawler;
