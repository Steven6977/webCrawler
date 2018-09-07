class Progress {
  constructor({
    url_token,
    level
  }) {
    this.url_token = url_token;
    this.level = level;
    this.followers_page = 0;
    this.followees_page = 0;
    this.done = 0;
  }

  print() {
    let str = "";
    for (let key of Object.keys(this)) {
      str += `${key}: ${this[key]} `;
    }
    console.log(str);
  }
}

module.exports = Progress;
