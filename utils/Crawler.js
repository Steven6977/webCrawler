let crawler = require("crawler");
//customed http header, Authorization and Cookie need to be filled
const HEADER = {
  accept: "application/json, text/plain, */*",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
  "Cache-Control": "max-age=0",
  "Connection": "keep-alive"
};

class Crawler extends crawler {
  constructor(opts) {
    if(opts._httpHeader) {
      opts.preRequest = (options, done) => {
        options.headers = Object.assign({}, HEADER, opts._httpHeader);
        done();
      }
    }
    super(opts);
  }

  promiseQueue(opts) {
    return new Promise((resolve, reject) => {
      opts.forEach(opt => {
        opt.jQuery = false;
        opt.callback = (error, res, done) => {
          if (error) {
            console.error(error);
            reject({
              error
            });
          } else {
            resolve({
              res,
              done
            });
          }
        };
      });
      this.queue(opts);
    });
  }
}

module.exports = Crawler;
