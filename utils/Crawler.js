let crawler = require("crawler");

class Crawler extends crawler{

  constructor(opts) {
    super(opts)
  }

  promiseQueue(opts) {
    return new Promise((resolve, reject) => {
      opts.forEach((opt) => {
        opt.callback = (error, res, done) => {
          if (error) {
            console.error(error);
            reject({
              error
            });
          } else {
            resolve({
              res, done
            });
          }
        }
      });
      this.queue(opts)
    });
  }

}



module.exports = Crawler;