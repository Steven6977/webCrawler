const User = require("../model/User"),
  Dao = require("./Dao");

class Service {
  constructor(dao) {
    this.dao = dao;
  }

  async saveObjects(objs) {
    //sometimes may insert failed for duplicating, but it's normal.
    // because some peolple just following each other
    this.dao.bulkInserts(objs);
  }

  async selectNext() {
    try {
      let rows = await this.dao.execute(
        "select url_token from progress where done=0 limit 1"
      );
      if (rows != null && rows.length > 0) {
        return rows[0];
      }
    } catch (e) {
      console.log(e);
    }
    return null;
  }

  async progressInsert({ url_token, level }) {
    try {
      await this.dao.execute(
        "insert into progress(url_token, level) values ?",
        [[url_token, level]]
      );
    } catch (e) {
      console.log(e);
    }
  }

  async progessUpdate({ url_token, followers_offset, followees_offset }) {
    
    try {
      await this.dao.execute(
        "update progress set ? where ?",
        {
          followers_offset,
          followees_offset
        },
        {
          url_token: url_token
        }
      );
    } catch (e) {
      console.log(e);
    }
  }

  async progessDone({ url_token }) {
    try {
      await this.dao.execute(
        "update progress set ? where ?",
        {
          done: 1
        },
        {
          url_token
        }
      );
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Service;
